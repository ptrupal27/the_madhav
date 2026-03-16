import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

import { useTranslation } from 'react-i18next';

const SaleProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { t } = useTranslation();

    const getProductName = (p) => {
        if (typeof p.name === 'object' && p.name !== null) {
            const lang = localStorage.getItem('i18nextLng') || 'en';
            return p.name[lang] || p.name.en || Object.values(p.name)[0] || '';
        }

        // Handle hardcoded sale products
        const idMapping = {
            's1': 'products.hybrid_seeds',
            's2': 'products.organic_urea',
            's3': 'products.tool_set',
            's4': 'products.neem_oil',
            's5': 'products.ph_meter',
            's6': 'products.fruit_saplings',
            's7': 'products.drip_kit_title',
            's8': 'products.bio_compost'
        };

        if (idMapping[p.id]) {
            return t(idMapping[p.id]);
        }

        return p.name || '';
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    return (
        <div className="product-big-card sale-card" style={{ width: '220px', flexShrink: 0 }}>
            <Link to={product.id ? `/product/${product.id}` : '#'} className="product-img-box text-decoration-none">
                <div className="discount-badge">50% OFF</div>
                <img src={getImageUrl(product.img || product.image)} alt={getProductName(product)} />
                <div className="img-overlay">
                    <span className="btn-view-details">
                        <i className="fa-solid fa-eye"></i>
                    </span>
                </div>
            </Link>
            <div className="product-content">
                <Link to={product.id ? `/product/${product.id}` : '#'} className="text-decoration-none w-100">
                    <h5 className="product-name">{getProductName(product)}</h5>
                </Link>
                <p className="product-price mb-3">
                    {product.price?.toString().startsWith('₹') ? product.price : `₹${product.price}`}
                    <span className="old-price text-muted text-decoration-line-through fs-6 ms-2">
                        {product.oldPrice?.toString().startsWith('₹') ? product.oldPrice : `₹${product.oldPrice}`}
                    </span>
                </p>
                <button className="cart-button" onClick={handleAddToCart}>
                    <i className="fa-solid fa-cart-shopping me-2"></i> {t('add_to_cart')}
                </button>
            </div>
        </div>
    );
};

export default SaleProductCard;
