import React, { useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import Schedule from './components/Activity';
import EditModal from './components/EditModal';

interface WeeklyData {
  letter: string;
  number: number;
  color: string;
  shape: string;
}

function App() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({
    letter: 'A',
    number: 1,
    color: 'Red',
    shape: 'Circle',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (newData: WeeklyData) => {
    setWeeklyData(newData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>
          Edit
        </button>
      </header>
      <div className="App-content">
        <div className="grid-container">
          <Grid weeklyData={weeklyData} />
        </div>
        <div className="schedule-container">
          <Schedule />
        </div>
      </div>
      {isEditModalOpen && (
        <EditModal
          initialData={weeklyData}
          onSave={handleEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;