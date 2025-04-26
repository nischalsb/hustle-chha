// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { TaskProvider } from './contexts/TaskContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import { MoodEnergyProvider } from './contexts/MoodEnergyContext';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PomodoroPage from './pages/PomodoroPage';
import AuthPage from './pages/auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <TaskProvider>
            <PomodoroProvider>
              <MoodEnergyProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <ProtectedRoute>
                        <TasksPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/pomodoro" 
                    element={
                      <ProtectedRoute>
                        <PomodoroPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Redirect all unknown routes to auth */}
                  <Route path="*" element={<Navigate to="/auth" replace />} />
                </Routes>
              </MoodEnergyProvider>
            </PomodoroProvider>
          </TaskProvider>
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;