import React from 'react';
import Modal from './Modal';

interface SymptomCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SymptomCheckerModal: React.FC<SymptomCheckerModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Symptom Checker">
      <div className="text-gray-300">
        <p>This is a placeholder for the Symptom Checker feature.</p>
        <p className="mt-2">Future versions will integrate with the Gemini API to provide guidance (not medical advice) based on user-reported symptoms.</p>
      </div>
    </Modal>
  );
};

export default SymptomCheckerModal;
