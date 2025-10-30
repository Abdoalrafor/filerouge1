
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLesson } from '../services/lessonService';

const LessonDetail = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const lessonData = await getLesson(id);
                setLesson(lessonData.lesson);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch lesson", error);
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    if (!lesson) {
        return (
            <div className="container mt-5 text-center">
                <h2>Lesson not found</h2>
                <a href="/lessons" className="btn btn-primary">Back to Lessons</a>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/lessons">← Back to Lessons</a>
                </div>
            </nav>

            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{lesson.title}</h2>
                        {user && user.role === 'teacher' && lesson.teacher_id === user.id && (
                            <div>
                                <button className="btn btn-warning btn-sm me-2">Edit</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p><strong>Subject:</strong> {lesson.subject}</p>
                            <p><strong>Level:</strong> {lesson.level}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Teacher:</strong> {lesson.teacher ? lesson.teacher.name : 'Unknown'}</p>
                            <p><strong>Created:</strong> {new Date(lesson.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5>Description</h5>
                        <p className="lead">{lesson.description}</p>
                    </div>

                    <div className="mb-4">
                        <h5>Content</h5>
                        <div className="p-3 bg-light rounded">
                            {lesson.content}
                        </div>
                    </div>

                    {lesson.file_path && (
                        <div className="mb-4">
                            <h5>Attached File</h5>
                            <a href={lesson.file_path} className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Exercises Section */}
            {lesson.exercises && lesson.exercises.length > 0 && (
                <div className="card mt-4">
                    <div className="card-header">
                        <h4>Related Exercises</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {lesson.exercises.map(exercise => (
                                <div key={exercise.id} className="col-md-6 mb-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h6>{exercise.title}</h6>
                                            <p className="small">{exercise.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="badge bg-primary">{exercise.points} points</span>
                                                <a href={`/exercises/${exercise.id}`} className="btn btn-sm btn-outline-primary">
                                                    View Exercise
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonDetail;