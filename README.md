# React Toast Notifications

A toast notification system for react.

https://jossmac.github.io/react-toast-notifications

```jsx
import { ToastProvider, withToastUtils } from 'react-toast-notifications';

class FormComponent extends React.Component {
  onSubmit = () => {
    const { toast } = this.props;

    if (validation.error) {
      toast.addToast(`Something went wrong: "${validation.error.message}"`, {
        appearance: 'error',
      });
    } else if (validation.success) {
      toast.addToast('Saved Successfully', { appearance: 'success' });
    }
  };
  render() {
    return <form onSubmit={this.onSubmit}>...</form>;
  }
}

const FormWithToasts = withToastUtils(FormComponent);

const App = () => (
  <ToastProvider>
    <FormWithToasts />
  </ToastProvider>
);
```
