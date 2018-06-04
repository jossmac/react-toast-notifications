// @flow

import React, { Component, type ComponentType, type Node } from 'react';

import { Toast, ToastContainer } from './styled';
import { generateUEID } from './utils';
import type {
  AddFn,
  RemoveFn,
  Callback,
  ToastsType,
  Options,
  Id,
} from './types';

const { Consumer, Provider } = React.createContext();
const NOOP = () => {};

// Provider
// ==============================

type Props = { children: Node, cache?: Cache };
type State = { toasts: ToastsType };
type Context = { add: AddFn, remove: RemoveFn };

export class ToastProvider extends Component<Props, State> {
  state = { toasts: [] };

  add = (content: Node, options?: Options = {}, cb: Callback = NOOP) => {
    console.log('add', content, options);
    const id = generateUEID();
    const callback = () => cb({ event, id });

    this.setState(state => {
      const toasts = state.toasts.slice(0);
      const toast = Object.assign({}, { content, id }, options);

      toasts.push(toast);

      return { toasts };
    }, callback);
  };
  remove = (id: Id, cb: Callback = NOOP) => {
    const callback = () => cb({ event, id });

    this.setState(state => {
      const toasts = state.toasts.filter(t => t.id !== id);
      return { toasts };
    }, callback);
  };

  render() {
    const { toasts } = this.state;
    const { add, remove } = this;

    return (
      <Provider value={{ add, remove }}>
        {this.props.children}

        <ToastContainer>
          {toasts.map(({ content, id, ...rest }) => (
            <Toast key={id} onDismiss={() => this.remove(id)} {...rest}>
              {content}
            </Toast>
          ))}
        </ToastContainer>
      </Provider>
    );
  }
}

export const ToastConsumer = ({ children }: Context => Node) => (
  <Consumer>{context => children(context)}</Consumer>
);

export const withToastManager = (Comp: ComponentType<*>) => (props: *) => (
  <ToastConsumer>
    {context => <Comp toastManager={context} {...props} />}
  </ToastConsumer>
);
