import React, { useState, useEffect } from 'react';
import './App.css';
import Grid from './components/Grid';
import Schedule from './components/Activity';
import EditModal from './components/EditModal';

interface WeeklyData {
  letter: string;
  number: number;
  colors: string[];  // Changed from color: string
  shape: string;
}

function App() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData>(() => {
    const savedData = localStorage.getItem('weeklyData');
    const parsedData = savedData ? JSON.parse(savedData) : null;
    return {
      letter: parsedData?.letter || 'A',
      number: parsedData?.number || 1,
      colors: Array.isArray(parsedData?.colors) ? parsedData.colors : ['Red'],
      shape: parsedData?.shape || 'Circle',
    };
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
  }, [weeklyData]);

  const handleEdit = (newData: WeeklyData) => {
    setWeeklyData(newData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Owl's Classroom Schedule</h1>
        <button 
          className="update-layout-button" 
          onClick={() => setIsEditModalOpen(true)}
          aria-label="Edit layout"
        >
          ✎
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