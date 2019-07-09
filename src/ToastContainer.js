// @flow

import React, { type Node } from 'react';
import { TransitionGroup } from 'react-transition-group';

import type { Placement } from './types';
import { gutter } from './ToastElement';

const placements = {
  'top-left': { top: 0, left: 0 },
  'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 0, right: 0 },
};

export type ToastContainerProps = {
  children?: Node,
  placement: Placement,
};

export const ToastContainer = ({
  placement,
  ...props
}: ToastContainerProps) => (
  <div
    css={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: gutter,
      position: 'fixed',
      ...placements[placement],
    }}
    {...props}
  />
);
