# React Toast Notifications

A toast notification system for react.

https://jossmac.github.io/react-toast-notifications

```jsx
import { ToastProvider, withToastManager } from 'react-toast-notifications';

class FormComponent extends React.Component {
  onSubmit = () => {
    const { toastManager } = this.props;

    if (validation.error) {
      toastManager.add(`Something went wrong: "${validation.error.message}"`, {
        appearance: 'error',
      });
    } else if (validation.success) {
      toastManager.add('Saved Successfully', { appearance: 'success' });
    }
  };
  render() {
    return <form onSubmit={this.onSubmit}>...</form>;
  }
}

const FormWithToasts = withToastManager(FormComponent);

const App = () => (
  <ToastProvider>
    <FormWithToasts />
  </ToastProvider>
);
```
