import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../redux/eventsSlice';
import EventModal from './EventModal';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const dispatch = useDispatch();
  const events = useSelector(state => state.events);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // Later we will fetch from backend, for now use dummy
    const dummyEvents = [
      {
        _id: '1',
        title: 'All-Team Kickoff',
        start: new Date(2025, 3, 14, 9, 0),
        end: new Date(2025, 3, 14, 10, 0),
        category: 'work',
      },
    ];
    dispatch(setEvents(dummyEvents));
  }, [dispatch]);

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="calendar-container">
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 600 }}
      />

      {modalOpen && (
        <EventModal
          closeModal={() => setModalOpen(false)}
          eventData={selectedEvent}
          slotData={selectedSlot}
        />
      )}
    </div>
  );
};

export default MyCalendar;
