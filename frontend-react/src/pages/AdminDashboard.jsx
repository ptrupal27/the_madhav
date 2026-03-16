import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const resolveName = (attr) => {
        if (!attr) return '';
        if (typeof attr === 'string') return attr;
        if (typeof attr === 'object' && attr !== null) return attr.en || Object.values(attr)[0] || '';
        return '';
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/admin/login');
                    return;
                }
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setStats(data.stats);
            setRecentOrders(data.recent_orders || []);
            setLowStockProducts(data.low_stock_products || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="row g-2 g-md-4 mb-4">
                {/* Sale Stats */}
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100">
                        <div className="card-body p-2 p-md-3 text-center text-sm-start h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="overflow-hidden w-100">
                                    <h6 className="opacity-75 mb-1 text-truncate" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>TODAY'S SALES</h6>
                                    <h4 className="fw-bold mb-0">₹{stats?.today_revenue || 0}</h4>
                                </div>
                                <div className="fs-4 opacity-25 d-none d-sm-block">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm bg-success text-white h-100">
                        <div className="card-body p-2 p-md-3 text-center text-sm-start h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="overflow-hidden w-100">
                                    <h6 className="opacity-75 mb-1 text-truncate" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>MONTHLY</h6>
                                    <h4 className="fw-bold mb-0">₹{stats?.monthly_revenue || 0}</h4>
                                </div>
                                <div className="fs-4 opacity-25 d-none d-sm-block">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm bg-warning text-white h-100">
                        <div className="card-body p-2 p-md-3 text-center text-sm-start h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="overflow-hidden w-100">
                                    <h6 className="opacity-75 mb-1 text-truncate" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>PENDING</h6>
                                    <h4 className="fw-bold mb-0">{stats?.pending_orders || 0}</h4>
                                </div>
                                <div className="fs-4 opacity-25 d-none d-sm-block">
                                    <i className="fa-solid fa-clock"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm bg-info text-white h-100">
                        <div className="card-body p-2 p-md-3 text-center text-sm-start h-100 d-flex flex-column justify-content-center">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="overflow-hidden w-100">
                                    <h6 className="opacity-75 mb-1 text-truncate" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>LOW STOCK</h6>
                                    <h4 className="fw-bold mb-0">{stats?.low_stock_count || 0}</h4>
                                </div>
                                <div className="fs-4 opacity-25 d-none d-sm-block">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 g-md-4">
                {/* Recent Orders List */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 px-3 px-md-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0">Recent Orders</h5>
                                <Link to="/admin/orders" className="btn btn-sm btn-link text-decoration-none p-0">View All</Link>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-3 px-md-4 border-bottom-0">Order ID</th>
                                            <th className="border-bottom-0">Customer</th>
                                            <th className="border-bottom-0">Total</th>
                                            <th className="border-bottom-0">Status</th>
                                            <th className="text-end px-3 px-md-4 border-bottom-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-3 px-md-4 fw-bold text-primary">#{order.order_number || order.id}</td>
                                                <td><div className="text-truncate" style={{ maxWidth: '120px' }}>{order.user?.name || 'Guest'}</div></td>
                                                <td className="fw-bold">₹{order.total_amount}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="text-end px-3 px-md-4">
                                                    <Link to="/admin/orders" className="btn btn-sm btn-outline-primary rounded-pill px-3">Details</Link>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">No orders yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="col-12 col-lg-4">
                    {/* Low Stock Products */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-bottom-0 pt-4 px-3 px-md-4">
                            <h5 className="fw-bold mb-0">Low Stock Alert</h5>
                        </div>
                        <div className="card-body px-3 px-md-4">
                            {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
                                <div key={product.id} className="d-flex align-items-center mb-3 p-2 bg-light rounded-3 transition-all hover-shadow-sm">
                                    <img src={product.image} width="45" height="45" style={{ objectFit: 'cover' }} className="rounded border me-3" alt={resolveName(product.name)} />
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-0 small fw-bold text-truncate">{resolveName(product.name)}</h6>
                                        <div className="text-danger smaller fw-medium">Remaining: {product.stock}</div>
                                    </div>
                                    <Link to={`/admin/products`} className="btn btn-sm btn-outline-secondary ms-2">Refill</Link>
                                </div>
                            )) : <div className="text-muted small py-3 text-center border rounded-3 border-dashed">All products are healthy</div>}
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="card border-0 shadow-sm gradient-bg-blue text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)', borderRadius: '15px' }}>
                        <div className="card-body p-4 position-relative">
                            <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                <i className="fa-solid fa-coins fa-4x rotate-12"></i>
                            </div>
                            <h6 className="fw-bold opacity-75 mb-3 text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Overall Growth</h6>
                            <h2 className="fw-bold mb-2">₹{stats?.total_revenue || 0}</h2>
                            <p className="mb-0 smaller d-flex align-items-center gap-2">
                                <span className="bg-white bg-opacity-25 rounded-circle p-1 px-2"><i className="fa-solid fa-arrow-up"></i></span>
                                Total Revenue Generated
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
