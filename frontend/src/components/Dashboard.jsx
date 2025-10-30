
import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../services/authService';
import { getLessons } from '../services/lessonService';
import { getExercises } from '../services/exerciseService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserDetails();
                setUser(userData);

                const lessonsData = await getLessons();
                setLessons(lessonsData.lessons || []);

                const exercisesData = await getExercises();
                setExercises(exercisesData.exercises || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">School Platform</span>
                    <div className="navbar-nav ms-auto">
                        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-info">
                        Welcome, <strong>{user.name}</strong>! You are logged in as a <strong>{user.role}</strong>.
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <a href="/lessons" className="btn btn-outline-primary">View All Lessons</a>
                                <a href="/exercises" className="btn btn-outline-primary">View All Exercises</a>
                                {user.role === 'teacher' && (
                                    <>
                                        <a href="/lessons/create" className="btn btn-success">Create New Lesson</a>
                                        <a href="/exercises/create" className="btn btn-success">Create New Exercise</a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Statistics</h5>
                        </div>
                        <div className="card-body">
                            <p>Total Lessons: <strong>{lessons.length}</strong></p>
                            <p>Total Exercises: <strong>{exercises.length}</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Lessons</h5>
                        </div>
                        <div className="card-body">
                            {lessons.slice(0, 5).map(lesson => (
                                <div key={lesson.id} className="mb-2 p-2 border rounded">
                                    <h6>{lesson.title}</h6>
                                    <small className="text-muted">Subject: {lesson.subject} | Level: {lesson.level}</small>
                                    <br />
                                    <a href={`/lessons/${lesson.id}`} className="btn btn-sm btn-outline-primary mt-1">View Details</a>
                                </div>
                            ))}
                            {lessons.length === 0 && <p>No lessons available.</p>}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Exercises</h5>
                        </div>
                        <div className="card-body">
                            {exercises.slice(0, 5).map(exercise => (
                                <div key={exercise.id} className="mb-2 p-2 border rounded">
                                    <h6>{exercise.title}</h6>
                                    <small className="text-muted">Points: {exercise.points} | Level: {exercise.level}</small>
                                    <br />
                                    <a href={`/exercises/${exercise.id}`} className="btn btn-sm btn-outline-primary mt-1">View Details</a>
                                </div>
                            ))}
                            {exercises.length === 0 && <p>No exercises available.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;