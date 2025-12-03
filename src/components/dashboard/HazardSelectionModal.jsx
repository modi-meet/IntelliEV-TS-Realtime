import React from 'react';

const HazardSelectionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const hazards = [
    { id: 'potholes', label: 'Potholes & uneven roads' },
    { id: 'pedestrians', label: 'Pedestrians jaywalking' },
    { id: 'speedbreakers', label: 'Speed breakers without markings' },
    { id: 'overloaded', label: 'Overloaded trucks / buses' },
    { id: 'drains', label: 'Open drains / missing manhole covers' },
    { id: 'slippery', label: 'Slippery roads' },
    { id: 'accident', label: 'Car Accident (AI Analysis)' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-5">
            Report a Road Hazard
          </h2>
          <div className="flex flex-col gap-3">
            {hazards.map((hazard) => (
              <button
                key={hazard.id}
                onClick={() => onSelect(hazard.id)}
                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors text-center"
              >
                {hazard.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HazardSelectionModal;
