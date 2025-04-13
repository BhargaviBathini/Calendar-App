import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent } from '../redux/eventsSlice';

const categories = ['exercise', 'eating', 'work', 'relax', 'family', 'social'];

const EventModal = ({ closeModal, eventData, slotData }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title);
      setCategory(eventData.category);
      setDate(new Date(eventData.start).toISOString().substr(0, 10));
      setStartTime(new Date(eventData.start).toTimeString().substr(0, 5));
      setEndTime(new Date(eventData.end).toTimeString().substr(0, 5));
    } else if (slotData) {
      const start = new Date(slotData.start);
      const end = new Date(slotData.end);
      setDate(start.toISOString().substr(0, 10));
      setStartTime(start.toTimeString().substr(0, 5));
      setEndTime(end.toTimeString().substr(0, 5));
    }
  }, [eventData, slotData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    const newEvent = {
      _id: eventData?._id || Date.now().toString(),
      title,
      category,
      start,
      end,
    };

    if (eventData) {
      dispatch(updateEvent(newEvent));
    } else {
      dispatch(addEvent(newEvent));
    }

    closeModal();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Event Modal"
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: '400px',
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px',
        },
      }}
    >
      <h2>{eventData ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Start Time</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />

        <label>End Time</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

        <div style={{ marginTop: '15px' }}>
          <button type="submit">{eventData ? 'Update' : 'Create'}</button>
          <button type="button" onClick={closeModal} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
