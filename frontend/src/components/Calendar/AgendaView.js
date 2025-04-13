import React from 'react';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import './AgendaView.css';

const AgendaView = ({ events }) => {
  // Sort events by start date
  const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));

  // Group events by date
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const date = format(new Date(event.start), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  const getDateHeader = (date) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) {
      return 'Today';
    } else if (isTomorrow(eventDate)) {
      return 'Tomorrow';
    } else if (isThisWeek(eventDate)) {
      return format(eventDate, 'EEEE'); // Day name
    } else if (isThisMonth(eventDate)) {
      return format(eventDate, 'EEEE, do'); // Day name, date
    } else {
      return format(eventDate, 'MMMM d, yyyy'); // Full date
    }
  };

  const getEventTime = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  if (events.length === 0) {
    return (
      <div className="agenda-empty">
        <p>No events scheduled</p>
        <p>Click on the calendar to add an event</p>
      </div>
    );
  }

  return (
    <div className="agenda-view">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date} className="agenda-day">
          <div className="agenda-date-header">
            {getDateHeader(date)}
          </div>
          <div className="agenda-events">
            {dayEvents.map((event) => (
              <div 
                key={event.id} 
                className="agenda-event"
                style={{ borderLeftColor: event.color || '#1a73e8' }}
              >
                <div className="agenda-event-time">
                  {getEventTime(event)}
                </div>
                <div className="agenda-event-content">
                  <div className="agenda-event-title">{event.title}</div>
                  {event.description && (
                    <div className="agenda-event-description">
                      {event.description}
                    </div>
                  )}
                  {event.location && (
                    <div className="agenda-event-location">
                      📍 {event.location}
                    </div>
                  )}
                </div>
                {event.goal && (
                  <div 
                    className="agenda-event-goal"
                    style={{ backgroundColor: event.goal.color }}
                  >
                    {event.goal.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgendaView; 