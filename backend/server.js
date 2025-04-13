require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// In-memory storage for development
const inMemoryStorage = {
  events: [],
  goals: [],
  nextEventId: 1,
  nextGoalId: 1
};

// Mock routes for development
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock API routes
// Events
app.get('/api/events', (req, res) => {
  res.json(inMemoryStorage.events);
});

app.post('/api/events', (req, res) => {
  const newEvent = {
    _id: inMemoryStorage.nextEventId++,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  inMemoryStorage.events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const eventIndex = inMemoryStorage.events.findIndex(event => event._id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  const updatedEvent = {
    ...inMemoryStorage.events[eventIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  inMemoryStorage.events[eventIndex] = updatedEvent;
  res.json(updatedEvent);
});

app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const eventIndex = inMemoryStorage.events.findIndex(event => event._id === id);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  inMemoryStorage.events.splice(eventIndex, 1);
  res.status(204).send();
});

// Goals
app.get('/api/goals', (req, res) => {
  res.json(inMemoryStorage.goals);
});

app.post('/api/goals', (req, res) => {
  const newGoal = {
    _id: inMemoryStorage.nextGoalId++,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  inMemoryStorage.goals.push(newGoal);
  res.status(201).json(newGoal);
});

app.put('/api/goals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const goalIndex = inMemoryStorage.goals.findIndex(goal => goal._id === id);
  
  if (goalIndex === -1) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  
  const updatedGoal = {
    ...inMemoryStorage.goals[goalIndex],
    ...req.body,
    updatedAt: new Date()
  };
  
  inMemoryStorage.goals[goalIndex] = updatedGoal;
  res.json(updatedGoal);
});

app.delete('/api/goals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const goalIndex = inMemoryStorage.goals.findIndex(goal => goal._id === id);
  
  if (goalIndex === -1) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  
  inMemoryStorage.goals.splice(goalIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using in-memory storage for development');
}); 