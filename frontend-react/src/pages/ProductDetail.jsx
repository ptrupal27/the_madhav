import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl, API_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import FormattedDescription from '../components/common/FormattedDescription';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');

    // Mock Reviews State
    const [reviews, setReviews] = useState([
        { id: 1, user: "John Doe", rating: 5, comment: "Amazing product! highly recommended.", date: "2023-10-15" },
        { id: 2, user: "Jane Smith", rating: 4, comment: "Good quality but shipping was delayed.", date: "2023-10-20" },
    ]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', user: '' });

    // ── Helper: find home product ──────────────────────────────────────────
    const findHomeProduct = async (pid) => {
        try {
            // First try API
            const response = await fetch(`${API_URL}/home-settings`);
            const settings = await response.json();
            
            const keys = [
                'home_featured_products',
                'home_arrivals_products',
                'home_sale_products',
                'home_bestselling_products',
            ];

            const strippedPid = String(pid).toLowerCase().replace(/^[hsb]/i, '');

            for (const key of keys) {
                const items = settings[key];
                if (!items || !Array.isArray(items)) continue;

                const found = items.find(p => {
                    const sid = String(p.id).toLowerCase();
                    const strippedSid = sid.replace(/^[hsb]/i, '');
                    return sid === String(pid).toLowerCase() || strippedSid === strippedPid;
                });

                if (found) return { ...found, sourceKey: key };
            }
        } catch (err) {
            console.warn(`Error fetching home settings in ProductDetail:`, err);
        }

        // Fallback to localStorage
        const keys = [
            'home_featured_products',
            'home_arrivals_products',
            'home_sale_products',
            'home_bestselling_products',
        ];

        const strippedPid = String(pid).toLowerCase().replace(/^[hsb]/i, '');

        for (const key of keys) {
            try {
                const saved = localStorage.getItem(key);
                if (!saved) continue;
                const items = JSON.parse(saved);
                if (!Array.isArray(items)) continue;
                const found = items.find(p => {
                    const sid = String(p.id).toLowerCase();
                    const strippedSid = sid.replace(/^[hsb]/i, '');
                    return sid === String(pid).toLowerCase() || strippedSid === strippedPid;
                });
                if (found) return { ...found, sourceKey: key };
            } catch (err) {
                console.warn(`Error parsing home setting ${key}:`, err);
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const lang = localStorage.getItem('i18nextLng') || 'en';

                console.log('--- Loading Product Details ---');
                console.log('ID from URL:', id);

                const isExplicitMock = /^[hsb]/i.test(String(id));

                // 1. If explicit mock ID ('h' or 's' or 'b'), check Mock Collections FIRST
                if (isExplicitMock) {
                    console.log('Explicit Mock ID detected. Checking collections...');
                    const mockProd = await findHomeProduct(id);
                    if (mockProd) {
                        loadMockProduct(mockProd, lang);
                        return;
                    }
                }

                // 2. Try Database API for all IDs (fallback for mocks, primary for numeric)
                console.log('Fetching from DB API...');
                try {
                    const data = await api.getProduct(id);
                    if (data) {
                        console.log('Found in DB API:', data);
                        const prod = data;
                        const localizedName = typeof prod.name === 'object' && prod.name !== null
                            ? (prod.name[lang] || prod.name.en || Object.values(prod.name)[0])
                            : (prod.name || '');
                        const localizedDesc = typeof prod.description === 'object' && prod.description !== null
                            ? (prod.description[lang] || prod.description.en || Object.values(prod.description)[0])
                            : (prod.description || '');

                        setProduct({
                            ...prod,
                            name: localizedName,
                            description: localizedDesc,
                        });
                        const imgPath = prod.image || prod.img || '';
                        setMainImage(getImageUrl(imgPath));
                        setLoading(false);
                        return;
                    }
                } catch (apiErr) {
                    console.warn('API fetch failed or returned error:', apiErr);
                }

                // 3. Last Resort: Check Mock Collections if not already checked (fallback)
                if (!isExplicitMock) {
                    console.log('Not found in API. Checking mock collections as fallback...');
                    const mockProd = await findHomeProduct(id);
                    if (mockProd) {
                        loadMockProduct(mockProd, lang);
                        return;
                    }
                }

                console.error('Product totally not found (API & Mock):', id);
                setError('Product not found');

            } catch (err) {
                console.error("Critical error in fetchProduct:", err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        const loadMockProduct = (mockProd, lang) => {
            const resolvedName = (typeof mockProd.name === 'object' && mockProd.name !== null)
                ? (mockProd.name[lang] || mockProd.name.en || Object.values(mockProd.name)[0])
                : (mockProd.name || '');
            const resolvedDesc = (typeof mockProd.description === 'object' && mockProd.description !== null)
                ? (mockProd.description[lang] || mockProd.description.en || Object.values(mockProd.description)[0])
                : (mockProd.description || 'Premium quality agricultural product.');
            const imgPath = mockProd.img || mockProd.image || '';

            setProduct({
                ...mockProd,
                name: resolvedName,
                description: resolvedDesc,
                price: mockProd.price,
                image: imgPath,
                stock: mockProd.stock ?? 999,
                is_active: true,
            });
            setMainImage(imgPath);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);


    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    const handleBuyNow = async () => {
        if (product) {
            await addToCart(product, quantity);
            navigate('/checkout');
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReview.comment || !newReview.user) return;

        const review = {
            id: Date.now(),
            ...newReview,
            date: new Date().toISOString().split('T')[0]
        };

        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '', user: '' });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container py-5 text-center">
                <h2>Product not found</h2>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0 px-md-3 py-0 py-lg-5">
            {/* Back to Home Navigation */}
            <div className="mb-3 mb-lg-4 px-3 mt-3 mt-lg-0">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-light border shadow-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center text-decoration-none text-dark hover-success"
                    style={{ transition: 'all 0.3s ease' }}
                >
                    <i className="fa-solid fa-arrow-left me-2 text-success"></i> Back to Home
                </button>
            </div>

            <div className="row g-0 g-lg-5">
                {/* Product Images */}
                <div className="col-lg-6">
                    <div className="product-image-container mb-3 position-relative shadow-sm rounded-4 overflow-hidden bg-white">
                        <img
                            key={mainImage}
                            src={mainImage}
                            className="img-fluid product-main-img"
                            alt={product.name}
                            onError={(e) => {
                                console.error('Image failed to load:', mainImage);
                                e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                            }}
                        />
                    </div>
                    {/* Thumbnails if available (mocked for now as likely single image) */}
                    {product.images && product.images.length > 0 && (
                        <div className="d-flex gap-2 overflow-auto">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={getImageUrl(img)}
                                    alt={`Thumbnail ${idx}`}
                                    className={`img-thumbnail ${mainImage === getImageUrl(img) ? 'border-success' : ''}`}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => setMainImage(getImageUrl(img))}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="col-lg-6 px-3 px-md-0">
                    <h1 className="fw-bold mb-2">{(typeof product.name === 'object' && product.name !== null) ? (product.name.en || Object.values(product.name)[0]) : product.name}</h1>
                    <div className="mb-3 d-flex align-items-center gap-2">
                        <span className="badge bg-success">{product.category_id}</span>
                        <span className="text-muted"><i className="fa-solid fa-circle-check text-success me-1"></i>In Stock</span>
                    </div>

                    <h2 className="display-5 fw-bold text-success mb-3">₹{product.price}</h2>

                    <FormattedDescription
                        className="lead mb-4"
                        text={(typeof product.description === 'object' && product.description !== null) ? (product.description.en || Object.values(product.description)[0]) : product.description}
                    />

                    <div className="d-flex flex-column align-items-start gap-3 mb-4">
                        <div className="input-group shadow-sm" style={{ width: '100%', maxWidth: '160px' }}>
                            <button className="btn btn-outline-secondary border-end-0" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <i className="fa-solid fa-minus"></i>
                            </button>
                            <input
                                type="number"
                                className="form-control text-center fw-bold border-start-0 border-end-0 shadow-none px-2"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val > 0) {
                                        setQuantity(val);
                                    } else if (e.target.value === '') {
                                        setQuantity('');
                                    }
                                }}
                                onBlur={() => {
                                    if (quantity === '' || quantity < 1) {
                                        setQuantity(1);
                                    }
                                }}
                                min="1"
                            />
                            <button className="btn btn-outline-secondary border-start-0" type="button" onClick={() => setQuantity(Number(quantity) + 1)}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        <div className="d-grid gap-2 w-100 mt-2 mt-md-0" style={{ maxWidth: '300px' }}>
                            <button className="btn btn-outline-success px-3 shadow-sm py-2 d-flex align-items-center justify-content-center fw-bold" onClick={handleAddToCart}>
                                <i className="fa-solid fa-cart-shopping me-2"></i> Add to Cart
                            </button>
                            <button className="btn btn-success px-3 shadow-sm py-2 d-flex align-items-center justify-content-center fw-bold" onClick={handleBuyNow}>
                                <i className="fa-solid fa-bolt me-2"></i> Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Meta (e.g., SKU, Tags) could go here */}
            </div>

            {/* Review Section */}
            <div className="mt-5 px-3">
                <div className="col-12">
                    <h3 className="fw-bold border-bottom pb-3 mb-4">Customer Reviews</h3>

                    <div className="row g-4">
                        {/* Review Form */}
                        <div className="col-12 col-md-5 col-lg-4 order-2 order-md-1">
                            <div className="review-form-card card border-0 shadow-sm p-3 p-md-4 bg-white">
                                <h5 className="mb-3">Write a Review</h5>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Your Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newReview.user}
                                            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rating</label>
                                        <div className="d-flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className={`fa-star cursor-pointer ${star <= newReview.rating ? 'fa-solid text-warning' : 'fa-regular text-muted'}`}
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Your Review</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Submit Review</button>
                                </form>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="col-12 col-md-7 col-lg-8 order-1 order-md-2">
                            {reviews.length === 0 ? (
                                <p className="text-muted">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {reviews.map(review => (
                                        <div key={review.id} className="review-item-card card border-0 shadow-sm p-3">
                                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2 gap-2">
                                                <div>
                                                    <h6 className="fw-bold mb-0">{review.user}</h6>
                                                    <small className="text-muted">{review.date}</small>
                                                </div>
                                                <div className="text-warning">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`fa-star ${i < review.rating ? 'fa-solid' : 'fa-regular'}`}></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-0 text-muted">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
