// @flow

import type { Node } from 'react';

export type AppearanceTypes = 'error' | 'info' | 'success' | 'warning';
export type Id = string;
export type Callback = Id => void;
export type Options = {
  appearance: AppearanceTypes,
  autoDismiss?: boolean,
  onDismiss?: Callback,
};

export type AddFn = (content: Node, options?: Options) => Id;
export type UpdateFn = (id: Id, options: Options) => void;
export type RemoveFn = (id: Id) => void;

export type HoverFn = () => void;

export type Placement =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right';

export type ToastType = Options & { appearance: AppearanceTypes, content: Node, id: Id };
export type ToastsType = Array<ToastType>;
