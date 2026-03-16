import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.user.role !== 'admin') {
                throw new Error('Unauthorized. You do not have admin privileges.');
            }

            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%)', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative background elements */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(19, 152, 92, 0.05)', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(19, 152, 92, 0.03)', zIndex: 0 }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-5">
                                    <div className="mb-4 d-inline-block p-3 rounded-circle" style={{ background: '#f0fdf4' }}>
                                        <i className="fa-solid fa-user-shield fa-3x" style={{ color: '#13985c' }}></i>
                                    </div>
                                    <h2 className="fw-800 text-dark mb-1">Admin Portal</h2>
                                    <p className="text-muted small">Secure access to management tools</p>
                                </div>
 
                                {error && (
                                    <div className="alert alert-danger border-0 small d-flex align-items-center py-2 px-3 rounded-3 mb-4">
                                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Email Address</label>
                                        <div className="input-group bg-light border-0 rounded-3 p-1">
                                            <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                                <i className="fa-solid fa-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                                placeholder="admin@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>Password</label>
                                        <div className="input-group bg-light border-0 rounded-3 p-1">
                                            <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                                <i className="fa-solid fa-lock text-muted"></i>
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                                placeholder="Enter password"
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
                                        className="btn btn-success w-100 py-3 fw-bold border-0 shadow-sm"
                                        disabled={loading}
                                        style={{ borderRadius: '14px', background: 'linear-gradient(135deg, #13985c 0%, #0e7a4a 100%)' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Authorizing...
                                            </>
                                        ) : (
                                            <>
                                                Access Dashboard <i className="fa-solid fa-arrow-right ms-2" style={{ fontSize: '12px' }}></i>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-5 pt-2">
                                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                                        Contact IT support if you've lost your access credentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-4">
                            <button 
                                onClick={() => navigate('/')} 
                                className="btn btn-link text-muted text-decoration-none small fw-600"
                            >
                                <i className="fa-solid fa-house me-1"></i> Back to Public Site
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
