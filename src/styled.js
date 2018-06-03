// @flow

import React, { Children, Component } from 'react';
import styled, { keyframes } from 'react-emotion';
import { Transition, TransitionGroup } from 'react-transition-group';

import { CheckIcon, FlameIcon, InfoIcon, CloseIcon } from './icons';

const borderRadius = 4;
const gutter = 8;
const autoDismissDuration = 5000;
const toastWidth = 360;
const shrink = keyframes`from { height: 100%; } to { height: 0% }`;

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

const appearances = {
  success: {
    icon: CheckIcon,
    text: 'rgb(31, 116, 38)',
    fg: 'rgb(52, 194, 64)',
    bg: 'rgb(194, 237, 198)',
  },
  error: {
    icon: FlameIcon,
    text: 'rgb(128, 40, 40)',
    fg: 'rgb(214, 66, 66)',
    bg: 'rgb(243, 198, 198)',
  },
  info: {
    icon: InfoIcon,
    text: 'rgb(108,121,143)',
    fg: 'rgb(81, 157, 255)',
    bg: 'white',
  },
};

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
  minHeight: 60,
  padding: `${gutter}px ${gutter * 1.5}px`,
});
const Countdown = styled.div({
  animation: `${shrink} ${autoDismissDuration}ms linear`,
  backgroundColor: 'rgba(0,0,0,0.1)',
  bottom: 0,
  height: 0,
  left: 0,
  position: 'absolute',
  width: '100%',
});
const Icon = ({ appearance, autoDismiss }) => {
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
      {autoDismiss ? <Countdown /> : null}
      <Glyph css={{ position: 'relative', zIndex: 1 }} />
    </div>
  );
};
const toastStates = {
  entering: { transform: 'translate3d(110%,0,0)' },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: 'translate3d(110%,0,0)' },
  exited: { transform: 'translate3d(110%,0,0)' },
};
const transitionDurationMs = 220;
const transitionDuration = `${transitionDurationMs}ms`;
const ToastElement = styled.div(({ appearance, transitionState }) => ({
  backgroundColor: appearances[appearance].bg,
  borderRadius,
  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
  color: appearances[appearance].text,
  display: 'flex',
  marginBottom: gutter,
  transition: `transform ${transitionDuration} cubic-bezier(0.2, 0, 0, 1)`,
  transform: 'translate3d(110%,0,0)',
  width: toastWidth,
  ...toastStates[transitionState],
}));

export const ToastContainer = ({ children }: *) => (
  <div
    css={{
      boxSizing: 'border-box',
      maxHeight: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: gutter,
      pointerEvents: Children.count(children) ? 'auto' : 'none',
      position: 'fixed',
      right: 0,
      top: 0,
      width: toastWidth + gutter * 2,
    }}
  >
    <TransitionGroup component={null}>{children}</TransitionGroup>
  </div>
);

type Appearance = $Keys<typeof appearances>;
type Props = {
  appearance: Appearance,
  autoDismiss: boolean,
  children: Node,
  onDismiss: Event => *,
};

export class Toast extends Component<Props> {
  timeout: number;
  static defaultProps = {
    autoDismiss: false,
  };
  componentDidMount() {
    const { autoDismiss, onDismiss } = this.props;
    if (autoDismiss) {
      this.timeout = setTimeout(onDismiss, autoDismissDuration);
    }
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  render() {
    const {
      appearance,
      autoDismiss,
      children,
      onDismiss,
      ...props
    } = this.props;

    return (
      <Transition
        appear
        mountOnEnter
        unmountOnExit
        timeout={transitionDurationMs}
        {...props}
      >
        {state => (
          <ToastElement appearance={appearance} transitionState={state}>
            <Icon appearance={appearance} autoDismiss={autoDismiss} />
            <Content>{children}</Content>
            {onDismiss ? (
              <Button onClick={onDismiss} role="button">
                <CloseIcon />
                <A11yText>Close</A11yText>
              </Button>
            ) : null}
          </ToastElement>
        )}
      </Transition>
    );
  }
}
