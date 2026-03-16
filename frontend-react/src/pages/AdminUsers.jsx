import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [viewingHistory, setViewingHistory] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/dashboard/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserHistory = async (user) => {
        setSelectedUser(user);
        setViewingHistory(true);
        setUserOrders([]);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/dashboard/users/${user.id}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUserOrders(data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/dashboard/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setUsers(users.filter(u => u.id !== id));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                        <h4 className="fw-bold mb-0 text-center text-sm-start">Customer Management</h4>
                    </div>

                    <div className="table-responsive border rounded-3">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-3">Customer Name</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Orders</th>
                                    <th className="py-3">Joined</th>
                                    <th className="py-3 text-end px-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : users.length > 0 ? users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                    className="rounded-circle me-3"
                                                    width="35"
                                                    alt={user.name}
                                                />
                                                <div className="fw-bold">{user.name}</div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>
                                            <span className="badge bg-secondary rounded-pill">
                                                {user.orders_count || 0} Orders
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-info shadow-none" 
                                                    title="View History"
                                                    onClick={() => fetchUserHistory(user)}
                                                >
                                                    <i className="fa-solid fa-history"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger shadow-none"
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Block/Delete"
                                                >
                                                    <i className="fa-solid fa-ban"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="6" className="text-center py-4">No users found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {viewingHistory && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Order History - {selectedUser?.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setViewingHistory(false)}></button>
                            </div>
                            <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {userOrders.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm table-hover align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>Order #</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userOrders.map(order => (
                                                    <tr key={order.id}>
                                                        <td className="fw-bold">#{order.order_number}</td>
                                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td>₹{order.total_amount}</td>
                                                        <td>
                                                            <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted">No orders found for this customer.</div>
                                )}
                            </div>
                            <div className="modal-footer border-top">
                                <button type="button" className="btn btn-secondary" onClick={() => setViewingHistory(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
