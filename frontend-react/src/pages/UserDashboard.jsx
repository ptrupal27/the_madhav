import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const userData = await api.request('/user/profile');
            setUser(userData.user);

            const ordersData = await api.request('/user/orders');
            setOrders(ordersData.data || []);
        } catch (error) {
            console.error('Dashboard Error:', error);
            if (error.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            // Logged out anyway
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.request('/user/profile', 'PUT', formData);
            alert('Profile updated successfully!');
            loadData();
        } catch (error) {
            console.error('Update Error:', error);
            alert('Failed to update profile. ' + (error.message || ''));
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (order) => {
        try {
            setLoading(true);
            for (const item of order.items) {
                await api.addToCart(item.product_id, item.quantity);
            }
            alert('All items from this order have been added to your cart!');
            navigate('/cart');
        } catch (error) {
            console.error('Reorder Error:', error);
            alert('Failed to reorder some items. Please check your cart.');
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }

    return (
        <div className="min-vh-100" style={{ background: '#f8faf9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Modern Header */}
            <div className="bg-white shadow-sm border-bottom sticky-top" style={{ zIndex: '1030' }}>
                <div className="container py-2 py-md-3 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to="/" className="text-decoration-none text-muted small fw-bold d-flex align-items-center">
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            <span>Back to Shop</span>
                        </Link>
                        <h5 className="mb-0 fw-bold text-success" style={{ letterSpacing: '-0.5px' }}>My Account</h5>
                        <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={handleLogout} style={{ fontSize: '0.75rem' }}>
                            <i className="fa-solid fa-power-off me-md-2"></i>
                            <span className="d-none d-md-inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container py-4 px-2 px-md-3">
                <div className="row g-4">
                    {/* Navigation Section */}
                    <div className="col-12 col-lg-3">
                        {/* Profile Info Card (Desktop Only) */}
                        <div className="bg-white rounded-4 shadow-sm p-4 text-center mb-4 d-none d-lg-block border">
                            <div className="position-relative d-inline-block mb-3">
                                <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center"
                                    style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                                    <i className="fa-solid fa-user-circle"></i>
                                </div>
                            </div>
                            <h5 className="fw-bold mb-1 text-truncate">{user?.name}</h5>
                            <p className="text-muted small mb-0 text-truncate">{user?.email}</p>
                        </div>

                        {/* Navigation Tabs - Stacks vertically on desktop, Horizontal on Mobile */}
                        <div className="bg-white rounded-4 shadow-sm overflow-hidden border sticky-top" style={{ top: '80px' }}>
                            <div className="nav nav-pills d-flex flex-row flex-lg-column p-2 p-lg-0 dashboard-nav-new">
                                <button
                                    className={`nav-link flex-fill flex-lg-grow-1 text-center text-lg-start p-3 border-0 rounded-3 rounded-lg-0 ${activeTab === 'orders' ? 'active bg-success shadow-sm' : 'text-muted'}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <i className="fa-solid fa-basket-shopping me-lg-3 d-block d-lg-inline-block mb-1 mb-lg-0"></i>
                                    <span className="fw-bold small">My Orders</span>
                                </button>
                                <button
                                    className={`nav-link flex-fill flex-lg-grow-1 text-center text-lg-start p-3 border-0 rounded-3 rounded-lg-0 ${activeTab === 'profile' ? 'active bg-success shadow-sm' : 'text-muted'}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <i className="fa-solid fa-gear me-lg-3 d-block d-lg-inline-block mb-1 mb-lg-0"></i>
                                    <span className="fw-bold small">Settings</span>
                                </button>
                                <button
                                    className="nav-link flex-fill text-center d-lg-none p-3 text-danger border-0"
                                    onClick={handleLogout}
                                >
                                    <i className="fa-solid fa-power-off d-block mb-1"></i>
                                    <span className="fw-bold small">Exit</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="col-12 col-lg-9">
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-4 shadow-sm border overflow-hidden animate__animated animate__fadeIn">
                                <div className="p-3 p-md-4 border-bottom bg-light bg-opacity-50">
                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                        <i className="fa-solid fa-receipt text-success me-3"></i>
                                        Recent Orders
                                    </h5>
                                </div>

                                {orders.length > 0 ? (
                                    <div className="p-0">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-3 p-md-4 border-bottom hover-bg-light transition-all order-item-card">
                                                <div className="row align-items-center g-3">
                                                    <div className="col-6 col-md-3">
                                                        <div className="small text-muted mb-1">Order Ref</div>
                                                        <div className="fw-800 text-dark">#{order.id}</div>
                                                        <div className="smaller text-muted">{order.items?.length || 0} Products</div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="small text-muted mb-1">Placed On</div>
                                                        <div className="fw-bold small">
                                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-2 text-md-center">
                                                        <div className="small text-muted mb-1">Amount</div>
                                                        <div className="fw-800 text-success">₹{order.total_amount}</div>
                                                    </div>
                                                    <div className="col-6 col-md-2">
                                                        <div className="small text-muted mb-1 d-none d-md-block">Status</div>
                                                        <div className="d-flex flex-column gap-1 align-items-end align-items-md-start">
                                                            <span className={`badge rounded-pill bg-${order.status === 'completed' ? 'success' :
                                                                order.status === 'pending' ? 'warning text-dark' : 'secondary'
                                                                }`} style={{ fontSize: '0.65rem' }}>
                                                                {order.status}
                                                            </span>
                                                            {order.shipping_status && (
                                                                <span className="smaller text-muted d-flex align-items-center" style={{ fontSize: '0.6rem' }}>
                                                                    <i className="fa-solid fa-truck-fast me-1"></i>
                                                                    {order.shipping_status.replace(/_/g, ' ')}
                                                                </span>
                                                            )}
                                                            {order.tracking_number && (
                                                                <div className="smaller text-muted mt-1" style={{ fontSize: '0.6rem' }}>
                                                                    <i className="fa-solid fa-barcode me-1"></i>
                                                                    {order.courier_name}: {order.tracking_number}
                                                                </div>
                                                            )}
                                                            {order.estimated_delivery_date && order.status !== 'completed' && (
                                                                <div className="smaller text-success mt-1 fw-bold" style={{ fontSize: '0.6rem' }}>
                                                                    <i className="fa-solid fa-calendar-check me-1"></i>
                                                                    Delivery by: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-2 text-end">
                                                        <div className="small text-muted mb-1 d-none d-md-block">Action</div>
                                                        <div className="d-flex flex-column gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold w-100"
                                                                onClick={() => setSelectedOrder(order)}
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-success rounded-pill px-3 fw-bold w-100"
                                                                onClick={() => handleReorder(order)}
                                                            >
                                                                <i className="fa-solid fa-rotate-right me-1"></i>
                                                                Reorder
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 px-4">
                                        <div className="text-muted opacity-25 mb-4">
                                            <i className="fa-solid fa-box-open fa-5x"></i>
                                        </div>
                                        <h5 className="fw-bold mb-2">No orders found</h5>
                                        <p className="text-muted mb-4">You haven't placed any orders with us yet.</p>
                                        <Link to="/" className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow-sm">
                                            Discover Plants
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-4 shadow-sm border overflow-hidden animate__animated animate__fadeIn">
                                <div className="p-3 p-md-4 border-bottom bg-light bg-opacity-50">
                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                        <i className="fa-solid fa-user-edit text-success me-3"></i>
                                        Profile Settings
                                    </h5>
                                </div>
                                <div className="p-4">
                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="row g-4">
                                            <div className="col-md-6 text-start">
                                                <label className="form-label small fw-bold text-muted text-uppercase mb-1 ms-1">Full Name</label>
                                                <div className="input-group border rounded-3 p-1">
                                                    <span className="input-group-text bg-transparent border-0"><i className="fa-solid fa-user-circle text-muted px-2"></i></span>
                                                    <input
                                                        type="text"
                                                        className="form-control border-0 shadow-none py-2"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Your name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-start">
                                                <label className="form-label small fw-bold text-muted text-uppercase mb-1 ms-1">Email (Fixed)</label>
                                                <div className="input-group border rounded-3 p-1 bg-light">
                                                    <span className="input-group-text bg-transparent border-0"><i className="fa-solid fa-envelope text-muted px-2"></i></span>
                                                    <input type="email" className="form-control border-0 bg-transparent shadow-none py-2" defaultValue={user?.email} disabled />
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-start">
                                                <label className="form-label small fw-bold text-muted text-uppercase mb-1 ms-1">Phone Number</label>
                                                <div className="input-group border rounded-3 p-1">
                                                    <span className="input-group-text bg-transparent border-0"><i className="fa-solid fa-phone text-muted px-2"></i></span>
                                                    <input
                                                        type="tel"
                                                        className="form-control border-0 shadow-none py-2"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="Phone number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 text-start">
                                                <label className="form-label small fw-bold text-muted text-uppercase mb-1 ms-1">Shipping Address</label>
                                                <div className="input-group border rounded-3 p-1">
                                                    <span className="input-group-text bg-transparent border-0 align-items-start pt-2"><i className="fa-solid fa-map-location-dot text-muted px-2"></i></span>
                                                    <textarea
                                                        className="form-control border-0 shadow-none py-2"
                                                        rows="3"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        placeholder="Delivery address..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-top d-flex gap-2">
                                            <button type="submit" className="btn btn-success px-5 py-2 rounded-3 fw-bold shadow-sm">
                                                Save Settings
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary px-4 py-2 rounded-3 border-0">
                                                Discard
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '1050' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <div className="modal-header border-bottom-0 p-4">
                                <h5 className="modal-title fw-bold text-success">
                                    <i className="fa-solid fa-circle-info me-2"></i>
                                    Order #{selectedOrder.id} Details
                                </h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => setSelectedOrder(null)}></button>
                            </div>
                            <div className="modal-body p-0">
                                {selectedOrder.estimated_delivery_date && (
                                    <div className="bg-success bg-opacity-10 p-3 mb-0 border-bottom mx-4 mb-3 rounded-3">
                                        <div className="d-flex align-items-center text-success">
                                            <i className="fa-solid fa-truck-clock me-2"></i>
                                            <span className="small fw-bold">
                                                Estimated Delivery: {new Date(selectedOrder.estimated_delivery_date).toLocaleDateString('en-IN', {
                                                    weekday: 'long', day: 'numeric', month: 'long'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="ps-4 border-0 small text-uppercase text-muted">Product</th>
                                                <th className="border-0 small text-uppercase text-muted text-center">Qty</th>
                                                <th className="border-0 small text-uppercase text-muted">Price</th>
                                                <th className="pe-4 border-0 small text-uppercase text-muted text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="ps-4 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-light rounded p-1 me-3" style={{ width: '45px', height: '45px' }}>
                                                                <img
                                                                    src={item.product?.img || 'https://placehold.co/40'}
                                                                    alt=""
                                                                    className="w-100 h-100 object-fit-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold small">{item.product_name}</div>
                                                                <div className="smaller text-muted">ID: {item.product_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <span className="badge bg-light text-dark border px-2 py-1">{item.quantity}</span>
                                                    </td>
                                                    <td className="py-3 small">₹{item.price}</td>
                                                    <td className="pe-4 py-3 text-end fw-bold text-success small">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 p-4">
                                <div className="w-100 d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
                                    <span className="fw-bold text-muted">Order Total</span>
                                    <span className="h5 mb-0 fw-800 text-success">₹{selectedOrder.total_amount}</span>
                                </div>
                                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold mt-3" onClick={() => setSelectedOrder(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .fw-800 { font-weight: 800; }
                .smaller { font-size: 0.75rem; }
                .hover-bg-light:hover { background-color: #f8faf9; }
                .transition-all { transition: all 0.2s ease; }
                
                @media (max-width: 991px) {
                    .dashboard-nav-new {
                        border-radius: 12px;
                    }
                    .dashboard-nav-new .nav-link {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-size: 10px !important;
                        padding: 10px 5px !important;
                    }
                    .dashboard-nav-new .nav-link i {
                        font-size: 1.2rem;
                    }
                }
                
                .order-item-card {
                    background: #fff;
                }
                .order-item-card:last-child {
                    border-bottom: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
