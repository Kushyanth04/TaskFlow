import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DropResult } from '@hello-pangea/dnd';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { tasksAPI, boardsAPI } from '../services/api';
import { Task } from '../types';
import { ArrowLeft, LogOut, Wifi, WifiOff } from 'lucide-react';

const BoardPage: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspace') || '';
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [boardName, setBoardName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [connected, setConnected] = useState(false);

  const { socket, onEvent } = useSocket(workspaceId);

  useEffect(() => {
    if (boardId) {
      loadBoard();
      loadTasks();
    }
  }, [boardId]);

  useEffect(() => {
    if (!socket) return;

    setConnected(socket.connected);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    const unsub1 = onEvent('taskCreated', (task: Task) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev;
        return [...prev, task];
      });
    });

    const unsub2 = onEvent('taskUpdated', (task: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });

    const unsub3 = onEvent('taskMoved', (task: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });

    const unsub4 = onEvent('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [socket, onEvent]);

  const loadBoard = async () => {
    try {
      const { data } = await boardsAPI.getById(boardId!);
      setBoardName(data.name);
    } catch (err) {
      console.error('Failed to load board:', err);
    }
  };

  const loadTasks = async () => {
    try {
      const { data } = await tasksAPI.getByBoard(boardId!);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      const newStatus = destination.droppableId;

      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t)),
      );

      try {
        await tasksAPI.move(draggableId, newStatus);
      } catch (err) {
        loadTasks();
      }
    },
    [boardId],
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsNewTask(false);
    setModalOpen(true);
  };

  const handleAddTask = (status: string) => {
    setSelectedTask(null);
    setIsNewTask(true);
    setNewTaskStatus(status);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (isNewTask) {
        await tasksAPI.create({
          ...taskData,
          status: newTaskStatus,
          boardId,
          workspaceId,
        });
      } else if (taskData._id) {
        await tasksAPI.update(taskData._id, taskData);
      }
      loadTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.delete(taskId);
      loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col w-full h-full">
      <header className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-30">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-smooth"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">{boardName || 'Board'}</h1>
                <div className="flex items-center gap-1.5">
                  {connected ? (
                    <Wifi size={10} className="text-emerald-500" />
                  ) : (
                    <WifiOff size={10} className="text-gray-400" />
                  )}
                  <span className="text-[10px] text-gray-400">
                    {connected ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-smooth"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <KanbanBoard
          tasks={tasks}
          onDragEnd={handleDragEnd}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      </main>

      <TaskModal
        task={selectedTask}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        isNew={isNewTask}
        boardId={boardId}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default BoardPage;
