import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';

const resolveName = (name) => {
    if (!name) return '';
    if (typeof name === 'object' && name !== null) {
        const lang = localStorage.getItem('i18nextLng') || 'en';
        return name[lang] || name.en || Object.values(name)[0] || '';
    }
    return String(name);
};

const Cart = () => {
    const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart, loading } = useCart();
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            let price = 0;
            if (typeof item.price === 'number') {
                price = item.price;
            } else if (typeof item.price === 'string') {
                price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            }
            return total + (price * item.quantity);
        }, 0);
    };

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to checkout');
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (loading && cartItems.length === 0) {
        return (
            <div className="cart-page-wrapper d-flex align-items-center justify-content-center bg-white">
                <div className="text-center">
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <h5 className="text-muted fw-bold">Refreshing your cart...</h5>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page-wrapper d-flex align-items-center justify-content-center bg-white">
                <div className="container text-center animate__animated animate__fadeIn">
                    <div className="empty-cart-lottie">
                        <i className="fa-solid fa-cart-arrow-down fa-shake"></i>
                    </div>
                    <h2 className="fw-800 display-5 mb-3">Your Basket is Empty</h2>
                    <p className="text-muted mb-5 fs-5 mx-auto" style={{ maxWidth: '500px' }}>
                        Looks like you haven't added any plants or seeds to your basket yet. Let's grow together!
                    </p>
                    <Link to="/" className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg">
                        Browse Products <i className="fa-solid fa-seedling ms-2"></i>
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = calculateSubtotal();
    const total = subtotal;

    return (
        <div className="cart-page-wrapper bg-light min-vh-100">
            <div className="container py-4">
                {/* Back to Home Navigation */}
                <div className="mb-4 text-start animate__animated animate__fadeInDown">
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-light border shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center text-decoration-none text-dark hover-success"
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        <i className="fa-solid fa-arrow-left me-2 text-success"></i> Back to Home
                    </button>
                </div>

                {/* Header Section */}
                <div className="row mb-5 align-items-center">
                    <div className="col-md-7 text-center text-md-start animate__animated animate__fadeInLeft">
                        <span className="cart-header-badge mb-2 d-inline-block">ORDER SUMMARY</span>
                        <h1 className="fw-800 display-4 mb-2">My Shopping <span className="text-success">Basket</span></h1>
                        <p className="text-muted fs-5">You have {cartCount} premium items waiting for you.</p>
                    </div>
                    <div className="col-md-5 text-center text-md-end animate__animated animate__fadeInRight">
                        <button onClick={clearCart} className="btn btn-outline-danger border-0 fw-bold me-3">
                            <i className="fa-solid fa-trash-can me-2"></i> Clear Cart
                        </button>
                        <Link to="/" className="btn btn-outline-success rounded-pill px-4 fw-bold">
                            <i className="fa-solid fa-plus me-2"></i> Continue Shopping
                        </Link>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <div className="cart-items-container animate__animated animate__fadeInUp">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item-card p-3 mb-4 border-0">
                                    <div className="row align-items-center g-3">
                                        {/* Product Image */}
                                        <div className="col-4 col-md-2">
                                            <div className="cart-item-img-container shadow-sm p-1 bg-white rounded-4 overflow-hidden">
                                                <Link to={`/product/${item.product_id || item.id}`}>
                                                    <img
                                                        src={getImageUrl(item.img || item.image)}
                                                        alt={resolveName(item.name)}
                                                        className="img-fluid rounded-3"
                                                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="col-8 col-md-4">
                                            <h5 className="fw-bold mb-1">
                                                <Link to={`/product/${item.product_id || item.id}`} className="text-decoration-none text-dark">
                                                    {resolveName(item.name)}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small mb-0">Premium Grade</p>
                                            {item.is_mock && <span className="badge bg-warning text-dark smaller">Demo Item</span>}
                                            <div className="d-md-none mt-2 fw-bold text-success fs-5">
                                                ₹{item.price?.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Unit Price (Desktop) */}
                                        <div className="col-md-2 d-none d-md-block text-center">
                                            <div className="text-muted small mb-1">Price</div>
                                            <div className="fw-bold fs-5">{item.price?.toLocaleString()}</div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div className="col-8 col-md-3">
                                            <div className="quantity-pill shadow-sm mx-auto justify-content-between p-1 bg-light rounded-pill d-flex align-items-center" style={{ width: '120px' }}>
                                                <button
                                                    className="btn btn-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '30px', height: '30px' }}
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    disabled={loading}
                                                >
                                                    <i className="fa-solid fa-minus fs-xs"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center border-0 bg-transparent fw-bold"
                                                    style={{ width: '40px', padding: '0' }}
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val > 0) {
                                                            updateQuantity(item.id, val);
                                                        }
                                                    }}
                                                    min="1"
                                                />
                                                <button
                                                    className="btn btn-white rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '30px', height: '30px' }}
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={loading}
                                                >
                                                    <i className="fa-solid fa-plus fs-xs"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-4 col-md-1 text-end">
                                            <button
                                                className="btn btn-light-danger rounded-4 p-2 shadow-sm border-0"
                                                style={{ width: '45px', height: '45px' }}
                                                onClick={() => removeFromCart(item.id)}
                                                disabled={loading}
                                            >
                                                <i className="fa-solid fa-trash-can text-danger"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="col-lg-4">
                        <div className="order-summary-card sticky-top animate__animated animate__fadeInRight" style={{ top: '100px', zIndex: 10 }}>
                            <h3 className="fw-800 mb-4 pb-2 border-bottom">Order Details</h3>

                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Cart Value</span>
                                <span className="fw-bold text-dark">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Shipping Fee</span>
                                <span className="text-success fw-bold">FREE</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4 pb-3 border-bottom text-muted">
                                <span>GST (Inclusive)</span>
                                <span className="text-dark fw-bold">₹0</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fs-5 fw-800">Grand Total</span>
                                <span className="fs-2 text-success fw-800">₹{total.toLocaleString()}</span>
                            </div>

                            <button
                                className="btn btn-success w-100 py-3 rounded-4 fw-bold shadow-lg transform-hover"
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                PROCEED TO CHECKOUT <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>

                            <div className="mt-4 text-center">
                                <div className="d-flex align-items-center justify-content-center text-muted small mb-3">
                                    <i className="fa-solid fa-shield-check me-2 text-success"></i>
                                    100% Safe and Secure Payment
                                </div>
                                <div className="d-flex gap-3 justify-content-center opacity-75 grayscale-hover">
                                    <i className="fa-brands fa-cc-visa fs-3"></i>
                                    <i className="fa-brands fa-cc-mastercard fs-3"></i>
                                    <i className="fa-brands fa-google-pay fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
