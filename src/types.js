// @flow

export type Id = string;
export type Options = {
  appearance?: 'error' | 'info' | 'success',
  autoDismiss?: boolean,
};
export type Callback = Id => void;

export type AddFn = (content: Node, options?: Options) => Callback;
export type RemoveFn = (id: Id) => Callback;

export type HoverFn = () => void;

export type Placement =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right';

export type ToastType = Options & { content: Node, id: Id };
export type ToastsType = Array<ToastType>;
