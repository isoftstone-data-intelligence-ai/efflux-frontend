import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './index.css';

interface DeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

const DeleteConfirmation = ({
  open,
  onOpenChange,
  onConfirm,
  title = 'Confirm Delete',
  description = 'This action will permanently delete this item. Do you want to continue?',
  cancelText = 'Cancel',
  confirmText = 'Delete'
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
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
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default DeleteConfirmation