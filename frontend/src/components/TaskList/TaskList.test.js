import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import configureStore from 'redux-mock-store';
import TaskList from './TaskList';

// Mock the react-beautiful-dnd DragDropContext
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({ innerRef: jest.fn(), placeholder: null, droppableProps: {} }),
  Draggable: ({ children }) => children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }, { isDragging: false }),
}));

const mockStore = configureStore([]);

describe('TaskList Component', () => {
  let store;

  const mockGoals = [
    {
      id: '1',
      name: 'Goal 1',
      color: '#ff0000',
      tasks: [
        { id: '1', name: 'Task 1' },
        { id: '2', name: 'Task 2' },
      ],
    },
    {
      id: '2',
      name: 'Goal 2',
      color: '#00ff00',
      tasks: [],
    },
  ];

  beforeEach(() => {
    store = mockStore({
      tasks: {
        goals: mockGoals,
        selectedGoalId: null,
      },
    });
  });

  it('renders all goals', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('Goal 2')).toBeInTheDocument();
  });

  it('renders tasks for goals with tasks', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows empty state for goals without tasks', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    expect(screen.getByText('No tasks in this goal')).toBeInTheDocument();
  });

  it('dispatches setSelectedGoal when clicking a goal', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    fireEvent.click(screen.getByText('Goal 1'));

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'tasks/setSelectedGoal',
      payload: '1',
    });
  });

  it('dispatches deleteTask when clicking delete button', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    // Find and click the delete button for Task 1
    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[0]);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'tasks/deleteTask',
      payload: '1',
    });
  });

  it('applies selected class to selected goal', () => {
    store = mockStore({
      tasks: {
        goals: mockGoals,
        selectedGoalId: '1',
      },
    });

    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );

    const goalElement = screen.getByText('Goal 1').closest('.goal-item');
    expect(goalElement).toHaveClass('selected');
  });
}); 