import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
// Category માટે data mapping
const categoryData = {
    'agriculture': {
        title: 'Agriculture',
        icon: 'fa-leaf',
        products: []
    },
    'fruitplant': {
        title: '🌱 Fruit Plants',
        icon: 'fa-apple-whole',
        products: [
            { name: 'Mango Plant', desc: 'Healthy mango fruit plant', price: '₹499', img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop' },
            { name: 'Apple Plant', desc: 'Fresh apple fruit plant', price: '₹699', img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&auto=format&fit=crop' },
            { name: 'Banana Plant', desc: 'Fast growing banana plant', price: '₹399', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop' },
            { name: 'Guava Plant', desc: 'Organic guava fruit plant', price: '₹459', img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&auto=format&fit=crop' },
            { name: 'Papaya Plant', desc: 'High yield papaya plant', price: '₹349', img: 'https://images.unsplash.com/photo-1574226516831-e1dff420e42e?w=400&auto=format&fit=crop' },
            { name: 'Lemon Plant', desc: 'Evergreen lemon plant', price: '₹299', img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop' },
            { name: 'Orange Plant', desc: 'Juicy orange fruit plant', price: '₹549', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop' },
            { name: 'Strawberry Plant', desc: 'Sweet strawberry plant', price: '₹259', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop' },
            { name: 'Pomegranate Plant', desc: 'Healthy anar plant', price: '₹599', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop' },
            { name: 'Cherry Plant', desc: 'Premium cherry plant', price: '₹799', img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&h=300&fit=crop' },
        ]
    },
    'vegetable': {
        title: '🥕 Vegetable Plants',
        icon: 'fa-carrot',
        products: [
            { name: 'Tomato Plant', desc: 'Hybrid tomato plant', price: '₹149', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop' },
            { name: 'Chilli Plant', desc: 'Hot green chilli plant', price: '₹99', img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&auto=format&fit=crop' },
            { name: 'Brinjal Plant', desc: 'Fresh brinjal plant', price: '₹129', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop' },
            { name: 'Cucumber Plant', desc: 'Organic cucumber plant', price: '₹119', img: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&auto=format&fit=crop' },
            { name: 'Capsicum Plant', desc: 'Bell pepper plant', price: '₹159', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop' },
            { name: 'Spinach Plant', desc: 'Green leafy spinach', price: '₹89', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop' },
            { name: 'Cabbage Plant', desc: 'Fresh cabbage plant', price: '₹139', img: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&auto=format&fit=crop' },
            { name: 'Cauliflower Plant', desc: 'White cauliflower plant', price: '₹149', img: 'https://images.unsplash.com/photo-1568584711271-81c0c7c7e0b0?w=400&auto=format&fit=crop' },
        ]
    },
    'indoreplant': {
        title: '🏠 Indoor Plants',
        icon: 'fa-house-chimney',
        products: [
            { name: 'Money Plant', desc: 'Lucky money plant', price: '₹199', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&auto=format&fit=crop' },
            { name: 'Snake Plant', desc: 'Air purifying snake plant', price: '₹249', img: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400&auto=format&fit=crop' },
            { name: 'Aloe Vera', desc: 'Medicinal aloe vera', price: '₹179', img: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&auto=format&fit=crop' },
            { name: 'Peace Lily', desc: 'Beautiful peace lily', price: '₹299', img: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&auto=format&fit=crop' },
            { name: 'Spider Plant', desc: 'Easy care spider plant', price: '₹149', img: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&auto=format&fit=crop' },
            { name: 'Jade Plant', desc: 'Lucky jade plant', price: '₹229', img: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&auto=format&fit=crop' },
        ]
    },
    'outdoorplant': {
        title: '🌳 Outdoor Plants',
        icon: 'fa-tree',
        products: [
            { name: 'Hibiscus Plant', desc: 'Colorful hibiscus', price: '₹199', img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&auto=format&fit=crop' },
            { name: 'Bougainvillea', desc: 'Vibrant bougainvillea', price: '₹349', img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&auto=format&fit=crop' },
            { name: 'Jasmine Plant', desc: 'Fragrant jasmine', price: '₹249', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop' },
            { name: 'Tulsi Plant', desc: 'Holy basil plant', price: '₹99', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&auto=format&fit=crop' },
            { name: 'Neem Plant', desc: 'Medicinal neem tree', price: '₹399', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop' },
            { name: 'Curry Leaf Plant', desc: 'Fresh curry leaves', price: '₹149', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&auto=format&fit=crop' },
        ]
    },
    'roseplant': {
        title: '🌹 Rose Plants',
        icon: 'fa-rose',
        products: [
            { name: 'Red Rose', desc: 'Classic red rose', price: '₹299', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
            { name: 'White Rose', desc: 'Pure white rose', price: '₹299', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop' },
            { name: 'Pink Rose', desc: 'Beautiful pink rose', price: '₹299', img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&auto=format&fit=crop' },
            { name: 'Yellow Rose', desc: 'Bright yellow rose', price: '₹299', img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&auto=format&fit=crop' },
            { name: 'Orange Rose', desc: 'Vibrant orange rose', price: '₹349', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
            { name: 'Mixed Rose', desc: 'Assorted rose colors', price: '₹399', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop' },
        ]
    },
    'lilyplant': {
        title: '🌺 Lily Plants',
        icon: 'fa-spa',
        products: [
            { name: 'Peace Lily', desc: 'White peace lily', price: '₹349', img: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&auto=format&fit=crop' },
            { name: 'Calla Lily', desc: 'Elegant calla lily', price: '₹399', img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&auto=format&fit=crop' },
            { name: 'Water Lily', desc: 'Beautiful water lily', price: '₹449', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop' },
            { name: 'Tiger Lily', desc: 'Spotted tiger lily', price: '₹379', img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&auto=format&fit=crop' },
            { name: 'Day Lily', desc: 'Colorful day lily', price: '₹299', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
        ]
    },
    'chilliplant': {
        title: '🌶️ Chilli Plants',
        icon: 'fa-pepper-hot',
        products: [
            { name: 'Green Chilli', desc: 'Spicy green chilli', price: '₹99', img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&auto=format&fit=crop' },
            { name: 'Red Chilli', desc: 'Hot red chilli', price: '₹129', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop' },
            { name: 'Bhut Jolokia', desc: 'Ghost pepper plant', price: '₹249', img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&auto=format&fit=crop' },
            { name: 'Kashmiri Chilli', desc: 'Mild kashmiri chilli', price: '₹149', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop' },
            { name: 'Thai Chilli', desc: 'Extra hot thai chilli', price: '₹179', img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&auto=format&fit=crop' },
        ]
    },
    'bananaplant': {
        title: '🍌 Banana Plants',
        icon: 'fa-lemon',
        products: [
            { name: 'Dwarf Banana', desc: 'Compact banana plant', price: '₹399', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop' },
            { name: 'Grand Nain', desc: 'Commercial banana variety', price: '₹449', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop' },
            { name: 'Red Banana', desc: 'Sweet red banana', price: '₹499', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop' },
            { name: 'Robusta Banana', desc: 'High yield variety', price: '₹379', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop' },
        ]
    }
};

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    const [categoryDetails, setCategoryDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCategoryInfo = async () => {
            if (category && category !== 'all') {
                try {
                    const data = await api.getCategory(category);
                    setCategoryDetails(data);
                } catch (e) {
                    console.log('Category details fallback');
                }
            }
        };
        fetchCategoryInfo();
    }, [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const searchParamsArr = new URLSearchParams();
                if (category) searchParamsArr.append('category', category);
                if (searchQuery) searchParamsArr.append('search', searchQuery);

                const response = await api.getProducts(`?${searchParamsArr.toString()}`);
                setProducts(response.data || []);
            } catch (error) {
                console.log('Using fallback data');
                let allProducts = [];

                if (category === 'all' || !categoryData[category]) {
                    // Combine all products for 'all' or unknown category
                    Object.values(categoryData).forEach(cat => {
                        if (cat.products) allProducts = [...allProducts, ...cat.products];
                    });
                } else {
                    allProducts = categoryData[category].products || [];
                }

                // Apply search filter on fallback data
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const lang = localStorage.getItem('i18nextLng') || 'en';

                    allProducts = allProducts.filter(p => {
                        const productName = (p.name && typeof p.name === 'object' && p.name !== null)
                            ? (p.name[lang] || p.name.en || '')
                            : (p.name || '');
                        const productDesc = (p.desc && typeof p.desc === 'object' && p.desc !== null)
                            ? (p.desc[lang] || p.desc.en || '')
                            : (p.desc || '');

                        return productName.toLowerCase().includes(query) ||
                            productDesc.toLowerCase().includes(query);
                    });
                }

                setProducts(allProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, searchQuery]);

    const handleAddToCart = async (product) => {
        const result = await addToCart(product, 1);
        if (result.success) {
            alert(result.message);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    let title = categoryData[category]?.title || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Products');
    let icon = categoryData[category]?.icon || 'fa-leaf';

    if (categoryDetails) {
        const lang = localStorage.getItem('i18nextLng') || 'en';
        const localizedName = (typeof categoryDetails.name === 'object' && categoryDetails.name !== null)
            ? (categoryDetails.name[lang] || categoryDetails.name.en)
            : categoryDetails.name;

        if (localizedName) {
            title = localizedName;
        }
    }

    if (searchQuery) {
        title = t('search_results', { query: searchQuery });
        icon = 'fa-magnifying-glass';
    } else if (category === 'all') {
        title = t('all_products');
        icon = 'fa-layer-group';
    }

    return (
        <div className="container py-5">
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

            <h2 className="text-center mb-4 text-success">
                <i className={`fa-solid ${icon} me-2`}></i>
                {title}
            </h2>

            <div className="category-grid">
                {products.length > 0 ? products.map((product, index) => {
                    // Extract localized name and description
                    const lang = localStorage.getItem('i18nextLng') || 'en';
                    const productName = (product.name && typeof product.name === 'object' && product.name !== null)
                        ? (product.name[lang] || product.name.en || Object.values(product.name)[0])
                        : (product.name || '');
                    const productDesc = (product.description && typeof product.description === 'object' && product.description !== null)
                        ? (product.description[lang] || product.description.en || Object.values(product.description)[0])
                        : (product.desc || product.description || '');
                    const productImage = getImageUrl(product.image || product.img);
                    const productPrice = typeof product.price === 'number' ? `₹${product.price}` : product.price;

                    return (
                        <div key={index} className="product-big-card animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Link to={`/product/${product.id}`} className="product-img-box text-decoration-none">
                                <img src={productImage} alt={productName} loading="lazy" />
                                <div className="img-overlay">
                                    <span className="btn-view-details">
                                        <i className="fa-solid fa-eye"></i>
                                    </span>
                                </div>
                            </Link>
                            <div className="product-content">
                                <div className="w-100">
                                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                                        <h5 className="product-name">{productName}</h5>
                                    </Link>
                                    <p className="text-muted small mb-3 text-truncate-2" style={{ height: '40px', overflow: 'hidden' }}>{productDesc}</p>
                                </div>
                                <div className="d-flex flex-column w-100 mt-auto">
                                    <p className="product-price mb-2 fs-5">{productPrice}</p>
                                    <div className="d-flex gap-2 w-100">
                                        <button
                                            className="cart-button flex-grow-1 px-2"
                                            style={{ background: 'transparent', color: '#13985c', border: '2px solid #13985c', whiteSpace: 'nowrap' }}
                                            onClick={() => handleAddToCart({ ...product, name: productName, price: productPrice, img: productImage })}
                                        >
                                            <i className="fa-solid fa-cart-shopping me-1"></i> Add
                                        </button>
                                        <button
                                            className="cart-button flex-grow-1 px-2"
                                            style={{ whiteSpace: 'nowrap' }}
                                            onClick={async () => {
                                                await handleAddToCart({ ...product, name: productName, price: productPrice, img: productImage });
                                                navigate('/checkout');
                                            }}
                                        >
                                            <i className="fa-solid fa-bolt me-1"></i> Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                        <div className="mb-4">
                            <i className="fa-solid fa-file-circle-exclamation fa-4x text-muted opacity-50"></i>
                        </div>
                        <h3 className="fw-bold text-dark">{t('no_results_found', 'No Results Found')}</h3>
                        <p className="text-muted mb-4">
                            We couldn't find any products matching "<strong>{searchQuery}</strong>".<br />
                            Try using different keywords or check your spelling.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <Link to="/products/all" className="btn btn-success px-4 rounded-pill">
                                View All Products
                            </Link>
                            <Link to="/" className="btn btn-outline-success px-4 rounded-pill">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
