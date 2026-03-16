import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
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

            {/* Hero Section */}
            <section className="text-center mb-5">
                <h1 className="display-4 fw-bold text-success mb-3">About PlantHub</h1>
                <p className="lead text-muted">India's Trusted Partner in Modern Agriculture</p>
            </section>

            {/* Brand Story */}
            <section className="brand-intro mb-5">
                <div className="intro-content">
                    <h2 className="text-center mb-4">Our Story</h2>
                    <p className="main-text">
                        At <strong>PlantHub</strong>, we are committed to empowering Indian farmers with
                        premium quality <strong>seeds</strong>, <strong>organic pesticides</strong>,
                        <strong>high-yield fertilizers</strong>, and <strong>smart farming tools</strong> from
                        India's leading brands. We believe in providing 100% original and brand-authorized
                        products to ensure a prosperous harvest for every farmer.
                    </p>

                    <div className="categories-highlight">
                        <span className="tag">Crop Protection</span>
                        <span className="tag">Organic Nutrition</span>
                        <span className="tag">Modern Agri-Tools</span>
                        <span className="tag">Hybrid Seeds</span>
                        <span className="tag">Soil Wellness</span>
                    </div>

                    <p className="trust-points">
                        🌱 Genuine Inventory | 🚚 Lightning Fast Delivery | 🧾 GST Invoices Provided
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container">
                    <h2 className="text-center mb-5 fw-bold">Why Choose Us?</h2>
                    <div className="row g-4 text-center">
                        <div className="col-6 col-md-3">
                            <div className="feature-item">
                                <i className="fa-solid fa-tags"></i>
                                <h5>Lowest Prices</h5>
                                <p>Best deals in market</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="feature-item">
                                <i className="fa-solid fa-headset"></i>
                                <h5>24/7 Available</h5>
                                <p>Expert agri support</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="feature-item">
                                <i className="fa-solid fa-truck-fast"></i>
                                <h5>Fast Delivery</h5>
                                <p>Direct to your farm</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="feature-item">
                                <i className="fa-solid fa-shield-halved"></i>
                                <h5>100% Secure</h5>
                                <p>Safe & trusted payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="p-4 bg-white rounded shadow-sm h-100">
                                <h3 className="text-success mb-3">
                                    <i className="fa-solid fa-bullseye me-2"></i>Our Mission
                                </h3>
                                <p>
                                    To empower farmers with access to high-quality agricultural products
                                    and modern farming solutions that increase productivity and sustainability.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-4 bg-white rounded shadow-sm h-100">
                                <h3 className="text-success mb-3">
                                    <i className="fa-solid fa-eye me-2"></i>Our Vision
                                </h3>
                                <p>
                                    To become India's most trusted digital platform for agricultural products,
                                    bridging the gap between farmers and quality farming solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
