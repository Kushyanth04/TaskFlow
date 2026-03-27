import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workspacesAPI, boardsAPI } from '../services/api';
import { Plus, LayoutDashboard, LogOut, ChevronRight, Layers, Users } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  members?: string[];
}

interface Board {
  _id: string;
  name: string;
  workspaceId: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) loadBoards(selectedWorkspace.id);
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const { data } = await workspacesAPI.getAll();
      setWorkspaces(data);
      if (data.length > 0) setSelectedWorkspace(data[0]);
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBoards = async (workspaceId: string) => {
    try {
      const { data } = await boardsAPI.getByWorkspace(workspaceId);
      setBoards(data);
    } catch (err) {
      console.error('Failed to load boards:', err);
    }
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    try {
      const { data } = await workspacesAPI.create(newName);
      setWorkspaces([...workspaces, data]);
      setSelectedWorkspace(data);
      setNewName('');
      setShowNewWorkspace(false);
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  const createBoard = async () => {
    if (!newName.trim() || !selectedWorkspace) return;
    try {
      const { data } = await boardsAPI.create(newName, selectedWorkspace.id);
      setBoards([...boards, data]);
      setNewName('');
      setShowNewBoard(false);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-smooth"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Workspaces */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={16} className="text-primary-500" />
                  Workspaces
                </h2>
                <button
                  onClick={() => { setShowNewWorkspace(true); setShowNewBoard(false); setNewName(''); }}
                  className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-smooth"
                >
                  <Plus size={16} />
                </button>
              </div>

              {showNewWorkspace && (
                <div className="mb-3 animate-scaleIn">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createWorkspace()}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="Workspace name..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={createWorkspace} className="flex-1 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-smooth">Create</button>
                    <button onClick={() => setShowNewWorkspace(false)} className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-smooth">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => setSelectedWorkspace(ws)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-smooth flex items-center justify-between group ${
                      selectedWorkspace?.id === ws.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{ws.name}</span>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-smooth ${selectedWorkspace?.id === ws.id ? 'opacity-100' : ''}`} />
                  </button>
                ))}
                {workspaces.length === 0 && !loading && (
                  <p className="text-sm text-gray-400 text-center py-4">No workspaces yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Main - Boards */}
          <div className="lg:col-span-3">
            {selectedWorkspace ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedWorkspace.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {boards.length} board{boards.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => { setShowNewBoard(true); setShowNewWorkspace(false); setNewName(''); }}
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-smooth flex items-center gap-2 shadow-lg shadow-primary-200/50"
                  >
                    <Plus size={16} />
                    New Board
                  </button>
                </div>

                {showNewBoard && (
                  <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-soft p-5 animate-scaleIn">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && createBoard()}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                      placeholder="Board name..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button onClick={createBoard} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-smooth">Create Board</button>
                      <button onClick={() => setShowNewBoard(false)} className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-smooth">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {boards.map((board, i) => (
                    <button
                      key={board._id}
                      onClick={() => navigate(`/board/${board._id}?workspace=${selectedWorkspace.id}`)}
                      className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-left hover:shadow-md hover:border-primary-200 transition-smooth group animate-fadeIn"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-smooth">
                          <Layers size={20} />
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-400 transition-smooth mt-1" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mt-4">{board.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {board.workspaceId === selectedWorkspace.id ? 'Active board' : ''}
                      </p>
                    </button>
                  ))}
                </div>

                {boards.length === 0 && !showNewBoard && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LayoutDashboard size={28} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">No boards yet</h3>
                    <p className="text-sm text-gray-500">Create your first board to start managing tasks</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Welcome to TaskFlow</h3>
                <p className="text-sm text-gray-500">Create a workspace to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
