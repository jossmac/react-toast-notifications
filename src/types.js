// @flow

export type Id = string;
export type Options = {
  appearance?: 'error' | 'info' | 'success',
  autoDismiss?: boolean,
};
type CallbackArgs = { event?: Event, id: Id };
export type Callback = CallbackArgs => void;

export type AddFn = (content: Node, options?: Options) => Callback;
export type RemoveFn = (id: Id) => Callback;

export type ToastType = Options & { content: Node, id: Id };
export type ToastsType = Array<ToastType>;
