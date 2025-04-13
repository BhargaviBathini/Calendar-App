import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Calendar from './components/Calendar/Calendar';
import TaskList from './components/TaskList/TaskList';
import GoalForm from './components/GoalForm/GoalForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-section">
            <h2>Goals & Tasks</h2>
            <GoalForm />
          </div>
          <div className="sidebar-section">
            <TaskList />
          </div>
        </div>
        <div className="calendar-container">
          <Calendar />
        </div>
      </div>
    </Provider>
  );
}

export default App;
