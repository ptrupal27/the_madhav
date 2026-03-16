import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_URL } from '../services/api';

const TrackOrder = () => {
    const navigate = useNavigate();
    const [orderNumber, setOrderNumber] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const response = await fetch(`${API_URL}/track-order/${orderNumber}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Order not found');
            }
            const data = await response.json();
            setOrderData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(status.toLowerCase());
        return currentIndex === -1 ? 0 : currentIndex;
    };

    return (
        <Layout>
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

                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-4 p-md-5">
                                <h2 className="text-center fw-bold mb-4">Track Your Order</h2>
                                <form onSubmit={handleTrack} className="mb-5">
                                    <div className="row g-2 justify-content-center">
                                        <div className="col-md-8">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg border-2 shadow-sm"
                                                placeholder="Enter Order Number (e.g. ORD-12345)"
                                                value={orderNumber}
                                                onChange={(e) => setOrderNumber(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <button
                                                type="submit"
                                                className="btn btn-success btn-lg w-100 shadow-sm fw-bold"
                                                disabled={loading}
                                            >
                                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-location-dot me-2"></i>}
                                                Track
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {error && (
                                    <div className="alert alert-danger text-center animate__animated animate__shakeX">
                                        <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
                                    </div>
                                )}

                                {orderData && (
                                    <div className="animate__animated animate__fadeIn">
                                        {/* Progress Bar */}
                                        <div className="order-progress mb-5 position-relative">
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{ width: `${(getStatusStep(orderData.shipping_status || orderData.status) / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between position-absolute w-100" style={{ top: '-14px' }}>
                                                {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((label, idx) => {
                                                    const step = getStatusStep(orderData.shipping_status || orderData.status);
                                                    return (
                                                        <div key={label} className="text-center" style={{ width: '60px' }}>
                                                            <div className={`rounded-circle shadow-sm mx-auto mb-2 d-flex align-items-center justify-content-center ${idx <= step ? 'bg-success text-white' : 'bg-white border text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                                {idx <= step ? <i className="fa-solid fa-check"></i> : idx + 1}
                                                            </div>
                                                            <span className={`smaller fw-bold ${idx <= step ? 'text-success' : 'text-muted'}`} style={{ fontSize: '10px' }}>{label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="row g-4 mt-5">
                                            <div className="col-md-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <h6 className="fw-bold mb-3 text-muted">Order Details</h6>
                                                    <p className="mb-1"><strong>Order #:</strong> {orderData.order_number}</p>
                                                    <p className="mb-1"><strong>Date:</strong> {new Date(orderData.created_at).toLocaleDateString()}</p>
                                                    <p className="mb-0"><strong>Total:</strong> ₹{orderData.total_amount}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <h6 className="fw-bold mb-3 text-muted">Shipping Info</h6>
                                                    <p className="mb-1"><strong>Status:</strong> <span className="badge bg-success">{orderData.shipping_status || orderData.status}</span></p>
                                                    {orderData.tracking_number && (
                                                        <>
                                                            <p className="mb-1"><strong>Tracking #:</strong> {orderData.tracking_number}</p>
                                                            <p className="mb-1"><strong>Courier:</strong> {orderData.courier_name}</p>
                                                        </>
                                                    )}
                                                    {orderData.estimated_delivery_date && (
                                                        <p className="mb-0"><strong>Estimated Delivery:</strong> {new Date(orderData.estimated_delivery_date).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 border rounded overflow-hidden">
                                            <div className="bg-light p-3 border-bottom">
                                                <h6 className="mb-0 fw-bold">Items Ordered</h6>
                                            </div>
                                            <div className="p-0">
                                                <table className="table table-sm mb-0">
                                                    <tbody>
                                                        {orderData.items.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="px-3 py-2">{item.product_name} x {item.quantity}</td>
                                                                <td className="text-end px-3 py-2">₹{item.price * item.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .smaller { font-size: 0.85rem; }
                .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            `}</style>
        </Layout>
    );
};

export default TrackOrder;
