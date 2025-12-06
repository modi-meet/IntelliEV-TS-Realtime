import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: string;
}

const SOSModal = ({ isOpen, onClose, onConfirm, type = 'Manual' }: SOSModalProps) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(15);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      onConfirm();
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onConfirm]);

  if (!isOpen) return null;

  const percentage = (timeLeft / 15) * 100;
  const strokeDasharray = `${percentage}, 100`;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 border-2 border-red-500">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">EMERGENCY SOS</h2>
          <p className="text-gray-600 mb-4 text-sm">Sending alert in...</p>
          
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-red-500 transition-all duration-1000 ease-linear"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
              />
            </svg>
            <span className="absolute text-3xl font-bold text-red-600">{timeLeft}</span>
          </div>

          <p className="text-xs text-gray-500 mb-5">
            Triggered by: <span className="font-semibold">{type}</span>
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors click-animate"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors click-animate"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
