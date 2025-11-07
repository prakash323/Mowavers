
import React from 'react';

// This component is now deprecated in favor of the more comprehensive SymptomTimeline.
// It is kept to prevent breaking imports but should be removed in a future refactor.

const HistoryView: React.FC<{patientId: string}> = ({ patientId }) => {
  return (
    <div className="bg-brand-dark-accent p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white">Historical Data</h3>
      <p className="text-gray-400">
        This view has been upgraded. Please see the 'Symptom Timeline' for a complete patient history.
      </p>
    </div>
  );
};

export default HistoryView;
