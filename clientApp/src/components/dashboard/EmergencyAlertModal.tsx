import React, { useState } from 'react';
import { Button } from "../../components/ui/button";

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({ isOpen, onClose }) => {
  const [alertData, setAlertData] = useState({ type: '', location: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlertData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Alert logged:', alertData);
    onClose();
  };

  if (!isOpen) return null;

  console.log('Modal is open'); // Add this line to check if the modal is being rendered

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-red-600 p-6 rounded-lg text-white w-1/2">
        <h2 className="text-2xl mb-4">Emergency Alert</h2>
        <p className="mb-4">The alert will be logged. Please enter additional information:</p>
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={alertData.type}
          onChange={handleChange}
          className="w-full p-2 mb-4"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={alertData.location}
          onChange={handleChange}
          className="w-full p-2 mb-4"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={alertData.description}
          onChange={handleChange}
          className="w-full p-2 mb-4"
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit}>Log Alert</Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertModal;