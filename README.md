# React Toast Notifications

A toast notification system for react.

https://jossmac.github.io/react-toast-notifications

```jsx
import { ToastProvider, withToastUtils } from 'react-toast-notifications';

const SomeComponent = ({ toast }) => (
  <button onClick={toast.addToast('Toast content goes here...')}>
    Add Toast
  </button>
);
const EnhancedComponent = withToastUtils(SomeComponent);

const App = () => (
  <ToastProvider>
    <EnhancedComponent />
  </ToastProvider>
);
```
