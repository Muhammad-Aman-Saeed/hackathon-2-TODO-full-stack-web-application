'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, MoreVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
}

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-soft border ${
        task.completed 
          ? 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10' 
          : 'border-slate-200 dark:border-slate-700'
      } p-5 transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-1 flex-shrink-0 rounded-full ${
            task.completed 
              ? 'text-green-500 hover:text-green-600' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          } transition-colors`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5" fill="currentColor" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${
            task.completed 
              ? 'text-slate-500 dark:text-slate-400 line-through' 
              : 'text-slate-800 dark:text-slate-200'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`mt-1 text-sm truncate ${
              task.completed 
                ? 'text-slate-400 dark:text-slate-500' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {task.description}
            </p>
          )}
          
          {task.dueDate && (
            <div className="mt-2 flex items-center text-xs">
              <span className={`px-2 py-1 rounded-full ${
                new Date(task.dueDate) < new Date() && !task.completed
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex-shrink-0 ml-2">
            <button
              className="p-1 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) {
                  onDelete(task.id);
                } else if (onEdit) {
                  onEdit(task);
                }
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};