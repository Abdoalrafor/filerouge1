
import React, { useState } from "react";
import { register } from "../services/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            window.location.href = "/dashboard";
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || "Registration failed.");
            }
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Create an Account</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="text" name="name" placeholder="Enter Full Name" className="form-control" onChange={handleChange} required />
                                    {validationErrors.name && <span className="text-danger">{validationErrors.name[0]}</span>}
                                </div>
                                <div className="mb-3">
                                    <input type="email" name="email" placeholder="Enter Email" className="form-control" onChange={handleChange} required />
                                    {validationErrors.email && <span className="text-danger">{validationErrors.email[0]}</span>}
                                </div>
                                <div className="mb-3">
                                    <input type="password" name="password" placeholder="Enter Password" className="form-control" onChange={handleChange} required />
                                    {validationErrors.password && <span className="text-danger">{validationErrors.password[0]}</span>}
                                </div>
                                <div className="mb-3">
                                    <label>Register as:</label>
                                    <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </div>
                            </form>
                            <p className="mt-3 text-center">
                                Already have an account? <a href="/login">Login here</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;