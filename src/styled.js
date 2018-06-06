// @flow

import React, { Children, Component } from 'react';
import styled, { keyframes } from 'react-emotion';
import { Transition, TransitionGroup } from 'react-transition-group';

import { CheckIcon, FlameIcon, InfoIcon, CloseIcon } from './icons';

const borderRadius = 4;
const gutter = 8;
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
  minHeight: 40,
  padding: `${gutter}px ${gutter * 1.5}px`,
});

// NOTE: invoke animation when NOT `autoDismiss` with opacity of 0 to avoid a
// paint bug in FireFox.
// https://bugzilla.mozilla.org/show_bug.cgi?id=625289
const Countdown = styled.div(({ autoDismissTimeout, opacity }) => ({
  animation: `${shrink} ${autoDismissTimeout}ms linear`,
  backgroundColor: 'rgba(0,0,0,0.1)',
  bottom: 0,
  height: 0,
  left: 0,
  opacity,
  position: 'absolute',
  width: '100%',
}));
const Icon = ({ appearance, autoDismiss, autoDismissTimeout }) => {
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
      />
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
const ToastElement = styled.div(
  ({ appearance, transitionDuration, transitionState }) => ({
    backgroundColor: appearances[appearance].bg,
    borderRadius,
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
    color: appearances[appearance].text,
    display: 'flex',
    marginBottom: gutter,
    transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1)`,
    width: toastWidth,
    ...toastStates[transitionState],
  })
);

// ==============================
// DefaultToast
// ==============================

const DefaultToast = ({
  appearance,
  autoDismiss,
  autoDismissTimeout,
  children,
  onDismiss,
  transitionDuration,
  transitionState,
}) => (
  <ToastElement
    appearance={appearance}
    transitionState={transitionState}
    transitionDuration={transitionDuration}
  >
    <Icon
      appearance={appearance}
      autoDismiss={autoDismiss}
      autoDismissTimeout={autoDismissTimeout}
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

// ==============================
// Container
// ==============================

const ToastContainer = ({ children }: *) => (
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
export type ToastProps = {
  appearance: Appearance,
  autoDismiss: boolean | number,
  autoDismissTimeout: number, // inherited from ToastProvider
  children: Node,
  onDismiss: Event => *,
  transitionDuration: number, // inherited from ToastProvider
};
type State = {
  autoDismissTimeout: number,
};

const defaultAutoDismissTimeout = 5000;

export class ToastController extends Component<ToastProps, State> {
  timeout: number;
  state = { autoDismissTimeout: this.props.autoDismissTimeout };
  static defaultProps = {
    autoDismiss: false,
  };
  static getDerivedStateFromProps({
    autoDismiss,
    autoDismissTimeout,
  }: ToastProps) {
    if (!autoDismiss) return null;

    const timeout =
      typeof autoDismiss === 'number' ? autoDismiss : autoDismissTimeout;

    return { autoDismissTimeout: timeout };
  }
  componentDidMount() {
    const { autoDismiss, onDismiss } = this.props;
    const { autoDismissTimeout } = this.state;

    if (autoDismiss) {
      this.timeout = setTimeout(onDismiss, autoDismissTimeout);
    }
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  render() {
    const { Toast, ...props } = this.props;
    const { autoDismissTimeout } = this.state;
    const time = props.transitionDuration;

    return (
      <Transition appear mountOnEnter unmountOnExit timeout={time} {...props}>
        {transitionState => (
          <Toast
            autoDismissTimeout={autoDismissTimeout}
            transitionState={transitionState}
            {...props}
          />
        )}
      </Transition>
    );
  }
}

export const defaultComponents = {
  ToastContainer,
  Toast: DefaultToast,
};
