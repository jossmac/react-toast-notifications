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
import { ToastProvider, useToasts } from 'react-toast-notifications'

const FormWithToasts = () => {
  const { addToast } = useToasts()

  const onSubmit = async value => {
    const { error } = await dataPersistenceLayer(value)

    if (error) {
      addToast(error.message, { appearance: 'error' })
    } else {
      addToast('Saved Successfully', { appearance: 'success' })
    }
  }

  return <form onSubmit={onSubmit}>...</form>
}

const App = () => (
  <ToastProvider>
    <FormWithToasts />
  </ToastProvider>
)
```

## ToastProvider Props

For brevity:

- `PlacementType` is equal to `'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right'`.
- `TransitionState` is equal to `'entering' | 'entered' | 'exiting' | 'exited'`.

| Property                               | Description                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------- |
| autoDismissTimeout `number`            | Default `5000`. The time until a toast will be dismissed automatically, in milliseconds. |
| children `Node`                        | Required. Your app content.                                                              |
| components `{ ToastContainer, Toast }` | Replace the underlying components.                                                       |
| placement `PlacementType`              | Default `top-right`. Where, in relation to the viewport, to place the toasts.            |
| transitionDuration `number`            | Default `220`. The duration of the CSS transition on the `Toast` component.              |

## Toast Props

| Property                           | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| appearance                         | Required. One of `success`, `error`, `warning`, `info`             |
| children                           | Required. The content of the toast notification.                   |
| autoDismiss `boolean`              | Default: `false`. Whether or not to dismiss the toast automatically after a timeout. Inherited from `ToastProvider` if not provided. |
| autoDismissTimeout `number`        | Inherited from `ToastProvider`.                                    |
| onDismiss: `Id => void`          | Passed in dynamically.                                             |
| placement `PlacementType`          | Inherited from `ToastProvider`.                                    |
| transitionDuration `number`        | Inherited from `ToastProvider`.                                    |
| transitionState: `TransitionState` | Passed in dynamically.                                             |

## Hook

The `useToast` hook has the following signature:

```jsx
const { addToast, removeToast, removeAllToasts, updateToast, toastStack } = useToasts();
```

The `addToast` method has three arguments:

1.  The first is the content of the toast, which can be any renderable `Node`.
1.  The second is the `Options` object, which can take any shape you like. `Options.appearance` is required when using the `DefaultToast`. When departing from the default shape, you must provide an alternative, compliant `Toast` component.
1.  The third is an optional callback, which is passed the added toast `ID`.

The `removeToast` method has two arguments:

1.  The first is the `ID` of the toast to remove.
1.  The second is an optional callback.

The `removeAllToasts` method has no arguments.

The `updateToast` method has three arguments:

1.  The first is the `ID` of the toast to update.
1.  The second is the `Options` object, which differs slightly from the add method because it accepts a `content` property.
1.  The third is an optional callback, which is passed the updated toast `ID`.

The `toastStack` is an array of objects representing the current toasts, e.g.

```jsx
[
  { content: 'Something went wrong', id: 'generated-string', appearance: 'error' },
  { content: 'Item saved', id: 'generated-string', appearance: 'success' }
]
```

## Replaceable Components

To bring each toast notification inline with your app, you can provide alternative components to the `ToastProvider`:

```jsx
import { ToastProvider } from 'react-toast-notifications';

const MyCustomToast = ({ appearance, children }) => (
  <div style={{ background: appearance === 'error' ? 'red' : 'green' }}>
    {children}
  </div>
);

const App = () => (
  <ToastProvider components={{ Toast: MyCustomToast }}>...</ToastProvider>
);
```

To customize the existing component instead of creating a new one, you may import `DefaultToast`:

```jsx
import { DefaultToast } from 'react-toast-notifications';
export const MyCustomToast = ({ children, ...props }) => (
  <DefaultToast {...props}>
    <SomethingSpecial>{children}</SomethingSpecial>
  </DefaultToast>
);
```

## Alternatives

This library may not meet your needs. Here are some alternative I came across whilst searching for this solution:

- https://github.com/fkhadra/react-toastify
- https://github.com/tomchentw/react-toastr
- https://github.com/jesusoterogomez/react-notify-toast
