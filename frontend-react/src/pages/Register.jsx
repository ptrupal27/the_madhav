import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.register(formData);
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user));
            navigate('/');
        } catch (err) {
             let msg = 'Registration failed.';
             if (err.errors) {
                 msg = Object.values(err.errors).flat().join(' ');
             }
             setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-back-btn">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-light border-0 shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center text-dark bg-white"
                    style={{ transition: 'all 0.3s ease', fontSize: '14px' }}
                >
                    <i className="fa-solid fa-arrow-left me-2 text-success"></i> Back to Home
                </button>
            </div>

            <div className="auth-container animate__animated animate__fadeIn">
                <div className="text-center mb-5">
                    <img 
                        src="/logo-madhav.png" 
                        alt="The Madhav" 
                        style={{ height: '70px', objectFit: 'contain' }} 
                        className="mb-4" 
                    />
                    <h2 className="fw-800 text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Join Us Today</h2>
                    <p className="text-muted small">Fill in your details to create an account</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 small py-3 px-4 rounded-3 mb-4 d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Full Name
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-user text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2" 
                                    id="name" 
                                    placeholder="Enter your name" 
                                    required 
                                    onChange={handleChange} 
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Email Address
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-envelope text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input 
                                    type="email" 
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2" 
                                    id="email" 
                                    placeholder="your@email.com" 
                                    required 
                                    onChange={handleChange} 
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Phone Number
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-phone text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2" 
                                    id="phone" 
                                    placeholder="+91 00000 00000" 
                                    onChange={handleChange} 
                                    style={{ fontSize: '15px' }}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Password
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2" 
                                    id="password" 
                                    required 
                                    minLength="8" 
                                    onChange={handleChange} 
                                    style={{ fontSize: '15px' }}
                                />
                                <button
                                    type="button"
                                    className="btn border-0 text-muted px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: 'transparent' }}
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: '14px' }}></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Confirm
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2" 
                                    id="password_confirmation" 
                                    required 
                                    onChange={handleChange} 
                                    style={{ fontSize: '15px' }}
                                />
                                <button
                                    type="button"
                                    className="btn border-0 text-muted px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ background: 'transparent' }}
                                >
                                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: '14px' }}></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm mb-3 border-0 mt-4" 
                        disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #13985c 0%, #0e7a4a 100%)' }}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                        ) : (
                            <>Create Account <i className="fa-solid fa-user-plus ms-2" style={{ fontSize: '12px' }}></i></>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted small mb-0">
                        Already have an account? <Link to="/login" className="text-success fw-bold text-decoration-none ms-1">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
