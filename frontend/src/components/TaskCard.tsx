import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Flag, GripVertical } from 'lucide-react';
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

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

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
              className="opacity-0 group-hover:opacity-100 transition-smooth p-0.5 text-gray-300 hover:text-gray-500"
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
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
