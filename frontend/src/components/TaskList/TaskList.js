import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setSelectedGoal, deleteTask } from '../../redux/slices/taskSlice';
import './TaskList.css';

const TaskList = () => {
  const dispatch = useDispatch();
  const { goals, selectedGoalId } = useSelector((state) => state.tasks);

  const handleGoalClick = (goalId) => {
    dispatch(setSelectedGoal(goalId));
  };

  const handleDeleteTask = (goalId, taskId) => {
    dispatch(deleteTask({ goalId, taskId }));
  };

  const onDragEnd = (result) => {
    // Handle drag end logic here if needed
    // For now, we'll just log the result
    console.log('Drag ended:', result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-list">
        <h2>Tasks</h2>
        <div className="goals-container">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`goal-item ${selectedGoalId === goal.id ? 'selected' : ''}`}
              onClick={() => handleGoalClick(goal.id)}
            >
              <div
                className="goal-header"
                style={{ backgroundColor: goal.color }}
              >
                <h3>{goal.name}</h3>
                <span className="goal-icon">▼</span>
              </div>
              <Droppable droppableId={`goal-${goal.id}`}>
                {(provided) => (
                  <div
                    className="tasks-container"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {goal.tasks && goal.tasks.length > 0 ? (
                      goal.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-item ${
                                snapshot.isDragging ? 'dragging' : ''
                              }`}
                              style={{
                                backgroundColor: goal.color,
                                ...provided.draggableProps.style,
                              }}
                            >
                              <span>{task.name}</span>
                              <div className="task-actions">
                                <button
                                  className="task-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(goal.id, task.id);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>No tasks in this goal</p>
                        <p>Drag tasks here or create new ones</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskList; 