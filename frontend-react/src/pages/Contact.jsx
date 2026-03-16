import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Optional: Backend API call for records
            try {
                await api.request('/contact', 'POST', formData);
            } catch (backendError) {
                console.warn('Backend logging failed, proceeding with WhatsApp');
            }

            // Construct WhatsApp Message
            const whatsappNumber = "919630750578";
            const message = `*Contact Details From Website*%0A%0A` +
                `*Name:* ${formData.name}%0A` +
                `*Email:* ${formData.email}%0A` +
                `*Phone:* ${formData.phone}%0A` +
                `*Subject:* ${formData.subject}%0A` +
                `*Message:* ${formData.message}`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            setStatus({
                type: 'success',
                message: 'Opening WhatsApp to send your message...'
            });

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to process request. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            {/* Back to Home Navigation */}
            <div className="mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-light border shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center text-decoration-none text-dark hover-success"
                    style={{ transition: 'all 0.3s ease' }}
                >
                    <i className="fa-solid fa-arrow-left me-2 text-success"></i> Back to Home
                </button>
            </div>

            {/* Header */}
            <section className="text-center mb-5">
                <h1 className="display-4 fw-bold text-success mb-3">Contact Us</h1>
                <p className="lead text-muted">We'd love to hear from you!</p>
            </section>

            <div className="row g-5">
                {/* Contact Form */}
                <div className="col-lg-7">
                    <div className="bg-white p-4 rounded shadow-sm">
                        <h3 className="mb-4">Send us a Message</h3>

                        {status.message && (
                            <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Message *</label>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="col-lg-5">
                    <div className="bg-white p-4 rounded shadow-sm mb-4">
                        <h3 className="mb-4">Contact Information</h3>

                        <div className="mb-4">
                            <h5 className="text-success">
                                <i className="fa-solid fa-location-dot me-2"></i>Address
                            </h5>
                            <p className="ms-4">
                                Village Bamsoli, Sabalgar<br />
                                Morena, Madhya Pradesh - 476229
                            </p>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-success">
                                <i className="fa-solid fa-phone me-2"></i>Phone / WhatsApp
                            </h5>
                            <p className="ms-4">
                                <a href="https://wa.me/919630750578" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark fw-bold">
                                    +91 9630750578
                                </a>
                            </p>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-success">
                                <i className="fa-solid fa-envelope me-2"></i>Email
                            </h5>
                            <p className="ms-4">
                                <a href="mailto:jadonvijay85@gmail.com" className="text-decoration-none text-dark">
                                    jadonvijay85@gmail.com
                                </a>
                            </p>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-success">
                                <i className="fa-solid fa-clock me-2"></i>Business Hours
                            </h5>
                            <p className="ms-4">
                                Monday - Saturday<br />
                                09:00 AM - 08:00 PM
                            </p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white p-4 rounded shadow-sm">
                        <h5 className="mb-3">Follow Us</h5>
                        <div className="d-flex gap-3">
                            <a href="#" className="btn btn-outline-success">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="btn btn-outline-success">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="#" className="btn btn-outline-success">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                            <a href="https://wa.me/919630750578" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
