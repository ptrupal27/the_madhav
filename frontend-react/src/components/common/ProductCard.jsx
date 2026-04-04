import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../services/api';

// Reusable Product Card Component
const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    if (!product) return null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleBuyNow = async (e) => {
        e.preventDefault();
        await addToCart(product, 1);
        navigate('/checkout');
    };

    const getProductName = (p) => {
        if (!p) return '';
        const name = p.name;
        if (typeof name === 'object' && name !== null) {
            const lang = i18n.language || localStorage.getItem('i18nextLng') || 'en';
            return name[lang] || name.en || Object.values(name)[0] || '';
        }
        return name || '';
    };

    return (
        <div className="product-big-card">
            <Link to={`/product/${product.id}`} className="product-img-box text-decoration-none">
                <img src={getImageUrl(product.img || product.image)} alt={getProductName(product)} />
                <div className="img-overlay">
                    <span className="btn-view-details">
                        <i className="fa-solid fa-eye"></i>
                    </span>
                </div>
            </Link>
            <div className="product-content">
                <Link to={`/product/${product.id}`} className="text-decoration-none w-100">
                    <h4 className="product-name">
                        {getProductName(product)}
                    </h4>
                </Link>
                <p className="product-price mb-3">{product.price?.toString().startsWith('₹') ? product.price : `₹${product.price}`}</p>
                <button className="cart-button mb-2" style={{ background: 'transparent', color: '#13985c', border: '2px solid #13985c' }} onClick={handleAddToCart}>
                    <i className="fa-solid fa-cart-shopping me-2 add-to-cart-icon"></i> {t('add_to_cart')}
                </button>
                <button className="cart-button mt-1" onClick={handleBuyNow}>
                    <i className="fa-solid fa-bolt me-2"></i> {t('buy_now')}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
