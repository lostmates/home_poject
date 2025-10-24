import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Подтверждение", 
  message = "Вы уверены, что хотите выполнить это действие?",
  confirmText = "Да",
  cancelText = "Отмена",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmButtonClass: 'confirm-button danger',
          iconColor: '#e74c3c'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmButtonClass: 'confirm-button warning',
          iconColor: '#f39c12'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmButtonClass: 'confirm-button info',
          iconColor: '#3498db'
        };
      default:
        return {
          icon: '❓',
          confirmButtonClass: 'confirm-button default',
          iconColor: '#6c757d'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <div className="confirmation-modal-icon" style={{ color: typeStyles.iconColor }}>
            {typeStyles.icon}
          </div>
          <h3 className="confirmation-modal-title">{title}</h3>
          <button 
            type="button" 
            className="confirmation-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="confirmation-modal-content">
          <p className="confirmation-modal-message">{message}</p>
        </div>
        
        <div className="confirmation-modal-actions">
          <button 
            type="button" 
            className="confirmation-modal-button cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`confirmation-modal-button ${typeStyles.confirmButtonClass}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
