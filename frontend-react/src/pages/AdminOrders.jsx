import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const resolveName = (attr) => {
        if (!attr) return '';
        if (typeof attr === 'string') return attr;
        if (typeof attr === 'object' && attr !== null) return attr.en || Object.values(attr)[0] || '';
        return '';
    };
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        shipping_status: '',
        payment_status: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        per_page: 20
    });

    useEffect(() => {
        fetchOrders();
    }, [filters.status, filters.shipping_status, filters.payment_status, filters.sort_by, filters.sort_order, filters.per_page, pagination.current_page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const queryParams = new URLSearchParams({
                ...filters,
                page: pagination.current_page
            }).toString();

            const response = await fetch(`${API_URL}/admin/orders?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setOrders(data.data || []);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
                per_page: data.per_page
            });

            if (selectedOrder) {
                const refreshedOrder = (data.data || []).find(o => o.id === selectedOrder.id);
                if (refreshedOrder) setSelectedOrder(refreshedOrder);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchOrders();
    };

    const handleQuickConfirm = async (orderId) => {
        if (window.confirm('Are you sure you want to confirm this order?')) {
            await updateStatus(orderId, {
                status: 'confirmed',
                shipping_status: 'confirmed'
            });
        }
    };

    const updateStatus = async (orderId, statusData) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statusData)
            });
            if (response.ok) {
                fetchOrders();
                if (selectedOrder?.id === orderId) {
                    const updatedOrder = await response.json();
                    setSelectedOrder(updatedOrder.order);
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDownloadInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${resolveName(item.product?.name || item.product_name)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.quantity * item.price}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order.order_number || order.id}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 50px; }
                        .logo { font-size: 24px; font-weight: bold; color: #198754; }
                        .invoice-details { margin-bottom: 30px; }
                        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        .table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
                        .footer { margin-top: 50px; text-align: center; color: #888; font-size: 12px; }
                        .total-row { font-size: 18px; font-weight: bold; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <div class="logo">JADON AGRICULTURE</div>
                        <div>
                            <h2 style="margin: 0; color: #198754;">INVOICE</h2>
                            <p style="margin: 5px 0;">Order #: ${order.order_number || order.id}</p>
                            <p style="margin: 5px 0;">Date: ${new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="row" style="display: flex; gap: 50px; margin-bottom: 40px;">
                        <div style="flex: 1;">
                            <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Billed To:</h4>
                            <p style="margin: 5px 0;"><strong>${order.user?.name}</strong></p>
                            <p style="margin: 5px 0;">${order.user?.email}</p>
                            <p style="margin: 5px 0;">${order.phone}</p>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Shipping Address:</h4>
                            <p style="margin: 5px 0;">${order.shipping_address?.address || order.shipping_address}</p>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Item</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="text-align: right; padding: 20px 10px; font-weight: bold;">Grand Total:</td>
                                <td style="text-align: right; padding: 20px 10px; font-weight: bold; font-size: 20px; color: #198754;">₹${order.total_amount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="footer">
                        <p>Thank you for choosing Jadon Agriculture! Your business is appreciated.</p>
                        <p>This is a computer generated invoice.</p>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-warning text-dark',
            'confirmed': 'bg-primary',
            'shipped': 'bg-info text-white',
            'delivered': 'bg-success',
            'cancelled': 'bg-danger',
            'returned': 'bg-dark'
        };
        return `badge ${badges[status] || 'bg-secondary'}`;
    };

    return (
        <AdminLayout>
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                        <h4 className="fw-bold mb-0 text-center text-sm-start">Order Management</h4>
                        <div className="text-muted smaller text-center text-sm-end">Total Orders: {pagination.total}</div>
                    </div>

                    {/* Filter Bar */}
                    <div className="row g-2 g-md-3 mb-4">
                        <div className="col-12 col-lg-4">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Order #, Name, Email..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                    <button className="btn btn-primary px-3" type="submit">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">Order Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <select
                                className="form-select"
                                value={filters.shipping_status}
                                onChange={(e) => setFilters({ ...filters, shipping_status: e.target.value })}
                            >
                                <option value="">Shipping Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <select
                                className="form-select"
                                value={filters.sort_by}
                                onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
                            >
                                <option value="created_at">Sort By: Date</option>
                                <option value="total_amount">Sort By: Amount</option>
                                <option value="order_number">Sort By: Order #</option>
                            </select>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <select
                                className="form-select"
                                value={filters.per_page}
                                onChange={(e) => setFilters({ ...filters, per_page: e.target.value })}
                            >
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Shipping</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : orders.length > 0 ? orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="fw-bold">#{order.order_number || order.id}</td>
                                        <td>
                                            <div className="fw-bold">{order.user?.name}</div>
                                            <div className="smaller text-muted">{order.phone}</div>
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>₹{order.total_amount}</td>
                                        <td><span className={getStatusBadge(order.status)}>{order.status}</span></td>
                                        <td><span className={getStatusBadge(order.shipping_status)}>{order.shipping_status}</span></td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#orderModal"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    Details
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleQuickConfirm(order.id)}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="7" className="text-center py-4">No orders found</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}>
                                        Previous
                                    </button>
                                </li>
                                {[...Array(pagination.last_page)].map((_, i) => (
                                    <li key={i + 1} className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPagination({ ...pagination, current_page: i + 1 })}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <div className="modal fade" id="orderModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header border-bottom py-3">
                            <h5 className="modal-title fw-bold">Order Details #{selectedOrder?.id}</h5>
                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedOrder && (
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <h6 className="fw-bold text-muted text-uppercase smaller mb-3">Customer Info</h6>
                                        <p className="mb-1 fw-bold">{selectedOrder.user?.name}</p>
                                        <p className="mb-1">{selectedOrder.user?.email}</p>
                                        <p className="mb-1">{selectedOrder.phone}</p>
                                        <div className="mt-3 p-3 bg-light rounded">
                                            <h6 className="fw-bold smaller mb-2">Shipping Address</h6>
                                            <p className="mb-0 smaller">{selectedOrder.shipping_address?.address || selectedOrder.shipping_address}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4 text-md-end">
                                        <h6 className="fw-bold text-muted text-uppercase smaller mb-3">Update Status</h6>

                                        <div className="mb-3">
                                            <label className="smaller text-muted d-block mb-1">Order Status</label>
                                            <select
                                                className="form-select form-select-sm d-inline-block w-auto"
                                                value={selectedOrder.status}
                                                onChange={(e) => updateStatus(selectedOrder.id, { status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="smaller text-muted d-block mb-1">Shipping Status</label>
                                            <select
                                                className="form-select form-select-sm d-inline-block w-auto"
                                                value={selectedOrder.shipping_status}
                                                onChange={(e) => updateStatus(selectedOrder.id, { shipping_status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="packed">Packed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="returned">Returned</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="smaller text-muted d-block mb-1">Payment</label>
                                            <select
                                                className="form-select form-select-sm d-inline-block w-auto"
                                                value={selectedOrder.payment_status}
                                                onChange={(e) => updateStatus(selectedOrder.id, { payment_status: e.target.value })}
                                            >
                                                <option value="unpaid">Unpaid</option>
                                                <option value="paid">Paid</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </div>

                                        {(selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled') && (
                                            <div className="mt-3 text-start bg-light p-3 rounded">
                                                <h6 className="fw-bold smaller mb-2">Tracking Info</h6>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm mb-2"
                                                        placeholder="Courier Name"
                                                        defaultValue={selectedOrder.courier_name}
                                                        onBlur={(e) => updateStatus(selectedOrder.id, { courier_name: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Tracking Number"
                                                        defaultValue={selectedOrder.tracking_number}
                                                        onBlur={(e) => updateStatus(selectedOrder.id, { tracking_number: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'completed') && (
                                            <div className="mt-3 text-start bg-light p-3 rounded">
                                                <label className="smaller fw-bold d-block mb-1">Est. Delivery Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control form-control-sm"
                                                    defaultValue={selectedOrder.estimated_delivery_date ? selectedOrder.estimated_delivery_date.split('T')[0] : ''}
                                                    onChange={(e) => updateStatus(selectedOrder.id, { estimated_delivery_date: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12 mt-2">
                                        <h6 className="fw-bold text-muted text-uppercase smaller mb-3">Items</h6>
                                        <div className="table-responsive">
                                            <table className="table table-sm border">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Product</th>
                                                        <th className="text-center">Qty</th>
                                                        <th className="text-end">Price</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                     {selectedOrder.items?.map(item => (
                                                        <tr key={item.id}>
                                                            <td>{resolveName(item.product?.name || item.product_name)}</td>
                                                            <td className="text-center">{item.quantity}</td>
                                                            <td className="text-end">₹{item.price}</td>
                                                            <td className="text-end fw-bold">₹{item.quantity * item.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="3" className="text-end fw-bold border-0">Grand Total</td>
                                                        <td className="text-end fw-bold fs-5 text-primary border-0">₹{selectedOrder.total_amount}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-0">
                            <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDownloadInvoice(selectedOrder)}
                            >
                                <i className="fa-solid fa-file-pdf me-2"></i>
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
