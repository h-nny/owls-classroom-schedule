import React, { useState } from 'react';
import './EditModal.css';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'number' ? parseInt(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Weekly Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="letter">Letter:</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="letter"
                name="letter"
                value={formData.letter}
                onChange={handleChange}
                maxLength={1}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="number">Number:</label>
            <div className="input-wrapper">
              <input
                type="number"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                min={1}
                max={20}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="color">Color:</label>
            <div className="input-wrapper">
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              >
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Purple">Purple</option>
                <option value="Orange">Orange</option>
                <option value="Pink">Pink</option>
                <option value="Brown">Brown</option>
                <option value="Gray">Gray</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="shape">Shape:</label>
            <div className="input-wrapper">
              <select
                id="shape"
                name="shape"
                value={formData.shape}
                onChange={handleChange}
              >
                <option value="Circle">Circle</option>
                <option value="Square">Square</option>
                <option value="Triangle">Triangle</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Oval">Oval</option>
                <option value="Star">Star</option>
                <option value="Heart">Heart</option>
                <option value="Diamond">Diamond</option>
                <option value="Hexagon">Hexagon</option>
                <option value="Pentagon">Pentagon</option>
                <option value="Octagon">Octagon</option>
                <option value="Rhombus">Rhombus</option>
                <option value="Trapezoid">Trapezoid</option>
              </select>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="save-button">Save</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;