import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Flag, GripVertical, Clock, Pause, Play } from 'lucide-react';
import { tasksAPI } from '../services/api';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  low: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Low' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium' },
  high: { color: 'text-red-500', bg: 'bg-red-50', label: 'High' },
  urgent: { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Urgent' },
};

const formatTime = (seconds: number) => {
  if (!seconds) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleTogglePause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tasksAPI.togglePause(task._id);
    } catch (error) {
      console.error('Failed to toggle pause', error);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={onClick}
          className={`bg-white rounded-xl border p-4 mb-3 cursor-pointer group transition-smooth ${
            snapshot.isDragging
              ? 'shadow-xl border-primary-300 rotate-2 scale-105'
              : 'border-gray-100 hover:border-primary-200 hover:shadow-md shadow-soft'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-gray-900 leading-snug flex-1">{task.title}</h4>
            <div
              {...provided.dragHandleProps}
              className="p-0.5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-smooth"
            >
              <GripVertical size={14} />
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
              <Flag size={10} />
              {priority.label}
            </span>

            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
              }`}>
                <Calendar size={10} />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}

            {task.assigneeName && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                <User size={10} />
                {task.assigneeName}
              </span>
            )}

            {task.status === 'in-progress' && (
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  task.isPaused ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  <Clock size={10} />
                  {task.isPaused ? 'Paused' : 'Tracking Time'}
                </span>
                <button
                  onClick={handleTogglePause}
                  className={`p-1 rounded hover:bg-gray-100 transition-smooth ${
                    task.isPaused ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                  title={task.isPaused ? "Resume" : "Pause"}
                >
                  {task.isPaused ? <Play size={12} /> : <Pause size={12} />}
                </button>
              </div>
            )}

            {task.status === 'done' && task.timeTakenSeconds !== undefined && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Clock size={10} />
                {formatTime(task.timeTakenSeconds)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
