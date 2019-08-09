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

import { generateUEID, NOOP } from './utils';
import type {
  AddFn,
  RemoveFn,
  Callback,
  ToastsType,
  Options,
  Placement,
  Id,
} from './types';

// $FlowFixMe `createContext`
const ToastContext = React.createContext();
const { Consumer, Provider } = ToastContext;

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
  // Unrelated app content
  children: Node,
  // Component replacement object
  components: Components,
  // Where, in relation to the viewport, to place the toasts
  placement: Placement,
  // A convenience prop; the duration of the toast transition, in milliseconds.
  // Note that specifying this will override any defaults set on individual children Toasts.
  transitionDuration: number,
};
type State = { toasts: ToastsType };
type Context = { add: AddFn, remove: RemoveFn, toasts: Array<Object> };

export class ToastProvider extends Component<Props, State> {
  components: Components;
  static defaultProps = {
    autoDismissTimeout: 5000,
    components: defaultComponents,
    placement: 'top-right',
    transitionDuration: 220,
  };

  constructor(props: Props) {
    super(props);
    this.cacheComponents(props.components);
    this.state = { toasts: [] };
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.components !== this.props.components) {
      this.cacheComponents(nextProps.components);
    }
  }
  cacheComponents = (components?: {}) => {
    this.components = {
      ...defaultComponents,
      ...components,
    };
  };

  add = (content: Node, options?: Options = {}, cb: Callback = NOOP) => {
    const id = generateUEID();
    const callback = () => cb(id);

    this.setState(state => {
      const toasts = state.toasts.slice(0);
      const toast = Object.assign({}, { content, id }, options);

      toasts.push(toast);

      return { toasts };
    }, callback);
  };
  remove = (id: Id, cb: Callback = NOOP) => {
    const callback = () => cb(id);

    this.setState(state => {
      const toasts = state.toasts.filter(t => t.id !== id);
      return { toasts };
    }, callback);
  };

  onDismiss = (id: Id, cb: Callback = NOOP) => () => {
    cb(id);
    this.remove(id);
  };

  render() {
    const {
      autoDismissTimeout,
      children,
      components,
      placement,
      transitionDuration,
    } = this.props;
    const { Toast, ToastContainer } = this.components;
    const { add, remove } = this;
    const toasts = Object.freeze(this.state.toasts);

    const hasToasts = Boolean(toasts.length);
    const portalTarget = canUseDOM ? document.body : null; // appease flow

    return (
      <Provider value={{ add, remove, toasts }}>
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
                          autoDismiss={autoDismiss}
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

export const ToastConsumer = ({ children }: { children: Context => Node }) => (
  <Consumer>{context => children(context)}</Consumer>
);

export const withToastManager = (Comp: ComponentType<*>) =>
  // $FlowFixMe `forwardRef`
  React.forwardRef((props: *, ref: Ref<*>) => (
    <ToastConsumer>
      {context => <Comp toastManager={context} {...props} ref={ref} />}
    </ToastConsumer>
  ));

export const useToasts = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw Error('The `useToasts` hook must be called from a descendent of the `ToastProvider`.');
  }

  return {
    addToast: ctx.add,
    removeToast: ctx.remove,
    toastStack: ctx.toasts,
  };
};
