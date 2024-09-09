import React, { useState, useRef, useEffect } from 'react';
import './Grid.css';

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
  const [letterImages, setLetterImages] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchLetterImages = async () => {
      const letter = weeklyData.letter;
      const img1 = `/assets/letters/images/${letter}/1.png`;
      const img2 = `/assets/letters/images/${letter}/2.png`;

      const results = await Promise.all([
        fetch(img1).then(res => res.ok ? img1 : null),
        fetch(img2).then(res => res.ok ? img2 : null)
      ]);

      setLetterImages(results.filter(Boolean) as string[]);
    };

    fetchLetterImages();
  }, [weeklyData.letter]);

  const handleItemClick = (item: string) => {
    setExpandedItem(item);
    if (item === 'Letter' && audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleBackClick = () => {
    setExpandedItem(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getImagePath = (item: string, content: string | number): string => {
    switch (item) {
      case 'Number':
        return `/assets/numbers/${content}.png`;
      case 'Color':
        return `/assets/colors/${content}.png`;
      case 'Shape':
        return `/assets/shapes/${content}.png`;
      default:
        return '';
    }
  };

  const renderLetterImages = (isExpanded: boolean) => (
    <div className={`letter-images ${isExpanded ? 'expanded' : ''}`}>
      {letterImages.map((img, index) => (
        <div key={index} className="image-container letter-container">
          <img src={img} alt={`Letter of the week ${index + 1}`} />
        </div>
      ))}
    </div>
  );

  const renderGridItem = (item: string, content: string | number) => {
    const imagePath = getImagePath(item, content);

    if (expandedItem === item) {
      return (
        <div className="expanded-item">
          <button className="back-button" onClick={handleBackClick}>
            ←
          </button>
          {item === 'Letter' ? renderLetterImages(true) : (
            <img src={imagePath} alt={`${item} of the week`} />
          )}
          {item === 'Letter' && (
            <audio ref={audioRef} src={`/assets/letters/music/${content}.mp3`} />
          )}
        </div>
      );
    }
    return (
      <div className="grid-item">
        <h3>{item} of the Week</h3>
        {item === 'Letter' ? (
          <div className="letter-wrapper" onClick={() => handleItemClick(item)}>
            {renderLetterImages(false)}
          </div>
        ) : (
          <div className="image-container" onClick={() => handleItemClick(item)}>
            <img src={imagePath} alt={`${item} of the week`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {renderGridItem('Letter', weeklyData.letter)}
        {renderGridItem('Number', weeklyData.number)}
        {renderGridItem('Color', weeklyData.color)}
        {renderGridItem('Shape', weeklyData.shape)}
      </div>
    </div>
  );
};

export default Grid;