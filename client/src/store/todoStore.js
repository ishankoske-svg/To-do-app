// d:\projects\personal-projects\to-do-list\client\src\store\todoStore.js
import { create } from 'zustand';
import * as todosApi from '../api/todos.api';
import * as tagsApi from '../api/tags.api';

export const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  // ─── Filters ──────────────────────────────────────────────────────
  // null means "not active" for that filter
  filters: {
    completed: null,
    priority: null,
    tag: null,
    search: '',
    sortBy: 'createdAt',
    order: 'desc'
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  },

  resetFilters: () => {
    set({ filters: { completed: null, priority: null, tag: null, search: '', sortBy: 'createdAt', order: 'desc' } });
  },

  loadTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await todosApi.fetchTodos(get().filters);
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

  // Returns the deleted todo so the UI can cache it for undo
  removeTodo: async (id) => {
    const todoToDelete = get().todos.find(t => t.id === id);
    try {
      await todosApi.deleteTodo(id);
      set((state) => ({ todos: state.todos.filter(t => t.id !== id) }));
      return todoToDelete; // Return the cached copy for undo
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Undo a delete by re-creating the todo via the API
  undoDelete: async (cachedTodo) => {
    if (!cachedTodo) return;
    try {
      const restored = await todosApi.createTodo({
        title: cachedTodo.title,
        description: cachedTodo.description || undefined,
        priority: cachedTodo.priority,
        dueDate: cachedTodo.dueDate || undefined,
      });
      set((state) => ({ todos: [restored, ...state.todos] }));
    } catch (error) {
      console.error('Undo failed:', error);
    }
  },

  toggleTodo: async (id) => {
    try {
      const result = await todosApi.toggleComplete(id);
      // Backend now returns { completed: Todo, next: Todo | null }
      const completedTodo = result.completed || result; // Fallback in case old response shape is cached
      const nextTodo = result.next;

      set((state) => {
        let newTodos = state.todos.map(t => (t.id === id ? { ...t, ...completedTodo } : t));
        if (nextTodo) {
          // Add the newly created recurring task to the top
          newTodos = [nextTodo, ...newTodos];
        }
        return { todos: newTodos };
      });
    } catch (error) {
      console.error(error);
    }
  },

  reorderTodos: async (orderedIds) => {
    // Optimistic UI update
    const currentTodos = [...get().todos];
    const newTodos = [...currentTodos].sort((a, b) => {
      return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    });
    
    set({ todos: newTodos });
    
    try {
      await todosApi.reorderTodosApi(orderedIds);
    } catch (error) {
      console.error(error);
      set({ todos: currentTodos }); // Revert on error
    }
  },

  // Subtasks
  addSubtask: async (todoId, data) => {
    try {
      const newSubtask = await todosApi.addSubtask(todoId, data);
      set((state) => ({
        todos: state.todos.map(t => 
          t.id === todoId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t
        )
      }));
    } catch (error) {
      console.error(error);
    }
  },

  toggleSubtask: async (todoId, subId) => {
    try {
      const updatedSubtask = await todosApi.toggleSubtask(todoId, subId);
      set((state) => ({
        todos: state.todos.map(t => 
          t.id === todoId ? {
            ...t,
            subtasks: t.subtasks.map(s => s.id === subId ? updatedSubtask : s)
          } : t
        )
      }));
    } catch (error) {
      console.error(error);
    }
  },

  deleteSubtask: async (todoId, subId) => {
    try {
      await todosApi.deleteSubtask(todoId, subId);
      set((state) => ({
        todos: state.todos.map(t => 
          t.id === todoId ? {
            ...t,
            subtasks: t.subtasks.filter(s => s.id !== subId)
          } : t
        )
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // Tags
  tags: [],
  loadTags: async () => {
    try {
      const tags = await tagsApi.fetchTags();
      set({ tags });
    } catch (error) {
      console.error(error);
    }
  },

  addTag: async (data) => {
    try {
      const newTag = await tagsApi.createTag(data);
      set((state) => ({ tags: [...state.tags, newTag] }));
    } catch (error) {
      console.error(error);
    }
  },

  removeTag: async (id) => {
    try {
      await tagsApi.deleteTag(id);
      set((state) => ({ tags: state.tags.filter(t => t.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },

  // ─── Socket / Real-time ──────────────────────────────────────────
  initSocket: () => {
    import('../api/socket').then(({ default: socket }) => {
      const token = localStorage.getItem('token');
      if (!token) return;

      socket.auth = { token };
      socket.connect();

      socket.on('todo:created', (todo) => {
        set(state => {
          if (state.todos.find(t => t.id === todo.id)) return state;
          return { todos: [todo, ...state.todos] };
        });
      });

      socket.on('todo:updated', (todo) => {
        set(state => ({
          todos: state.todos.map(t => t.id === todo.id ? { ...t, ...todo } : t)
        }));
      });

      socket.on('todo:deleted', (data) => {
        set(state => ({
          todos: state.todos.filter(t => t.id !== data.id)
        }));
      });
    });
  }
}));

// ✅ DONE
