import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: 'fa-gauge', label: 'Dashboard' },
        { path: '/admin/products', icon: 'fa-box', label: 'Products' },
        { path: '/admin/categories', icon: 'fa-list', label: 'Categories' },
        { path: '/admin/orders', icon: 'fa-shopping-cart', label: 'Orders' },
        { path: '/admin/users', icon: 'fa-users', label: 'Customers' },
        { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
        { path: '/', icon: 'fa-eye', label: 'View Website' },
    ];

    return (
        <div className="admin-container d-flex" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay d-lg-none" 
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', zIndex: 1040,
                        backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div 
                className={`bg-dark text-white shadow admin-sidebar ${isSidebarOpen ? 'show' : ''}`} 
                style={{ 
                    width: '260px', 
                    minHeight: '100vh', 
                    position: 'fixed', 
                    zIndex: 1050,
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    left: '0',
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    visibility: isSidebarOpen ? 'visible' : 'hidden'
                }}
            >
                <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center bg-dark sticky-top">
                    <Link to="/admin/dashboard" className="text-decoration-none d-flex align-items-center">
                        <img 
                            src="/logo-madhav.png" 
                            alt="The Madhav" 
                            style={{ height: '35px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
                            className="me-2"
                        />
                        <h5 className="mb-0 fw-bold text-white small text-uppercase tracking-wider">Admin Panel</h5>
                    </Link>
                    <button className="btn btn-link text-white d-lg-none p-0 border-0 shadow-none" onClick={() => setIsSidebarOpen(false)}>
                        <i className="fa-solid fa-xmark fs-4"></i>
                    </button>
                </div>
                <div className="py-2 h-100 overflow-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`d-flex align-items-center p-3 text-decoration-none transition-all ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white shadow-sm fw-bold' 
                                : 'text-light opacity-75 hover-opacity-100'
                            }`}
                            onClick={() => {
                                if (window.innerWidth < 992) setIsSidebarOpen(false);
                            }}
                            style={{ borderLeft: location.pathname === item.path ? '4px solid #fff' : '4px solid transparent' }}
                        >
                            <i className={`fa-solid ${item.icon} me-3 text-center`} style={{ width: '22px' }}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <div className="p-3 mt-4">
                        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div 
                className="flex-grow-1 admin-main-content bg-light" 
                style={{ 
                    transition: 'all 0.35s ease-in-out',
                    width: '100%',
                    minWidth: 0
                }}
            >
                {/* Header Navbar */}
                <nav className="navbar navbar-light bg-white border-bottom sticky-top shadow-sm px-2 px-md-3" style={{ height: '70px', zIndex: 1030 }}>
                    <div className="container-fluid d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <button className="btn btn-light border me-3 d-lg-none shadow-none p-2" onClick={() => setIsSidebarOpen(true)}>
                                <i className="fa-solid fa-bars-staggered"></i>
                            </button>
                            <span className="navbar-brand mb-0 h1 fs-5 fw-bold text-dark d-none d-md-inline-block">
                                {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
                            </span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                            <Link to="/" className="btn btn-outline-success btn-sm d-none d-sm-flex align-items-center gap-2 rounded-pill px-3 fw-bold">
                                <i className="fa-solid fa-eye"></i> Website
                            </Link>

                            <div className="dropdown">
                                <button 
                                    className="btn border-0 d-flex align-items-center dropdown-toggle shadow-none p-1" 
                                    type="button" 
                                    data-bs-toggle="dropdown"
                                >
                                    <div className="me-2 text-end d-none d-md-block">
                                        <div className="fw-bold small lh-1 mb-1">{JSON.parse(localStorage.getItem('admin_user'))?.name || 'Admin'}</div>
                                        <div className="text-muted smaller">Administrator</div>
                                    </div>
                                    <div className="position-relative">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${JSON.parse(localStorage.getItem('admin_user'))?.name || 'Admin'}&background=0D6EFD&color=fff&bold=true`} 
                                            className="rounded-circle border border-2 border-white shadow-sm" 
                                            width="40" height="40" alt="Admin"
                                        />
                                        <span className="position-absolute bottom-0 end-0 bg-success border border-white border-2 rounded-circle p-1" style={{ width: '12px', height: '12px' }}></span>
                                    </div>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2">
                                    <li className="px-3 py-2 border-bottom d-md-none mb-2">
                                        <div className="fw-bold small">{JSON.parse(localStorage.getItem('admin_user'))?.name || 'Admin'}</div>
                                        <div className="text-muted smaller">Administrator</div>
                                    </li>
                                    <li><Link className="dropdown-item rounded-3 py-2 px-3" to="/admin/settings"><i className="fa-solid fa-user-gear me-2 text-muted"></i> Profile</Link></li>
                                    <li><Link className="dropdown-item rounded-3 py-2 px-3" to="/"><i className="fa-solid fa-earth-americas me-2 text-muted"></i> Website</Link></li>
                                    <li><hr className="dropdown-divider opacity-50" /></li>
                                    <li><button className="dropdown-item rounded-3 py-2 px-3 text-danger fw-bold" onClick={handleLogout}><i className="fa-solid fa-power-off me-2"></i> Logout</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Dashboard Page Content */}
                <div className="p-3 p-md-4 main-inner-container">
                    {children}
                </div>
            </div>

            <style>{`
                @media (min-width: 992px) {
                    .admin-sidebar {
                        transform: translateX(0) !important;
                        visibility: visible !important;
                    }
                    .admin-main-content {
                        margin-left: 260px !important;
                        width: calc(100% - 260px) !important;
                    }
                }
                @media (max-width: 991.98px) {
                    .admin-main-content {
                        margin-left: 0 !important;
                        width: 100% !important;
                        padding-left: 0 !important;
                    }
                }
                .transition-all {
                    transition: all 0.2s ease;
                }
                .hover-opacity-100:hover {
                    opacity: 1 !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }

                /* Tab Responsiveness */
                .nav-tabs {
                    flex-wrap: nowrap !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none; /* Firefox */
                }
                .nav-tabs::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }
                .nav-link {
                    white-space: nowrap !important;
                }

                /* Responsive Table Fixes */
                @media (max-width: 576px) {
                    .admin-container { width: 100vw !important; overflow-x: hidden !important; }
                    .card-body { padding: 0.65rem !important; }
                    .main-inner-container { padding: 0.5rem !important; margin: 0 !important; width: 100% !important; max-width: 100vw !important; }
                    .table td, .table th { white-space: nowrap; font-size: 0.8rem; padding: 0.65rem 0.4rem !important; }
                    h4 { font-size: 1.05rem !important; }
                    h5 { font-size: 0.95rem !important; }
                    .card { width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; }
                    .row { margin-left: -0.25rem !important; margin-right: -0.25rem !important; width: calc(100% + 0.5rem) !important; }
                    .col-6, .col-12 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
                }

                /* Text Utilities */
                .text-truncate-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .smaller { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default AdminLayout;
