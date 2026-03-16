import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { refreshCart } = useCart();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await api.login(email, password);
            
            if (data.user.role === 'admin') {
                localStorage.setItem('admin_token', data.access_token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                navigate('/admin/dashboard');
            } else {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                await refreshCart(); // This will trigger the sync logic
                navigate('/user/dashboard');
            }
        } catch (err) {
            let msg = 'Login failed. Please check your credentials.';
            if (err.errors && err.errors.email) {
                msg = err.errors.email[0];
            } else if (err.message) {
                msg = err.message;
            } else if (err.status) {
                 msg = `Server Error: ${err.status}`;
            }
            if(err.status === 400) {
                 msg = 'Bad Request (400): Ensure all fields are correct.';
                 if (err.message) msg += ` Details: ${err.message}`;
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
                        style={{ height: '90px', objectFit: 'contain' }} 
                        className="mb-4" 
                    />
                    <h2 className="fw-800 text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Welcome Back</h2>
                    <p className="text-muted small">Enter your details to access your account</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 small py-3 px-4 rounded-3 mb-4 d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="mb-4">
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
                                placeholder="name@example.com"
                                style={{ fontSize: '15px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-700 text-muted text-uppercase m-0" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Password
                            </label>
                            {/* Potential for Forgot Password link here */}
                        </div>
                        <div className="input-group bg-light border-0 rounded-3 p-1">
                            <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                <i className="fa-solid fa-lock text-muted" style={{ fontSize: '14px' }}></i>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                placeholder="••••••••"
                                style={{ fontSize: '15px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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

                    <button 
                        type="submit" 
                        className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm mb-3 border-0" 
                        disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #13985c 0%, #0e7a4a 100%)' }}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</>
                        ) : (
                            <>Sign In <i className="fa-solid fa-arrow-right ms-2" style={{ fontSize: '12px' }}></i></>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted small mb-0">
                        Don't have an account? <Link to="/register" className="text-success fw-bold text-decoration-none ms-1">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
