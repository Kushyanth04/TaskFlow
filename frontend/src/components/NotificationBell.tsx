import React, { useState } from 'react';
import { Bell, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'assignment' | 'reminder' | 'overdue';
  message: string;
  time: Date;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      message: 'You were assigned to "Design System Audit"',
      time: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'reminder',
      message: '"API Integration" is due in 24 hours',
      time: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      type: 'overdue',
      message: '"Database Migration" is overdue',
      time: new Date(Date.now() - 7200000),
      read: true,
    },
  ]);

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
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-smooth flex gap-3 ${
                      n.read ? 'opacity-60' : ''
                    }`}
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
    </div>
  );
};

export default NotificationBell;
