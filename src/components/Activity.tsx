import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Activity.css';

interface Activity {
  id: string;
  content: string;
  image: string;
}

const activityOptions = [
  'MORNING WORK', 'CIRCLE', 'SNACK', 'BATHROOM', 'CENTERS SG',
  'CENTERS', 'RECESS', 'GO HOME', 'NAP', 'ART', 'MUSIC', 'GYM', 'LUNCH'
];

const getImagePath = (activity: string): string => {
  const formattedActivity = activity.toLowerCase().replace(/\s+/g, '_');
  return `/assets/schedule/${formattedActivity}.png`;
};

interface SortableItemProps {
  id: string;
  content: string;
  image: string;
  isEditing: boolean;
  onRemove: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, content, image, isEditing, onRemove }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 1 : 'auto',
      opacity: isDragging ? 0.8 : 1,
    };
  
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onRemove(id);
    };
  
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className={`activity-item ${isDragging ? 'dragging' : ''}`}
      >
        <div {...attributes} {...listeners} style={{ width: '100%', height: '100%' }}>
          <img src={image} alt={content} className="activity-image" />
        </div>
        {isEditing && (
          <button onClick={handleRemove} className="remove-button">×</button>
        )}
      </div>
    );
  };

  const Schedule: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>(() => {
      const savedActivities = localStorage.getItem('activities');
      return savedActivities ? JSON.parse(savedActivities) : [
        { id: '1', content: 'MORNING WORK', image: getImagePath('MORNING WORK') },
        { id: '2', content: 'CIRCLE', image: getImagePath('CIRCLE') },
        { id: '3', content: 'RECESS', image: getImagePath('RECESS') },
      ];
    });
    const [isEditing, setIsEditing] = useState(false);
  
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  
    useEffect(() => {
      localStorage.setItem('activities', JSON.stringify(activities));
    }, [activities]);
  
    const handleRemoveActivity = (id: string) => {
      setActivities((prevActivities) => prevActivities.filter(activity => activity.id !== id));
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (active.id !== over?.id) {
        setActivities((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over?.id);
  
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };
  
    const handleAddActivity = (newActivity: string) => {
      if (newActivity) {
        setActivities((prevActivities) => [...prevActivities, { 
          id: Date.now().toString(), 
          content: newActivity, 
          image: getImagePath(newActivity)
        }]);
      }
    };
  
    return (
      <div className="schedule">
        <div className="schedule-header">
          <img src="/assets/schedule/our_day.png" alt="Our Day" className="our-day-image" />
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`edit-button ${isEditing ? 'editing' : ''}`} 
            aria-label="Edit schedule"
          >
            {isEditing ? '✓' : '✎'}
          </button>
        </div>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={activities.map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="activity-list">
              {activities.map((activity) => (
                <SortableItem
                  key={activity.id}
                  id={activity.id}
                  content={activity.content}
                  image={activity.image}
                  isEditing={isEditing}
                  onRemove={handleRemoveActivity}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {isEditing && (
          <div className="add-activity-container">
            <select 
              onChange={(e) => handleAddActivity(e.target.value)} 
              value=""
              className="add-activity-select"
            >
              <option value="">Add new activity</option>
              {activityOptions.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };
  
  export default Schedule;