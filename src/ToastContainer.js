// @flow
/** @jsx jsx */

import { jsx } from '@emotion/core';
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
  hasToasts: boolean,
  placement: Placement,
};

export const ToastContainer = ({
  hasToasts,
  placement,
  ...props
}: ToastContainerProps) => (
  <div
    className="react-toast-notifications__container"
    css={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      padding: gutter,
      pointerEvents: hasToasts ? null : 'none',
      position: 'fixed',
      zIndex: 1000,
      ...placements[placement],
    }}
    {...props}
  />
);
