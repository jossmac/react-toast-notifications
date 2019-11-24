// @flow

import React, { Children, Component, type ComponentType } from 'react';
import { Transition } from 'react-transition-group';

import { NOOP } from './utils';
import type { ToastProps } from './ToastElement';

type Props = ToastProps & { component: ComponentType<ToastProps> };
type State = { isRunning: boolean };

const defaultAutoDismissTimeout = 5000;

const TimerType = {
  clear: NOOP,
  pause: NOOP,
  resume: NOOP,
};

function Timer(callback: () => void, delay: number) {
  let timerId: TimeoutID;
  let start = delay;
  let remaining = delay;

  this.clear = function() {
    clearTimeout(timerId);
  };

  this.pause = function() {
    clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  this.resume = function() {
    start = Date.now();
    clearTimeout(timerId);
    timerId = setTimeout(callback, remaining);
  };

  this.resume();
}

export class ToastController extends Component<Props, State> {
  timeout: typeof TimerType;
  state = {
    isRunning: Boolean(this.props.autoDismiss),
  };
  static defaultProps = {
    autoDismiss: false,
  };

  componentDidMount() {
    this.startTimer();
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.autoDismiss !== this.props.autoDismiss) {
      const startOrClear = this.props.autoDismiss
        ? this.startTimer
        : this.clearTimer;

      startOrClear();
    }
  }
  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer = () => {
    const { autoDismiss, autoDismissTimeout, onDismiss } = this.props;

    if (!autoDismiss) return;

    this.setState({ isRunning: true });
    this.timeout = new Timer(onDismiss, autoDismissTimeout);
  };
  clearTimer = () => {
    if (this.timeout) this.timeout.clear();
  };

  onMouseEnter = () => {
    this.setState({ isRunning: false }, () => {
      if (this.timeout) this.timeout.pause();
    });
  };
  onMouseLeave = () => {
    this.setState({ isRunning: true }, () => {
      if (this.timeout) this.timeout.resume();
    });
  };

  render() {
    const { autoDismiss, autoDismissTimeout, component: Toast, ...props } = this.props;
    const { isRunning } = this.state;

    // NOTE: conditions here so methods can be clean
    const handleMouseEnter = autoDismiss ? this.onMouseEnter : NOOP;
    const handleMouseLeave = autoDismiss ? this.onMouseLeave : NOOP;

    return (
      <Toast
        autoDismiss={autoDismiss}
        autoDismissTimeout={autoDismissTimeout}
        isRunning={isRunning}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }
}
