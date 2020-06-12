// @flow

import React, {
  Component,
  // $FlowFixMe `useContext`
  useContext,
  type ComponentType,
  type Node,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

import { ToastController } from './ToastController';
import { ToastContainer, type ToastContainerProps } from './ToastContainer';
import { type ToastProps, DefaultToast } from './ToastElement';
const defaultComponents = { Toast: DefaultToast, ToastContainer };

import { generateUEID, NOOP, omit } from './utils';
import type {
  AddFn,
  UpdateFn,
  RemoveFn,
  Callback,
  ToastsType,
  Options,
  Placement,
  Id,
} from './types';

const contexts = {};

const DEFAULT_CONTEXT_NAME = 'default';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// Provider
// ==============================

type Components = {
  Toast: ComponentType<ToastProps>,
  ToastContainer: ComponentType<ToastContainerProps>,
};
type Props = {
  // A convenience prop; the time until a toast will be dismissed automatically, in milliseconds.
  // Note that specifying this will override any defaults set on individual children Toasts.
  autoDismissTimeout: number,
  // Whether or not to dismiss the toast automatically after autoDismissTimeout.
  autoDismiss: false,
  // Unrelated app content
  children: Node,
  // Component replacement object
  components: Components,
  // Where, in relation to the viewport, to place the toasts
  placement: Placement,
  // A convenience prop; the duration of the toast transition, in milliseconds.
  // Note that specifying this will override any defaults set on individual children Toasts.
  transitionDuration: number,
  name: string,
};
type State = {
  toasts: ToastsType,
  context: Object,
};
type Context = {
  add: AddFn,
  remove: RemoveFn,
  removeAll: () => void,
  update: UpdateFn,
  toasts: Array<Object>,
};

export class ToastProvider extends Component<Props, State> {
  static defaultProps = {
    name: DEFAULT_CONTEXT_NAME,
    autoDismiss: false,
    autoDismissTimeout: 5000,
    components: defaultComponents,
    placement: 'top-right',
    transitionDuration: 220,
  };

  constructor(props: Props) {
    super(props);

    contexts[props.name] = contexts[props.name] || React.createContext();
    const context = contexts[props.name];

    this.state = {
      toasts: [],
      context,
    };
  }

  // Internal Helpers
  // ------------------------------

  has = (id: Id) => {
    if (!this.state.toasts.length) {
      return false;
    }

    return Boolean(this.state.toasts.filter(t => t.id === id).length);
  };
  onDismiss = (id: Id, cb: Callback = NOOP) => () => {
    cb(id);
    this.remove(id);
  };

  // Public API
  // ------------------------------

  add = (content: Node, options?: Options = {}, cb: Callback = NOOP) => {
    const id: Id = options.id || generateUEID();
    const callback = () => cb(id);

    // bail if a toast exists with this ID
    if (this.has(id)) {
      return;
    }

    // update the toast stack
    this.setState(state => {
      const newToast = { content, id, ...omit(options, 'id') };
      const toasts = [...state.toasts, newToast];

      return { toasts };
    }, callback);

    // consumer may want to do something with the generated ID (and not use the callback)
    return id;
  };
  remove = (id: Id, cb: Callback = NOOP) => {
    const callback = () => cb(id);

    // bail if NO toasts exists with this ID
    if (!this.has(id)) {
      return;
    }

    this.setState(state => {
      const toasts = state.toasts.filter(t => t.id !== id);
      return { toasts };
    }, callback);
  };
  removeAll = () => {
    if (!this.state.toasts.length) {
      return;
    }

    this.state.toasts.forEach(t => this.remove(t.id))
  };
  update = (id: Id, options?: Options = {}, cb: Callback = NOOP) => {
    const callback = () => cb(id);

    // bail if NO toasts exists with this ID
    if (!this.has(id)) {
      return;
    }

    // update the toast stack
    this.setState(state => {
      const old = state.toasts;
      const i = old.findIndex(t => t.id === id);
      const updatedToast = { ...old[i], ...omit(options, 'id') };
      const toasts = [ ...old.slice(0, i), updatedToast, ...old.slice(i + 1)];

      return { toasts };
    }, callback);
  };

  render() {
    const {
      autoDismiss: inheritedAutoDismiss,
      autoDismissTimeout,
      children,
      components,
      placement,
      transitionDuration,
    } = this.props;
    const { Toast, ToastContainer } = { ...defaultComponents, ...components };
    const { add, remove, removeAll, update } = this;
    const toasts = Object.freeze(this.state.toasts);

    const hasToasts = Boolean(toasts.length);
    const portalTarget = canUseDOM ? document.body : null; // appease flow
    const { Provider } = this.state.context;

    return (
      <Provider value={{ add, remove, removeAll, update, toasts }}>
        {children}

        {portalTarget ? (
          createPortal(
            <ToastContainer placement={placement} hasToasts={hasToasts}>
              <TransitionGroup component={null}>
                {toasts.map(
                  ({
                    appearance,
                    autoDismiss,
                    content,
                    id,
                    onDismiss,
                    ...unknownConsumerProps
                  }) => (
                    <Transition
                      appear
                      key={id}
                      mountOnEnter
                      timeout={transitionDuration}
                      unmountOnExit
                    >
                      {transitionState => (
                        <ToastController
                          appearance={appearance}
                          autoDismiss={autoDismiss !== undefined ? autoDismiss : inheritedAutoDismiss}
                          autoDismissTimeout={autoDismissTimeout}
                          component={Toast}
                          key={id}
                          onDismiss={this.onDismiss(id, onDismiss)}
                          placement={placement}
                          transitionDuration={transitionDuration}
                          transitionState={transitionState}
                          {...unknownConsumerProps}
                        >
                          {content}
                        </ToastController>
                      )}
                    </Transition>
                  )
                )}
              </TransitionGroup>
            </ToastContainer>,
            portalTarget
          )
        ) : (
          <ToastContainer placement={placement} hasToasts={hasToasts} /> // keep ReactDOM.hydrate happy
        )}
      </Provider>
    );
  }
}

export const ToastConsumer = ({
  name = DEFAULT_CONTEXT_NAME,
  children,
}: {
  name: string,
  children: Context => Node,
}) => {
  const context = contexts[name];
  if (!context) {
    throw Error('The `ToastConsumer` component must be nested as a descendent of the `ToastProvider`.');
  }
  const { Consumer } = context;
  return <Consumer>{ctx => children(ctx)}</Consumer>;
};

export const withToastManager = (
  Comp: ComponentType<*>,
  { name = DEFAULT_CONTEXT_NAME }: { name: string } = {}
) =>
  // $FlowFixMe `forwardRef`
  React.forwardRef((props: *, ref: Ref<*>) => (
    <ToastConsumer name={name}>
      {context => <Comp toastManager={context} {...props} ref={ref} />}
    </ToastConsumer>
  ));

export const useToasts = ({ name = DEFAULT_CONTEXT_NAME }: { name: string } = {}) => {
  const context = contexts[name] || {};
  const ctx = useContext(context);

  if (!ctx) {
    throw Error('The `useToasts` hook must be called from a descendent of the `ToastProvider`.');
  }

  return {
    addToast: ctx.add,
    removeToast: ctx.remove,
    removeAllToasts: ctx.removeAll,
    updateToast: ctx.update,
    toastStack: ctx.toasts,
  };
};
