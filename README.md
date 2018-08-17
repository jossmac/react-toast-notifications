<img align="right" src="https://user-images.githubusercontent.com/2730833/41197727-5e0b4d2e-6cab-11e8-9d0d-873d1f8ebced.png" alt="react-toast-notifications" />

# React Toast Notifications

A configurable, composable, toast notification system for react.

https://jossmac.github.io/react-toast-notifications

### Install

```bash
yarn add react-toast-notifications
```

### Use

Wrap your app in the `ToastProvider`, which provides context for the `Toast` descendants.

```jsx
import { ToastConsumer, ToastProvider, withToastManager } from 'react-toast-notifications';
import validate from 'some-validation-lib';

class FormComponent extends React.Component {
  onSubmit = (value) => {
    const { toastManager } = this.props;
    const { error, success } = validate(value);

    if (error) {
      toastManager.add(`Something went wrong: "${error.message}"`, {
        appearance: 'error',
      });
    } else if (success) {
      toastManager.add('Saved Successfully', { appearance: 'success' });
    }
  };
  render() {
    return <form onSubmit={this.onSubmit}>...</form>;
  }
}

// wrap your component to pass in the `toastManager` prop
const FormWithToasts = withToastManager(FormComponent);

const App = () => (
  <ToastProvider>
    <FormWithToasts />

    {/* or if render props are more your speed */}
    <ToastConsumer>{({ addToast }) => (
      <button onClick={(e) => addToast(`Notified by ${e.target}`)}>
        Toasty
      </button>
    )}</ToastConsumer>
  </ToastProvider>
);
```

## ToastProvider Props

For brevity:
- `PlacementType` is equal to `'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right'`.
- `TransitionState` is equal to `'entering' | 'entered' | 'exiting' | 'exited'`.

| Property        | Description                      |
| --------------- | -------------------------------- |
| autoDismissTimeout `number` | Default `5000`. The time until a toast will be dismissed automatically, in milliseconds. |
| children `Node` | Required. Your app content. |
| components `{ ToastContainer, Toast }` | Replace the underlying components. |
| placement `PlacementType` | Default `top-right`. Where, in relation to the viewport, to place the toasts. |
| transitionDuration `number` | Default `220`. The duration of the CSS transition on the `Toast` component. |

## Toast Props

| Property | Description |
|--------- | ----------- |
| children  | Required. The content of the toast notification. |
| autoDismiss `boolean` | Whether or not to dismiss the toast automatically after a timeout. |
| autoDismissTimeout `number` | Inherited from `ToastProvider`. |
| onDismiss: `Event => any` | Passed in dynamically. |
| placement `PlacementType` | Inherited from `ToastProvider`. |
| transitionDuration `number` | Inherited from `ToastProvider`. |
| transitionState: `TransitionState` | Passed in dynamically. |

## Add & Remove

The `add` and `remove` methods on `ToastManager` have three arguments.

1. The first is the content of the toast, which can be any renderable `Node`.
1. The second is the `Options` object, which can take any shape you like. When departing from the default shape, you must provide an alternative, compliant `Toast` component.
1. The third is a callback, which is passed the added or removed toast `ID`.

## Replaceable Components

To bring each toast notification inline with your app, you can provide alternative components to the `ToastProvider`:

```jsx
import { ToastProvider } from 'react-toast-notifications';

const MyCustomToast = ({ appearance, children }) => (
  <div style={{ background: appearance === 'error' ? 'red' : 'green'}}>
    {children}
  </div>
);

const App = () => (
  <ToastProvider components={{ Toast: MyCustomToast }}>
    ...
  </ToastProvider>
);
```

## Alternatives

This library may not meet your needs. Here are some alternative I came across whilst searching for this solution:

- https://github.com/fkhadra/react-toastify
- https://github.com/tomchentw/react-toastr
- https://github.com/jesusoterogomez/react-notify-toast
