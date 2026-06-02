import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            await api.sendForgotOtp(email);
            setMessage('OTP sent to your email. Please check Gmail and enter the code below.');
            setStep(2);
        } catch (err) {
            let msg = 'Unable to send OTP. Please try again.';
            if (err.errors) {
                msg = Object.values(err.errors).flat().join(' ');
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            await api.verifyForgotOtp(email, otp);
            setMessage('OTP verified. Now set your new password.');
            setStep(3);
        } catch (err) {
            let msg = 'Unable to verify OTP. Please try again.';
            if (err.errors) {
                msg = Object.values(err.errors).flat().join(' ');
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        if (password !== passwordConfirm) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.resetPassword(email, otp, password, passwordConfirm);
            setMessage('Password reset successfully. You can now log in with your new password.');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            let msg = 'Unable to reset password. Please try again.';
            if (err.errors) {
                msg = Object.values(err.errors).flat().join(' ');
            } else if (err.message) {
                msg = err.message;
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
                    <h2 className="fw-800 text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>
                        Forgot Password
                    </h2>
                    <p className="text-muted small">
                        {step === 1 && 'Enter your account email to receive a Gmail OTP.'}
                        {step === 2 && 'Enter the OTP we sent to your email.'}
                        {step === 3 && 'Set a new password for your account.'}
                    </p>
                </div>

                {message && (
                    <div className="alert alert-success border-0 small py-3 px-4 rounded-3 mb-4 d-flex align-items-center">
                        <i className="fa-solid fa-circle-check me-2"></i>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger border-0 small py-3 px-4 rounded-3 mb-4 d-flex align-items-center">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="auth-form">
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

                        <button
                            type="submit"
                            className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm mb-3 border-0"
                            disabled={loading}
                            style={{ background: 'linear-gradient(135deg, #13985c 0%, #0e7a4a 100%)' }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Sending OTP...</>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <div className="mb-4">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="form-control bg-light border-0 rounded-3 p-3"
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className="mb-5">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Enter OTP
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-key text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                    placeholder="123456"
                                    style={{ fontSize: '15px' }}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm mb-3 border-0"
                            disabled={loading}
                            style={{ background: 'linear-gradient(135deg, #13985c 0%, #0e7a4a 100%)' }}
                        >
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Verifying OTP...</>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="mb-4">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                New Password
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-lock text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                    placeholder="New password"
                                    style={{ fontSize: '15px' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link text-muted border-0 bg-transparent px-2 me-2"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{ fontSize: '16px', textDecoration: 'none' }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label small fw-700 text-muted text-uppercase mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                Confirm Password
                            </label>
                            <div className="input-group bg-light border-0 rounded-3 p-1">
                                <span className="input-group-text bg-transparent border-0 pe-0 ms-2">
                                    <i className="fa-solid fa-lock text-muted" style={{ fontSize: '14px' }}></i>
                                </span>
                                <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    className="form-control bg-transparent border-0 shadow-none ps-3 py-2"
                                    placeholder="Confirm password"
                                    style={{ fontSize: '15px' }}
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link text-muted border-0 bg-transparent px-2 me-2"
                                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                    style={{ fontSize: '16px', textDecoration: 'none' }}
                                    aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
                                >
                                    <i className={`fa-solid ${showPasswordConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
                                <><span className="spinner-border spinner-border-sm me-2"></span>Resetting Password...</>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center mt-4">
                    <p className="text-muted small mb-0">
                        Remembered your password? <Link to="/login" className="text-success fw-bold text-decoration-none ms-1">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
