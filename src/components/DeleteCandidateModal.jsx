import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const DeleteCandidateModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirm Delete"
      style={{
        content: {
          maxWidth: '400px',
          margin: 'auto',
          padding: '2rem',
          borderRadius: '10px',
          height: 'fit-content',
        }
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p className="text-gray-700 mb-6">Are you sure you want to delete this candidate?</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-4 rounded"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteCandidateModal;
