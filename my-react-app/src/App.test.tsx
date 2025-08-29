import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./App.css', () => ({}));
// Простой mock для localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  test('добавление новой задачи при вводе текста и нажатии клавиши Enter', () => {
    render(<App />);

    const inputElement = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(inputElement, { target: { value: 'Test task' } });
    expect(inputElement).toHaveValue('Test task');

    fireEvent.keyPress(inputElement, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  test('задачи загружаются из localStorage ', () => {
    const savedTasks = [
      { id: 1, text: 'Saved task', completed: false },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedTasks));

    render(<App />);

    expect(screen.getByText('Saved task')).toBeInTheDocument();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('todo-tasks');
  });
});