
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import Exercises from './components/Exercises';
import LessonDetail from './components/LessonDetail';
import ExerciseDetail from './components/ExerciseDetail';
import CreateLesson from './components/CreateLesson';
import CreateExercise from './components/CreateExercise';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/lessons" element={isAuthenticated ? <Lessons /> : <Navigate to="/login" />} />
          <Route path="/lessons/create" element={isAuthenticated ? <CreateLesson /> : <Navigate to="/login" />} />
          <Route path="/lessons/:id" element={isAuthenticated ? <LessonDetail /> : <Navigate to="/login" />} />
          <Route path="/exercises" element={isAuthenticated ? <Exercises /> : <Navigate to="/login" />} />
          <Route path="/exercises/create" element={isAuthenticated ? <CreateExercise /> : <Navigate to="/login" />} />
          <Route path="/exercises/:id" element={isAuthenticated ? <ExerciseDetail /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;