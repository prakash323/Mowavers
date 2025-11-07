import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-brand-dark-accent rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-brand-text-light dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">&times;</button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
