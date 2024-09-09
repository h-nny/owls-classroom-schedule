import React, { useState } from 'react';

interface GridProps {
  weeklyData: {
    letter: string;
    number: number;
    color: string;
    shape: string;
  };
}

const Grid: React.FC<GridProps> = ({ weeklyData }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setExpandedItem(item);
  };

  const handleBackClick = () => {
    setExpandedItem(null);
  };

  const renderGridItem = (item: string, content: string | number) => {
    if (expandedItem === item) {
      return (
        <div className="expanded-item">
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
          <img src={`/images/${item.toLowerCase()}.png`} alt={`${item} of the week`} />
        </div>
      );
    }
    return (
      <div className="grid-item" onClick={() => handleItemClick(item)}>
        <h3>{item} of the Week</h3>
        <p>{content}</p>
      </div>
    );
  };

  return (
    <div className="grid">
      {renderGridItem('Letter', weeklyData.letter)}
      {renderGridItem('Number', weeklyData.number)}
      {renderGridItem('Color', weeklyData.color)}
      {renderGridItem('Shape', weeklyData.shape)}
    </div>
  );
};

export default Grid;