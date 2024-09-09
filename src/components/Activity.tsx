import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Activity {
  id: string;
  content: string;
}

const Schedule: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', content: 'Morning Circle' },
    { id: '2', content: 'Snack Time' },
    { id: '3', content: 'Outdoor Play' },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newActivities = Array.from(activities);
    const [reorderedItem] = newActivities.splice(result.source.index, 1);
    newActivities.splice(result.destination.index, 0, reorderedItem);

    setActivities(newActivities);
  };

  const handleAddActivity = (newActivity: string) => {
    setActivities([...activities, { id: Date.now().toString(), content: newActivity }]);
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="schedule">
      <h2>Daily Schedule</h2>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Done' : 'Edit'}
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="schedule">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {activities.map((activity, index) => (
                <Draggable key={activity.id} draggableId={activity.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {activity.content}
                      {isEditing && (
                        <button onClick={() => handleRemoveActivity(activity.id)}>Remove</button>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {isEditing && (
        <select onChange={(e) => handleAddActivity(e.target.value)}>
          <option value="">Add new activity</option>
          <option value="Art Time">Art Time</option>
          <option value="Story Time">Story Time</option>
          <option value="Music and Movement">Music and Movement</option>
        </select>
      )}
    </div>
  );
};

export default Schedule;