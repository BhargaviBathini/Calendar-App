import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMinutes, addDays, addMonths, subMonths, subDays } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../redux/slices/eventSlice';
import EventModal from './EventModal';
import SearchBar from './SearchBar';
import AgendaView from './AgendaView';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CATEGORIES = [
  { value: 'exercise', label: 'Exercise', color: '#4CAF50' },
  { value: 'eating', label: 'Eating', color: '#FF9800' },
  { value: 'work', label: 'Work', color: '#2196F3' },
  { value: 'relax', label: 'Relax', color: '#9C27B0' },
  { value: 'family', label: 'Family', color: '#E91E63' },
  { value: 'social', label: 'Social', color: '#00BCD4' },
];

const Calendar = () => {
  const dispatch = useDispatch();
  const { events, loading, error, searchResults, searchLoading } = useSelector((state) => state.events);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [droppedTask, setDroppedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const displayedEvents = useMemo(() => {
    return searchResults.length > 0 ? searchResults : events;
  }, [events, searchResults]);

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setDroppedTask(null);
    setModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setDroppedTask(null);
    setModalOpen(true);
  }, []);

  const handleEventDrop = useCallback(
    async ({ event, start, end }) => {
      try {
        const updatedEvent = {
          ...event,
          start,
          end
        };
        
        await dispatch(updateEvent({
          id: event._id,
          eventData: updatedEvent,
        })).unwrap();
        
        dispatch(fetchEvents());
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
      }
    },
    [dispatch]
  );

  const handleEventResize = useCallback(
    async ({ event, start, end }) => {
      try {
        const updatedEvent = {
          ...event,
          start,
          end
        };
        
        await dispatch(updateEvent({
          id: event._id,
          eventData: updatedEvent,
        })).unwrap();
        
        dispatch(fetchEvents());
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
      }
    },
    [dispatch]
  );

  const handleNavigate = (action) => {
    switch (action) {
      case 'TODAY':
        setDate(new Date());
        break;
      case 'PREV':
        switch (view) {
          case 'month':
            setDate(subMonths(date, 1));
            break;
          case 'week':
            setDate(subDays(date, 7));
            break;
          case 'day':
            setDate(subDays(date, 1));
            break;
          default:
            break;
        }
        break;
      case 'NEXT':
        switch (view) {
          case 'month':
            setDate(addMonths(date, 1));
            break;
          case 'week':
            setDate(addDays(date, 7));
            break;
          case 'day':
            setDate(addDays(date, 1));
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSaveEvent = useCallback(
    async (eventData) => {
      try {
        if (selectedEvent) {
          // Update existing event
          await dispatch(updateEvent({
            id: selectedEvent._id,
            eventData: { 
              ...selectedEvent, 
              ...eventData,
              goalId: eventData.goalId || null
            },
          })).unwrap();
        } else {
          // Create new event
          await dispatch(createEvent({
            ...eventData,
            goalId: eventData.goalId || null,
            start: new Date(eventData.start),
            end: new Date(eventData.end)
          })).unwrap();
        }
        
        // Refresh events after save
        dispatch(fetchEvents());
        setModalOpen(false);
      } catch (error) {
        console.error('Error saving event:', error);
        alert('Failed to save event. Please try again.');
      }
    },
    [dispatch, selectedEvent]
  );

  const handleDeleteEvent = useCallback(
    async (eventId) => {
      try {
        // Delete the event
        await dispatch(deleteEvent(eventId)).unwrap();
        
        // Refresh events after deletion
        dispatch(fetchEvents());
        
        // Close the modal
        setModalOpen(false);
        
        // Clear the selected event
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    },
    [dispatch]
  );

  const eventStyleGetter = useCallback((event) => {
    return {
      style: {
        backgroundColor: event.color || '#1a73e8',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      },
      className: 'calendar-event'
    };
  }, []);

  if (loading || searchLoading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={() => handleNavigate('TODAY')}>Today</button>
          <button className="nav-btn" onClick={() => handleNavigate('PREV')}>Back</button>
          <span className="current-date">
            {format(date, 'MMMM yyyy')}
          </span>
          <button className="nav-btn" onClick={() => handleNavigate('NEXT')}>Next</button>
        </div>
        <div className="calendar-views">
          <button 
            className={`view-btn ${view === 'day' ? 'active' : ''}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button 
            className={`view-btn ${view === 'week' ? 'active' : ''}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${view === 'month' ? 'active' : ''}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${view === 'agenda' ? 'active' : ''}`}
            onClick={() => handleViewChange('agenda')}
          >
            Agenda
          </button>
        </div>
      </div>

      <SearchBar />

      {view === 'agenda' ? (
        <AgendaView events={displayedEvents} />
      ) : (
        <BigCalendar
          localizer={localizer}
          events={displayedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 200px)' }}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          resizable
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          popup
          views={['month', 'week', 'day']}
        />
      )}

      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          selectedEvent={selectedEvent}
          selectedSlot={selectedSlot}
          droppedTask={droppedTask}
          categories={CATEGORIES}
        />
      )}
    </div>
  );
};

export default Calendar; 