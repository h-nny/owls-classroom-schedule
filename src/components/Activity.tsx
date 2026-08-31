import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
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
      opacity: isDragging ? 0.4 : 1,
    };
  
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onRemove(id);
    };
  
    return (
      <div
        ref={setNodeRef}
        id={`sortable-${id}`}
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
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeSize, setActiveSize] = useState<{ width: number; height: number } | null>(null);

    const activeActivity = activities.find((a) => a.id === activeId) || null;

    const listRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumb, setThumb] = useState({ height: 0, top: 0 });

    const syncThumb = useCallback(() => {
      const el = listRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const trackH = track.clientHeight;
      const ratio = scrollHeight > 0 ? clientHeight / scrollHeight : 1;
      const thumbH = Math.max(Math.min(ratio, 1) * trackH, 28);
      const maxScroll = scrollHeight - clientHeight;
      const maxThumbTop = trackH - thumbH;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
      setThumb({ height: thumbH, top });
    }, []);

    useLayoutEffect(() => {
      syncThumb();
    }, [activities, isEditing, syncThumb]);

    useEffect(() => {
      const el = listRef.current;
      if (!el) return;
      const ro = new ResizeObserver(syncThumb);
      ro.observe(el);
      Array.from(el.children).forEach((c) => ro.observe(c));
      window.addEventListener('resize', syncThumb);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', syncThumb);
      };
    }, [activities, syncThumb]);

    const handleThumbPointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = listRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const startY = e.clientY;
      const startScroll = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const maxThumbTop = track.clientHeight - thumb.height;
      const onMove = (ev: PointerEvent) => {
        const dy = ev.clientY - startY;
        el.scrollTop = maxThumbTop > 0 ? startScroll + (dy / maxThumbTop) * maxScroll : startScroll;
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    const handleTrackPointerDown = (e: React.PointerEvent) => {
      const el = listRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      if (e.target !== track) return;
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top - thumb.height / 2;
      const maxThumbTop = track.clientHeight - thumb.height;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const clamped = Math.max(0, Math.min(clickY, maxThumbTop));
      el.scrollTop = maxThumbTop > 0 ? (clamped / maxThumbTop) * maxScroll : 0;
    };

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
    
    const handleDragStart = (event: DragStartEvent) => {
      const id = event.active.id as string;
      setActiveId(id);
      const node = document.getElementById(`sortable-${id}`);
      if (node) {
        const rect = node.getBoundingClientRect();
        setActiveSize({ width: rect.width, height: rect.height });
      }
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setActiveSize(null);

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
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => { setActiveId(null); setActiveSize(null); }}
        >
          <SortableContext
            items={activities.map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="activity-scroll">
              <div className="activity-list" ref={listRef} onScroll={syncThumb}>
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
              <div
                className="custom-scrollbar"
                ref={trackRef}
                onPointerDown={handleTrackPointerDown}
              >
                <div
                  className="custom-scrollbar__thumb"
                  style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
                  onPointerDown={handleThumbPointerDown}
                />
              </div>
            </div>
          </SortableContext>
          {createPortal(
            <DragOverlay>
              {activeActivity ? (
                <div
                  className="activity-item activity-item--overlay"
                  style={activeSize ? { width: activeSize.width, height: activeSize.height } : undefined}
                >
                  <img
                    src={activeActivity.image}
                    alt={activeActivity.content}
                    className="activity-image"
                  />
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
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