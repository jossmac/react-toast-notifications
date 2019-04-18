// @flow

import React, { Children, Component, type ComponentType } from 'react';
import { Transition } from 'react-transition-group';

import type { ToastProps } from './ToastElement';

type Props = ToastProps & { Toast: ComponentType<ToastProps> };
type State = { autoDismissTimeout: number };

const defaultAutoDismissTimeout = 5000;

export class ToastController extends Component<Props, State> {
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
    this.startTimer();
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  startTimer() {
    const { autoDismiss, onDismiss } = this.props;
    const { autoDismissTimeout } = this.state;

    if (autoDismiss) {
      this.timeout = setTimeout(onDismiss, autoDismissTimeout);
    }
  }
  clearTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  onMouseEnter() {
    this.clearTimer();
  }
  onMouseLeave() {
    this.startTimer();
  }
  render() {
    const { Toast, ...props } = this.props;
    const { autoDismissTimeout } = this.state;
    const time = props.transitionDuration;

    return (
      <Transition appear mountOnEnter unmountOnExit timeout={time} {...props}>
        {transitionState => (
          <Toast
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            autoDismissTimeout={autoDismissTimeout}
            transitionState={transitionState}
            {...props}
          />
        )}
      </Transition>
    );
  }
}
