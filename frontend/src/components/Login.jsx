
import React, { useState } from "react";
import { login } from "../services/authService";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            window.location.href = "/dashboard";
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || "Login failed.");
            }
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="email" name="email" placeholder="Enter Email" className="form-control" onChange={handleChange} required />
                                    {validationErrors.email && <span className="text-danger">{validationErrors.email[0]}</span>}
                                </div>
                                <div className="mb-3">
                                    <input type="password" name="password" placeholder="Enter Password" className="form-control" onChange={handleChange} required />
                                    {validationErrors.password && <span className="text-danger">{validationErrors.password[0]}</span>}
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                            <p className="mt-3 text-center">
                                Don't have an account? <a href="/register">Register here</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;