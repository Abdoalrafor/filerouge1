
import React, { useState, useEffect } from 'react';
import { createLesson } from '../services/lessonService';

const CreateLesson = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        subject: '',
        level: 'beginner'
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        // Check if user is teacher
        if (userData && userData.role !== 'teacher') {
            window.location.href = '/dashboard';
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await createLesson(formData);
            alert('Lesson created successfully!');
            window.location.href = '/lessons';
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || 'Failed to create lesson.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (!user || user.role !== 'teacher') {
        return (
            <div className="container mt-5 text-center">
                <h2>Access Denied</h2>
                <p>Only teachers can create lessons.</p>
                <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
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

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">Create New Lesson</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Lesson Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.title && <div className="text-danger">{validationErrors.title[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.subject && <div className="text-danger">{validationErrors.subject[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="level" className="form-label">Level</label>
                                    <select 
                                        className="form-control" 
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {validationErrors.level && <div className="text-danger">{validationErrors.level[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea 
                                        className="form-control" 
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {validationErrors.description && <div className="text-danger">{validationErrors.description[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Lesson Content</label>
                                    <textarea 
                                        className="form-control" 
                                        id="content"
                                        name="content"
                                        rows="8"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {validationErrors.content && <div className="text-danger">{validationErrors.content[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="file_path" className="form-label">File URL (Optional)</label>
                                    <input 
                                        type="url" 
                                        className="form-control" 
                                        id="file_path"
                                        name="file_path"
                                        value={formData.file_path || ''}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.file_path && <div className="text-danger">{validationErrors.file_path[0]}</div>}
                                </div>

                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Lesson...' : 'Create Lesson'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLesson;