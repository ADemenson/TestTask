import React, { useState, useEffect } from 'react';
import './App.css';
import { Task, FilterType } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('todo-tasks')

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return [ ]
  });

  const [newTask, setNewTask] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Сохранение задач в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    if (newTask.trim()) {
      const newTaskItem: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const clearCompleted = (): void => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks: Task[] = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasksCount: number = tasks.filter(task => !task.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTask(e.target.value);
  };

  return (
    <div className="app">
      <h1>todos</h1>

      {/* Поле для ввода новой задачи */}
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="task-input"
        />
      </div>

      {/* Списки задач */}
      <div className="tasks-container">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item">
            <input
              type="radio"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="task-radio"
              id={task.id}
            />
            <label
              className={task.completed ? 'task-text completed' : 'task-text'}
              htmlFor={task.id}>
              {task.text}
            </label>
          </div>
        ))}
      </div>

      {/* Статистика и фильтры */}
      <div className="footer">
        <div className="tasks-left">
          {activeTasksCount} {activeTasksCount === 1 ? 'item left' : 'items left'}
        </div>

        <div className="filters">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <button
          onClick={clearCompleted}
          className="clear-btn"
          disabled={!tasks.some(task => task.completed)}
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}

export default App;