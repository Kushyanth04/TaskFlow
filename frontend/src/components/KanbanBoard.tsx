import React from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task } from '../types';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: string) => void;
}

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    icon: <Circle size={14} />,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    accent: 'border-t-gray-300',
    count: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: <Clock size={14} />,
    color: 'text-primary-600',
    bg: 'bg-primary-50/50',
    accent: 'border-t-primary-400',
    count: 'bg-primary-100 text-primary-600',
  },
  {
    id: 'done',
    title: 'Done',
    icon: <CheckCircle2 size={14} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/50',
    accent: 'border-t-emerald-400',
    count: 'bg-emerald-100 text-emerald-600',
  },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onDragEnd,
  onTaskClick,
  onAddTask,
}) => {
  const getColumnTasks = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border border-gray-100 ${col.bg} overflow-hidden`}
            >
              {/* Column Header */}
              <div className={`px-4 py-3 border-t-[3px] ${col.accent}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={col.color}>{col.icon}</span>
                    <h3 className="font-semibold text-sm text-gray-900">{col.title}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${col.count}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onAddTask(col.id)}
                    className="p-1 text-gray-400 hover:text-primary-600 hover:bg-white/60 rounded-lg transition-smooth"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 px-3 py-2 min-h-[200px] transition-smooth ${
                      snapshot.isDraggingOver ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    {colTasks.map((task, index) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        onClick={() => onTaskClick(task)}
                      />
                    ))}
                    {provided.placeholder}
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-sm text-gray-400">
                        <p>No tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
