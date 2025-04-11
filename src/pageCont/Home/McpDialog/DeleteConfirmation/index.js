import React, { useRef } from "react";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styles from './index.module.scss';

const DeleteConfirmation = ({
  open,
  onOpenChange,
  onConfirm,
  title = 'Confirm Delete',
  description = 'This action will permanently delete this item. Do you want to continue?',
  cancelText = 'Cancel',
  confirmText = 'Delete'
}) => {
  return (
     <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <div className={styles.container}>
          <AlertDialog.Overlay className="delete-confirmation-overlay" />
          <AlertDialog.Content className="delete-confirmation-content">
            <AlertDialog.Title className="delete-confirmation-title">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="delete-confirmation-description">
              {description}
            </AlertDialog.Description>
            <div className="delete-confirmation-buttons">
              <AlertDialog.Cancel asChild>
                <button className="delete-confirmation-button cancel">
                  {cancelText}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  className="delete-confirmation-button confirm"
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>

  );
}

export default DeleteConfirmation