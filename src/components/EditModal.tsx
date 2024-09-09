import React, { useState } from 'react';

interface EditModalProps {
  initialData: {
    letter: string;
    number: number;
    color: string;
    shape: string;
  };
  onSave: (newData: { letter: string; number: number; color: string; shape: string }) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'number' ? parseInt(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Letter:
          <input type="text" name="letter" value={formData.letter} onChange={handleChange} />
        </label>
        <label>
          Number:
          <input type="number" name="number" value={formData.number} onChange={handleChange} />
        </label>
        <label>
          Color:
          <input type="text" name="color" value={formData.color} onChange={handleChange} />
        </label>
        <label>
          Shape:
          <input type="text" name="shape" value={formData.shape} onChange={handleChange} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default EditModal;