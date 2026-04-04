import React from 'react';
import { Link } from 'react-router-dom';
// import logo from '../assets/images/logo.png'; // Assuming logo is there or will be there

const Footer = () => {
    return (
        <footer className="mega-footer">
            <div className="footer-main">
                <div className="footer-grid">

                    <div className="footer-col about">
                        <Link to="/">
                            <img src="/logo-madhav.png" alt="The Madhav Logo" style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
                        </Link>

                        <p className="brand-desc">
                            India’s trusted partner in modern agriculture. We provide 100% brand-authorized seeds,
                            pesticides, and equipment to help farmers maximize their yield with sustainable
                            practices.
                        </p>
                        <div className="social-links">
                            <a href="#" title="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
                            <a href="https://wa.me/919630750578" target="_blank" rel="noopener noreferrer" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/shop">Shop Products</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Popular Categories</h4>
                        <ul>
                            <li><Link to="/products/seeds">Hybrid Seeds</Link></li>
                            <li><Link to="/products/pesticides">Crop Protection</Link></li>
                            <li><Link to="/products/tools">Smart Agri-Tools</Link></li>
                            <li><Link to="/products/fertilizers">Organic Fertilizers</Link></li>
                            <li><Link to="/products/nutrition">Plant Nutrition</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col contact">
                        <h4>Contact Support</h4>
                        <p>📍 Village Bamsoli, Sabalgar, Morena, MP - 476229</p>
                        <p>📞 Contact: +91 9630750578</p>
                        <p>✉️ Email: jadonvijay85@gmail.com</p>
                        <p>⏰ Mon - Sat: 09:00 AM - 08:00 PM</p>
                    </div>

                </div>
            </div>
            <div className="footer-bottom">
                 <div className="bottom-container">
                    <p>© 2026 The Madhav Agriculture. All Rights Reserved.</p>
                    <p className="design-by">Designed by <a href="https://addigital.in/" target="_blank" rel="ad_digital">AD DIGITAL</a></p>
                     {/* <p className="design-by">Designed by <span className="highlight">AD DIGITAL</span></p> */}
                 </div>
            </div>
        </footer>
    );
};

export default Footer;
