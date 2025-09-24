import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Task, Label, User } from '@/types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateTaskStatus: (taskId: string, status: 'selesai' | 'tunda') => void;
  deleteTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTheme: () => void;
  getTodayStats: () => { done: number; pending: number };
  getNearestTasks: (limit?: number) => Task[];
  completeOnboarding: () => void;
  getTasksForDate: (date: Date) => Task[];
  shouldShowCalendarTask: (task: Task) => boolean;
}

type AppAction =
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: 'selesai' | 'tunda' } }
  | { type: 'DELETE_TASK'; payload: { taskId: string } }
  | { type: 'ADD_TASK'; payload: { task: Task } }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_STATE'; payload: { state: Partial<AppState> } }
  | { type: 'ADD_LABEL'; payload: { label: Label } }
  | { type: 'UPDATE_LABEL'; payload: { labelId: string; updates: Partial<Label> } }
  | { type: 'DELETE_LABEL'; payload: { labelId: string } }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'UPDATE_USER'; payload: { updates: Partial<User> } };

const STORAGE_KEY = 'tasklistplus_app_state';

// Default seed data
const defaultState: AppState = {
  user: {
    id: 'u_demo',
    nama: 'Cevin',
    email: 'cevin@example.com',
    phone: '+62 812-0000-0000',
    status_akun: 'free',
    foto_url: null,
    theme: 'light',
    notif_prefs: { push: true, whatsapp: false, email: true },
    reminder_default_minutes: 15,
    onboarding_completed: false,
  },
  labels: [
    { id: 'l1', nama: 'Personal' },
    { id: 'l2', nama: 'Pekerjaan' },
    { id: 'l3', nama: 'Tagihan' },
  ],
  tasks: [
    {
      id: 't1',
      nama: 'Bayar tagihan internet',
      catatan: 'Cek promo sebelum bayar',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      pengulangan: { tipe: 'bulanan' },
      prioritas: 'Tinggi',
      label_ids: ['l3'],
      status: 'tunda',
      created_at: new Date().toISOString(),
    },
    {
      id: 't2',
      nama: 'Standup meeting',
      catatan: 'Update progress sprint',
      deadline: new Date().toISOString().split('T')[0] + 'T09:30:00.000Z',
      pengulangan: { tipe: 'harian', hari_dipilih: ['senin', 'selasa', 'rabu', 'kamis', 'jumat'] },
      prioritas: 'Sedang',
      label_ids: ['l2'],
      status: 'tunda',
      created_at: new Date().toISOString(),
    },
    {
      id: 't3',
      nama: 'Perpanjang SIM',
      catatan: 'Bawa KTP & SIM lama',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      pengulangan: { tipe: 'tahunan' },
      prioritas: 'Tinggi',
      label_ids: ['l1'],
      status: 'tunda',
      created_at: new Date().toISOString(),
    },
  ],
};

// Load state from localStorage or return default
const loadStoredState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load stored state:', error);
  }
  return defaultState;
};

// Save state to localStorage
const saveStateToStorage = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state:', error);
  }
};

// Initial state with localStorage persistence
const initialState: AppState = loadStoredState();

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.taskId),
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload.task],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        user: {
          ...state.user,
          theme: state.user.theme === 'light' ? 'dark' : 'light',
        },
      };
    case 'SET_STATE':
      return { ...state, ...action.payload.state };
    case 'ADD_LABEL':
      return {
        ...state,
        labels: [...state.labels, action.payload.label],
      };
    case 'UPDATE_LABEL':
      return {
        ...state,
        labels: state.labels.map(label =>
          label.id === action.payload.labelId
            ? { ...label, ...action.payload.updates }
            : label
        ),
      };
    case 'DELETE_LABEL':
      return {
        ...state,
        labels: state.labels.filter(label => label.id !== action.payload.labelId),
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        user: { ...state.user, onboarding_completed: true }
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload.updates }
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(state.user.theme);
  }, [state.user.theme]);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const updateTaskStatus = (taskId: string, status: 'selesai' | 'tunda') => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId } });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    const task: Task = {
      ...taskData,
      id: `t_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: { task } });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayTasks = state.tasks.filter(
      task => new Date(task.deadline).toDateString() === today
    );
    return {
      done: todayTasks.filter(task => task.status === 'selesai').length,
      pending: todayTasks.filter(task => task.status === 'tunda').length,
    };
  };

  const getNearestTasks = (limit = 5) => {
    return [...state.tasks]
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, limit);
  };

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.tasks.filter(task => {
      const taskDate = new Date(task.deadline).toISOString().split('T')[0];
      
      // Handle different repetition types
      switch (task.pengulangan.tipe) {
        case 'tidak_ada':
          return taskDate === dateStr;
        
        case 'pilih_tanggal':
          return taskDate === dateStr || 
            (task.pengulangan.custom_dates?.includes(dateStr));
        
        case 'harian':
          if (!task.pengulangan.hari_dipilih) return false;
          const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
          const dayName = dayNames[date.getDay()];
          return task.pengulangan.hari_dipilih.includes(dayName);
        
        case 'mingguan':
          const taskDay = new Date(task.deadline).getDay();
          const currentDay = date.getDay();
          return taskDay === currentDay;
        
        case 'bulanan':
          const taskDayOfMonth = new Date(task.deadline).getDate();
          const currentDayOfMonth = date.getDate();
          return taskDayOfMonth === currentDayOfMonth;
        
        case 'tahunan':
          const taskMonth = new Date(task.deadline).getMonth();
          const taskDayOfYear = new Date(task.deadline).getDate();
          return date.getMonth() === taskMonth && date.getDate() === taskDayOfYear;
        
        default:
          return taskDate === dateStr;
      }
    });
  };

  const shouldShowCalendarTask = (task: Task) => {
    // Only show certain repetition types in calendar
    return ['tidak_ada', 'bulanan', 'tahunan', 'pilih_tanggal'].includes(task.pengulangan.tipe) &&
      task.status !== 'selesai';
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        updateTaskStatus,
        deleteTask,
        addTask,
        updateTask,
        toggleTheme,
        getTodayStats,
        getNearestTasks,
        completeOnboarding,
        getTasksForDate,
        shouldShowCalendarTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}