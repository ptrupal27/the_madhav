import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const resolveName = (name) => {
    if (!name) return '';
    if (typeof name === 'object' && name !== null) {
        const lang = localStorage.getItem('i18nextLng') || 'en';
        return name[lang] || name.en || Object.values(name)[0] || '';
    }
    return String(name);
};

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        payment_method: 'online' // 'online' or 'cod'
    });

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            let price = 0;
            if (typeof item.price === 'number') {
                price = item.price;
            } else if (typeof item.price === 'string') {
                price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            } else if (item.price && item.price.toString) {
                price = parseFloat(item.price.toString().replace(/[^\d.]/g, '')) || 0;
            }
            return total + (price * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                shipping_address: formData.address + ', ' + formData.city + ', ' + formData.state + ' - ' + formData.pincode,
                payment_method: formData.payment_method,
                phone: formData.phone,
                full_name: formData.full_name,
                email: formData.email,
                cart_items: cartItems.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    name: resolveName(item.name),
                    price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')),
                    quantity: item.quantity,
                    img: item.img || item.image
                }))
            };

            const response = await api.placeOrder(orderData);

            if (formData.payment_method === 'online' && response.cashfree_order) {
                const cashfree = window.Cashfree({
                    mode: "production" // User specified production keys
                });

                let checkoutOptions = {
                    paymentSessionId: response.cashfree_order.payment_session_id,
                    redirectTarget: "_modal",
                };

                cashfree.checkout(checkoutOptions).then(async (result) => {
                    if (result.error) {
                        alert('Payment failed: ' + result.error.message);
                        setLoading(false);
                    }
                    if (result.redirect) {
                        console.log("Payment redirecting...");
                    }
                    if (result.paymentDetails) {
                        try {
                            setLoading(true);
                            await api.verifyPayment({
                                order_id: response.order.order_number
                            });
                            alert('Payment Successful & Order Confirmed!');
                            clearCart();
                            navigate('/user/dashboard');
                        } catch (err) {
                            alert('Payment verification failed: ' + (err.message || 'Unknown error'));
                        } finally {
                            setLoading(false);
                        }
                    }
                });
            } else if (formData.payment_method === 'cod') {
                alert('Order placed successfully (Cash on Delivery)');
                clearCart();
                navigate('/user/dashboard');
            } else {
                alert('Order placed successfully');
                clearCart();
                navigate('/user/dashboard');
            }
        } catch (error) {
            alert('Failed to place order: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="checkout-page py-5 bg-light">
            <div className="container">
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

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 mb-4">
                            <h2 className="fw-800 mb-4">Shipping Information</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="full_name" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" id="email" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" id="phone" required onChange={handleChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Full Address</label>
                                        <textarea className="form-control" id="address" rows="3" required onChange={handleChange}></textarea>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">City</label>
                                        <input type="text" className="form-control" id="city" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">State</label>
                                        <input type="text" className="form-control" id="state" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Pincode</label>
                                        <input type="text" className="form-control" id="pincode" required onChange={handleChange} />
                                    </div>
                                </div>

                                <h3 className="fw-800 mt-5 mb-3">Payment Method</h3>
                                <div className="payment-options">
                                    <div className="form-check p-3 border rounded mb-2">
                                        <input className="form-check-input" type="radio" name="payment_method" id="online" checked={formData.payment_method === 'online'} onChange={() => setFormData({ ...formData, payment_method: 'online' })} />
                                        <label className="form-check-label ms-2 fw-bold" htmlFor="online">
                                            Online Payment (UPI/Card/NetBanking)
                                        </label>
                                    </div>
                                    <div className="form-check p-3 border rounded disabled">
                                        <input className="form-check-input" type="radio" name="payment_method" id="cod" checked={formData.payment_method === 'cod'} onChange={() => setFormData({ ...formData, payment_method: 'cod' })} />
                                        <label className="form-check-label ms-2 fw-bold" htmlFor="cod">
                                            Cash on Delivery (COD)
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success btn-lg w-100 mt-5 py-3 fw-bold rounded-pill" disabled={loading}>
                                    {loading ? 'Processing Order...' : `Proceed to Pay ₹${calculateTotal().toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                            <h3 className="fw-800 mb-4 pb-2 border-bottom">Order Summary</h3>
                            {cartItems.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.img} alt={resolveName(item.name)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                                        <div className="ms-3">
                                            <div className="fw-bold smaller text-truncate" style={{ maxWidth: '150px' }}>{resolveName(item.name)}</div>
                                            <div className="text-muted smaller">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="fw-bold">
                                        {typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}
                                    </div>
                                </div>
                            ))}
                            <div className="border-top pt-3 mt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span className="fw-bold">₹{calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2 text-success fw-bold">
                                    <span>Delivery</span>
                                    <span>FREE</span>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <span className="fs-4 fw-800">Total</span>
                                    <span className="fs-4 fw-800 text-success">₹{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
