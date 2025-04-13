import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import './EventModal.css';

const REMINDER_OPTIONS = [
  { value: 0, label: 'At time of event' },
  { value: 5, label: '5 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' },
];

const RECURRENCE_FREQUENCIES = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const EventModal = ({ isOpen, onClose, onSave, onDelete, selectedEvent, selectedSlot, droppedTask, categories }) => {
  const goals = useSelector((state) => state.tasks.goals);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        goalId: selectedEvent.goalId || '',
        start: new Date(selectedEvent.start),
        end: new Date(selectedEvent.end),
      });
    } else if (selectedSlot) {
      setFormData({
        title: '',
        description: '',
        goalId: '',
        start: new Date(selectedSlot.start),
        end: new Date(selectedSlot.end),
      });
    } else if (droppedTask) {
      setFormData({
        title: droppedTask.title || '',
        description: droppedTask.description || '',
        goalId: droppedTask.goalId || '',
        start: new Date(selectedSlot?.start || new Date()),
        end: new Date(selectedSlot?.end || new Date()),
      });
    }
  }, [selectedEvent, selectedSlot, droppedTask]);

  const formatDateForInput = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      setFormData({
        ...formData,
        [name]: new Date(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      try {
        await onDelete(selectedEvent._id);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{selectedEvent ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Event title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="goalId">Goal</label>
            <select
              id="goalId"
              name="goalId"
              value={formData.goalId}
              onChange={handleChange}
            >
              <option value="">Select a goal</option>
              {goals.map((goal) => (
                <option key={goal._id} value={goal._id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="start">Start Time</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formatDateForInput(formData.start)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end">End Time</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formatDateForInput(formData.end)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              {selectedEvent ? 'Update' : 'Create'}
            </button>
            {selectedEvent && (
              <button type="button" className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 