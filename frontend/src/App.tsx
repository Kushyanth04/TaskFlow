import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/board/:id" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen w-full">
          <main className="flex-1 flex flex-col w-full">
            <AppRoutes />
          </main>
          <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100 bg-white flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/kushyanth-b-498260214/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-[#0077B5] hover:bg-[#0077B5]/10 transition-smooth"
                title="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <p>Made by Kushyanth, Copyright &copy; 2026</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
