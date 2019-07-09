// @flow

// $FlowFixMe `useContext`
import React, { Component, useContext, type ComponentType, type Node, type Ref } from 'react';
import { createPortal } from 'react-dom';

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
type Context = { add: AddFn, remove: RemoveFn };

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
    const { children, components, ...props } = this.props;
    const { Toast, ToastContainer } = this.components;
    const { toasts } = this.state;
    const { add, remove } = this;
    const portalTarget = document.body;

    return portalTarget ? (
      <Provider value={{ add, remove, toasts }}>
        {children}

        {canUseDOM ? (
          createPortal(
            <ToastContainer placement={props.placement}>
              {toasts.map(({ content, id, onDismiss, ...rest }) => (
                <ToastController
                  key={id}
                  Toast={Toast}
                  onDismiss={this.onDismiss(id, onDismiss)}
                  {...props}
                  {...rest}
                >
                  {content}
                </ToastController>
              ))}
            </ToastContainer>,
            portalTarget
          )
        ) : (
          <ToastContainer placement={props.placement} /> // keep ReactDOM.hydrate happy
        )}
      </Provider>
    ) : null;
  }
}

export const ToastConsumer = ({ children }: { children: Context => Node }) => (
  <Consumer>{context => children(context)}</Consumer>
);

// $FlowFixMe `forwardRef`
export const withToastManager = (Comp: ComponentType<*>) => React.forwardRef((props: *, ref: Ref<*>) => (
  <ToastConsumer>
    {context => <Comp toastManager={context} {...props} ref={ref} />}
  </ToastConsumer>
));

export const useToasts = () => {
  const { add, remove, toasts } = useContext(ToastContext);

  return { addToast: add, removeToast: remove, toasts };
}
