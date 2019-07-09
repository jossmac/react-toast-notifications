// @flow

import React, { Children, type Element } from 'react';
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

// NOTE: children should just be `React.Node`, not sure why this is unacceptable
// to flow.
export type ToastContainerProps = { children?: Array<Element<any>>, placement: Placement };

export const ToastContainer = ({
  children,
  placement,
}: ToastContainerProps) => (
  <div
    css={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: gutter,
      pointerEvents: Children.count(children) ? 'auto' : 'none',
      position: 'fixed',
      ...placements[placement],
    }}
  >
    <TransitionGroup component={null}>{children}</TransitionGroup>
  </div>
);
