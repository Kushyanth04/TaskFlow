import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getSocket } from '../services/socket';

interface Notification {
  id: string;
  type: 'assignment' | 'reminder' | 'overdue';
  message: string;
  time: Date;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'welcome-1',
      type: 'assignment',
      message: 'Welcome aboard! Click here to learn how to operate TaskFlow.',
      time: new Date(),
      read: false,
    }
  ]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTaskCreated = (task: any) => {
      setNotifications(prev => [{
        id: Date.now().toString() + Math.random(),
        type: 'assignment',
        message: `A new task "${task.title}" was created.`,
        time: new Date(),
        read: false,
      }, ...prev]);
    };

    const handleTaskMoved = (task: any) => {
      setNotifications(prev => [{
        id: Date.now().toString() + Math.random(),
        type: 'reminder',
        message: `Task "${task.title}" was moved to ${task.status}.`,
        time: new Date(),
        read: false,
      }, ...prev]);
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskMoved', handleTaskMoved);

    return () => {
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskMoved', handleTaskMoved);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <CheckCircle size={14} className="text-primary-500" />;
      case 'reminder': return <Clock size={14} className="text-amber-500" />;
      case 'overdue': return <AlertTriangle size={14} className="text-red-500" />;
      default: return <Bell size={14} />;
    }
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-smooth"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-scaleIn overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-smooth flex gap-3 cursor-pointer ${
                      n.read ? 'opacity-60' : ''
                    }`}
                    onClick={() => {
                      if (n.id.startsWith('welcome')) setShowWelcomeModal(true);
                      if (!n.read) {
                        setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                      }
                    }}
                  >
                    <div className="mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.time)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowWelcomeModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scaleIn border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="text-primary-500" /> Welcome to TaskFlow! 🚀</h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>TaskFlow is your real-time project management hub. Here is how to operate your new workspace:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Create Workspaces:</strong> Start by constructing a workspace for your team.</li>
                <li><strong>Build Boards:</strong> Add Kanban boards to your workspace to organize different features.</li>
                <li><strong>Track Time:</strong> Create tasks in the <strong>To Do</strong> column. Drag them to <strong>In Progress</strong> to automatically start tracking time!</li>
                <li><strong>Pause & Resume:</strong> Click the <span className="inline-flex items-center text-amber-600 font-medium px-1">Pause</span> button on an In Progress card to take a break. We track your sessions dynamically!</li>
                <li><strong>Finish & Save:</strong> Drop it into <strong>Done</strong> or select the status from the Edit Modal to permanently save your tracking telemetry.</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="font-medium text-gray-800 text-xs mb-1">Architecture Note:</p>
                <p className="text-xs text-gray-500">
                  Data is securely stored in <strong>MongoDB</strong> (Tasks) and <strong>PostgreSQL</strong> (Users). Open registration is currently available, anyone can sign up safely when deployed.
                </p>
              </div>
            </div>
            <button onClick={() => setShowWelcomeModal(false)} className="mt-6 w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-smooth font-medium shadow-md shadow-primary-500/20">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
