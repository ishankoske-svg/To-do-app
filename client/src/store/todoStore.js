// d:\projects\personal-projects\to-do-list\client\src\store\todoStore.js
import { create } from 'zustand';
import * as todosApi from '../api/todos.api';

export const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  loadTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todosApi.fetchTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  addTodo: async (data) => {
    try {
      const newTodo = await todosApi.createTodo(data);
      set((state) => ({ todos: [newTodo, ...state.todos] }));
    } catch (error) {
      console.error(error);
    }
  },

  removeTodo: async (id) => {
    try {
      await todosApi.deleteTodo(id);
      set((state) => ({ todos: state.todos.filter(t => t.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },

  toggleTodo: async (id) => {
    try {
      const updatedTodo = await todosApi.toggleComplete(id);
      set((state) => ({
        todos: state.todos.map(t => (t.id === id ? updatedTodo : t))
      }));
    } catch (error) {
      console.error(error);
    }
  }
}));
