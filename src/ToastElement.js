// @flow

import React, { Children, Component } from 'react';
import styled, { keyframes } from 'react-emotion';

import { CheckIcon, FlameIcon, InfoIcon, CloseIcon, AlertIcon } from './icons';
import * as colors from './colors';
import type { HoverFn, Placement } from './types';

// common
export const borderRadius = 4;
export const gutter = 8;
export const toastWidth = 360;
export const shrink = keyframes`from { height: 100%; } to { height: 0% }`;

// a11y helper
const A11yText = ({ tag: Tag, ...props }) => (
  <Tag
    css={{
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
    {...props}
  />
);
A11yText.defaultProps = {
  tag: 'span',
};

// default appearances

const appearances = {
  success: {
    icon: CheckIcon,
    text: colors.G500,
    fg: colors.G300,
    bg: colors.G50,
  },
  error: {
    icon: FlameIcon,
    text: colors.R500,
    fg: colors.R300,
    bg: colors.R50,
  },
  warning: {
    icon: AlertIcon,
    text: colors.Y500,
    fg: colors.Y300,
    bg: colors.Y50,
  },
  info: {
    icon: InfoIcon,
    text: colors.N400,
    fg: colors.B200,
    bg: 'white',
  },
};
export type AppearanceTypes = $Keys<typeof appearances>;

const Button = styled.div({
  cursor: 'pointer',
  flexShrink: 0,
  opacity: 0.5,
  padding: `${gutter}px ${gutter * 1.5}px`,
  transition: 'opacity 150ms',

  ':hover': { opacity: 1 },
});

const Content = styled.div({
  flexGrow: 1,
  fontSize: 14,
  lineHeight: 1.4,
  minHeight: 40,
  padding: `${gutter}px ${gutter * 1.5}px`,
});

// NOTE: invoke animation when NOT `autoDismiss` with opacity of 0 to avoid a
// paint bug in FireFox.
// https://bugzilla.mozilla.org/show_bug.cgi?id=625289
const Countdown = styled.div(({ autoDismissTimeout, opacity, isRunning }) => ({
  animation: `${shrink} ${autoDismissTimeout}ms linear`,
  animationPlayState: isRunning ? 'running' : 'paused',
  backgroundColor: 'rgba(0,0,0,0.1)',
  bottom: 0,
  height: 0,
  left: 0,
  opacity,
  position: 'absolute',
  width: '100%',
}));
const Icon = ({ appearance, autoDismiss, autoDismissTimeout, isRunning }) => {
  const meta = appearances[appearance];
  const Glyph = meta.icon;

  return (
    <div
      css={{
        backgroundColor: meta.fg,
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        color: meta.bg,
        flexShrink: 0,
        paddingBottom: gutter,
        paddingTop: gutter,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        width: 30,
      }}
    >
      <Countdown
        opacity={autoDismiss ? 1 : 0}
        autoDismissTimeout={autoDismissTimeout}
        isRunning={isRunning}
      />
      <Glyph css={{ position: 'relative', zIndex: 1 }} />
    </div>
  );
};
function getTranslate(placement) {
  const pos = placement.split('-');
  const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1];
  const translateMap = {
    right: 'translate3d(120%, 0, 0)',
    left: 'translate3d(-120%, 0, 0)',
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
  };

  return translateMap[relevantPlacement];
}
export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';
const toastStates = (placement: Placement) => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: getTranslate(placement) },
  exited: { transform: getTranslate(placement) },
});
const ToastElement = styled.div(
  ({ appearance, placement, transitionDuration, transitionState }) => {
    return {
      backgroundColor: appearances[appearance].bg,
      borderRadius,
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
      color: appearances[appearance].text,
      display: 'flex',
      marginBottom: gutter,
      transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1)`,
      width: toastWidth,
      ...toastStates(placement)[transitionState],
    };
  }
);

// ==============================
// DefaultToast
// ==============================

export type ToastProps = {
  appearance: AppearanceTypes,
  autoDismiss: boolean | number,
  autoDismissTimeout: number, // inherited from ToastProvider
  children: Node,
  onDismiss: Event => *,
  onMouseEnter: HoverFn,
  onMouseLeave: HoverFn,
  pauseOnHover: boolean,
  placement: Placement,
  transitionDuration: number, // inherited from ToastProvider
  transitionState: TransitionState, // inherited from ToastProvider
};

export const DefaultToast = ({
  appearance,
  autoDismiss,
  autoDismissTimeout,
  children,
  isRunning,
  onDismiss,
  pauseOnHover,
  placement,
  transitionDuration,
  transitionState,
  onMouseEnter,
  onMouseLeave,
}: ToastProps) => (
  <ToastElement
    appearance={appearance}
    placement={placement}
    transitionState={transitionState}
    transitionDuration={transitionDuration}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Icon
      appearance={appearance}
      autoDismiss={autoDismiss}
      autoDismissTimeout={autoDismissTimeout}
      isRunning={isRunning}
    />
    <Content>{children}</Content>
    {onDismiss ? (
      <Button onClick={onDismiss} role="button">
        <CloseIcon />
        <A11yText>Close</A11yText>
      </Button>
    ) : null}
  </ToastElement>
);
