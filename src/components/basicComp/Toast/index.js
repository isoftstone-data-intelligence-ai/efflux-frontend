import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import styles from './index.module.scss';
import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = ToastPrimitive.Viewport;

let toastCount = 0;
const TOAST_LIMIT = 3;
const VIEWPORT_PADDING = 25;

class Toast extends React.Component {
  static show(options) {
    const { message, type = 'info', duration = 3000 } = options;
    
    // Create container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    // Create a new div for this toast
    const toastDiv = document.createElement('div');
    container.appendChild(toastDiv);

    // Render toast
    const root = createRoot(toastDiv);
    root.render(
      <ToastProvider>
        <Toast
          message={message}
          type={type}
          onClose={() => {
            root.unmount();
            container.removeChild(toastDiv);
            if (container.childNodes.length === 0) {
              document.body.removeChild(container);
            }
          }}
          duration={duration}
        />
        <ToastViewport className={styles.viewport} />
      </ToastProvider>
    );
  }

  getIcon() {
    const { type } = this.props;
    const iconProps = { size: 20 };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'error':
        return <XCircle {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  }

  render() {
    const { message, type = 'info', duration, onClose } = this.props;

    return (
      <ToastPrimitive.Root
        className={clsx(styles.toastRoot, styles[type])}
        duration={duration}
        onOpenChange={(open) => {
          if (!open) onClose?.();
        }}
      >
        <div className={styles.iconContainer}>
          {this.getIcon()}
        </div>
        <ToastPrimitive.Description className={styles.description}>
          {message}
        </ToastPrimitive.Description>
        <ToastPrimitive.Close className={styles.closeButton}>
          <span className={styles.closeIcon}>&times;</span>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
}

export const toast = {
  info(message, duration) {
    Toast.show({ message, type: 'info', duration });
  },
  success(message, duration) {
    Toast.show({ message, type: 'success', duration });
  },
  warning(message, duration) {
    Toast.show({ message, type: 'warning', duration });
  },
  error(message, duration) {
    Toast.show({ message, type: 'error', duration });
  }
};

export default Toast;
