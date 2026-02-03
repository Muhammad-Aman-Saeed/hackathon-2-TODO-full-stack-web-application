'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Task, TasksState } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { Modal } from '@/components/Modal';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/Sidebar';
import { Plus, Filter, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [tasksState, setTasksState] = useState<TasksState>({
    tasks: [],
    filteredTasks: [],
    activeFilter: 'all',
    isLoading: true,
    error: null,
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on system preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTasks = async () => {
        try {
          setTasksState(prev => ({ ...prev, isLoading: true }));
          const tasks = await apiClient.getTasks();
          setTasksState({
            tasks,
            filteredTasks: tasks,
            activeFilter: 'all',
            isLoading: false,
            error: null,
          });
        } catch (error) {
          setTasksState(prev => ({
            ...prev,
            isLoading: false,
            error: (error as Error).message || 'Failed to fetch tasks',
          }));
        }
      };

      fetchTasks();
    }
  }, [isAuthenticated]);

  // Apply filter when tasks or filter changes
  useEffect(() => {
    let filtered = [...tasksState.tasks];
    
    if (tasksState.activeFilter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (tasksState.activeFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    setTasksState(prev => ({
      ...prev,
      filteredTasks: filtered,
    }));
  }, [tasksState.tasks, tasksState.activeFilter]);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await apiClient.updateTask(editingTask.id, taskData);
        setTasksState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t),
        }));
      } else {
        // Create new task
        const newTask = await apiClient.createTask(taskData);
        setTasksState(prev => ({
          ...prev,
          tasks: [newTask, ...prev.tasks],
        }));
      }
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTask = await apiClient.toggleComplete(id, completed);
      setTasksState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiClient.deleteTask(id);
        setTasksState(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleFilterChange = (filter: 'all' | 'pending' | 'completed') => {
    setTasksState(prev => ({ ...prev, activeFilter: filter }));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign-in handled by a wrapper component in a real app
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Task Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-soft border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Tasks</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {tasksState.tasks.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-soft border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {tasksState.tasks.filter(t => !t.completed).length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-soft border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Completed</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {tasksState.tasks.filter(t => t.completed).length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary-500 to-indigo-500 rounded-2xl p-5 shadow-lg">
            <h3 className="text-white/90 text-sm font-medium">Productivity</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {tasksState.tasks.length > 0 
                ? Math.round((tasksState.tasks.filter(t => t.completed).length / tasksState.tasks.length) * 100) + '%' 
                : '0%'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex space-x-2">
            <Button 
              variant={tasksState.activeFilter === 'all' ? 'primary' : 'outline'} 
              onClick={() => handleFilterChange('all')}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              All
            </Button>
            <Button 
              variant={tasksState.activeFilter === 'pending' ? 'primary' : 'outline'} 
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={tasksState.activeFilter === 'completed' ? 'primary' : 'outline'} 
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </Button>
          </div>
          
          <Button 
            onClick={handleAddTask}
            className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        {tasksState.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : tasksState.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-xl">
            Error: {tasksState.error}
          </div>
        ) : tasksState.filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <div className="text-2xl">📋</div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {tasksState.activeFilter === 'all' 
                ? "You don't have any tasks yet. Get started by adding a new task!" 
                : `No ${tasksState.activeFilter} tasks. Try changing the filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {tasksState.filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          task={editingTask || undefined}
          onSave={handleSaveTask}
          onCancel={() => setShowAddTaskModal(false)}
        />
      </Modal>
    </div>
  </div>
  );
}