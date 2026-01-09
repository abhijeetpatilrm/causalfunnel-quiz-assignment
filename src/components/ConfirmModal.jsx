/**
 * Modal dialog for confirming quiz submission
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onConfirm - Called when user confirms action
 * @param {Function} props.onCancel - Called when user cancels or closes modal
 * @param {string} props.title - Modal title
 * @param {string} props.message - Message to display
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 */
function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-title"
          className="text-xl font-semibold text-gray-900 mb-3"
        >
          {title}
        </h2>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            type="button"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
            type="button"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
