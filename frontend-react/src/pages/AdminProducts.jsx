import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { API_URL, getImageUrl } from '../services/api';
import { toast } from 'sonner';

// ─── Default Home Page Products (fallback) ───────────────────────────────────
const DEFAULT_FEATURED_PRODUCTS = [
    { id: 'h9', section: 'featured', name: 'Wheat Seeds', price: '499', img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400', isNew: true },
    { id: 'h10', section: 'featured', name: 'Organic Manure', price: '850', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=400' },
    { id: 'h11', section: 'featured', name: 'Garden Trowel', price: '220', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400' },
    { id: 'h12', section: 'featured', name: 'Bio Pesticide', price: '560', img: 'https://images.unsplash.com/photo-1591461159338-795646f8885b?q=80&w=400' },
    { id: 'h13', section: 'featured', name: 'Drip Kit', price: '1200', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400' },
    { id: 'h14', section: 'featured', name: 'Sprayer', price: '990', img: 'https://images.unsplash.com/photo-1505305976870-c0be14102eaf?q=80&w=400' },
    { id: 'h15', section: 'featured', name: 'Soil Booster', price: '1450', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500' },
    { id: 'h16', section: 'featured', name: 'Tool Set', price: '1999', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500' },
];

const DEFAULT_NEW_ARRIVALS = [
    { id: 'h17', section: 'arrivals', name: 'Aloe Vera Plant', price: '299', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500', isNew: true },
    { id: 'h18', section: 'arrivals', name: 'Water Pump', price: '8500', img: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=500' },
    { id: 'h19', section: 'arrivals', name: 'Drip Pipe', price: '1200', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500' },
    { id: 'h20', section: 'arrivals', name: 'Cow Feed', price: '1800', img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500' },
];

const DEFAULT_SALE_PRODUCTS = [
    { id: 's1', section: 'sale', name: 'Hybrid Seeds', price: '149', oldPrice: '298', img: 'https://images.unsplash.com/photo-1622383529357-3747c352f741?w=300&h=200&fit=crop' },
    { id: 's2', section: 'sale', name: 'Organic Urea', price: '300', oldPrice: '600', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&h=200&fit=crop' },
    { id: 's3', section: 'sale', name: 'Tool Set', price: '600', oldPrice: '1200', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300&h=200&fit=crop' },
    { id: 's4', section: 'sale', name: 'Neem Oil', price: '175', oldPrice: '350', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&h=200&fit=crop' },
    { id: 's5', section: 'sale', name: 'pH Meter', price: '250', oldPrice: '500', img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop' },
    { id: 's6', section: 'sale', name: 'Fruit Saplings', price: '75', oldPrice: '150', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&h=200&fit=crop' },
    { id: 's7', section: 'sale', name: 'Drip Kit', price: '1250', oldPrice: '2500', img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=300&h=200&fit=crop' },
    { id: 's8', section: 'sale', name: 'Bio Compost', price: '200', oldPrice: '400', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=200&fit=crop' },
];

const DEFAULT_BEST_SELLING = [
    { id: 'b1', section: 'best_selling', name: 'Premium Wheat Seeds', price: '550', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400' },
    { id: 'b2', section: 'best_selling', name: 'Organic Fertilizer', price: '900', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=400' },
    { id: 'b3', section: 'best_selling', name: 'Smart Irrigation Controller', price: '2500', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400' },
    { id: 'b4', section: 'best_selling', name: 'High-Yield Corn Seeds', price: '700', img: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=400' },
];

const STORAGE_KEY_FEATURED = 'home_featured_products';
const STORAGE_KEY_ARRIVALS = 'home_arrivals_products';
const STORAGE_KEY_SALE = 'home_sale_products';
const STORAGE_KEY_BESTSELLING = 'home_bestselling_products';



const saveHomeProducts = async (key, data) => {
    try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL}/admin/settings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ [key]: data })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Server error while saving');
        }

        return true;
    } catch (error) {
        console.error('Error saving to DB:', error);
        toast.error('Could not save to database: ' + error.message);
        return false;
    }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProducts = () => {
    // ── DB Products state ────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        category_id: '',
        name: { en: '', hi: '', gu: '' },
        description: { en: '', hi: '', gu: '' },
        price: '',
        discount_price: '',
        stock: '',
        sku: '',
        is_active: true,
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);

    // ── Home Products state ──────────────────────────────────────────────────
    const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS);
    const [arrivalsProducts, setArrivalsProducts] = useState(DEFAULT_NEW_ARRIVALS);
    const [saleProducts, setSaleProducts] = useState(DEFAULT_SALE_PRODUCTS);
    const [bestSellingProducts, setBestSellingProducts] = useState(DEFAULT_BEST_SELLING);

    // Home Edit Modal state
    const [showHomeModal, setShowHomeModal] = useState(false);
    const [editingHomeItem, setEditingHomeItem] = useState(null);
    const [homeFormData, setHomeFormData] = useState({
        name: '',
        description: { en: '', hi: '', gu: '' },
        price: '',
        oldPrice: '',
        img: '',
        isNew: false,
        section: 'featured'
    });
    const [homeImageFile, setHomeImageFile] = useState(null);
    const [homeImageUploading, setHomeImageUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchHomeSettings();
    }, []);

    const fetchHomeSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const settings = await response.json();

            if (settings[STORAGE_KEY_FEATURED]) {
                const data = typeof settings[STORAGE_KEY_FEATURED] === 'string'
                    ? JSON.parse(settings[STORAGE_KEY_FEATURED])
                    : settings[STORAGE_KEY_FEATURED];
                setFeaturedProducts(data);
            }
            if (settings[STORAGE_KEY_ARRIVALS]) {
                const data = typeof settings[STORAGE_KEY_ARRIVALS] === 'string'
                    ? JSON.parse(settings[STORAGE_KEY_ARRIVALS])
                    : settings[STORAGE_KEY_ARRIVALS];
                setArrivalsProducts(data);
            }
            if (settings[STORAGE_KEY_SALE]) {
                const data = typeof settings[STORAGE_KEY_SALE] === 'string'
                    ? JSON.parse(settings[STORAGE_KEY_SALE])
                    : settings[STORAGE_KEY_SALE];
                setSaleProducts(data);
            }
            if (settings[STORAGE_KEY_BESTSELLING]) {
                const data = typeof settings[STORAGE_KEY_BESTSELLING] === 'string'
                    ? JSON.parse(settings[STORAGE_KEY_BESTSELLING])
                    : settings[STORAGE_KEY_BESTSELLING];
                setBestSellingProducts(data);
            }
        } catch (error) {
            console.error('Error fetching home settings:', error);
        }
    };

    // ── DB Products methods ──────────────────────────────────────────────────
    const fetchProducts = async (search = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const url = search ? `${API_URL}/admin/products?search=${search}` : `${API_URL}/admin/products`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            console.log('Fetched Products List:', data.data); // Debug log
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        fetchProducts(e.target.value);
    };

    const resetForm = () => {
        setFormData({
            category_id: '',
            name: { en: '', hi: '', gu: '' },
            description: { en: '', hi: '', gu: '' },
            price: '',
            discount_price: '',
            stock: '',
            sku: '',
            is_active: true,
            image_url: ''
        });
        setImageFile(null);
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            category_id: product.category_id ?? '',
            name: product.name ?? { en: '', hi: '', gu: '' },
            description: product.description ?? { en: '', hi: '', gu: '' },
            price: product.price ?? '',
            discount_price: product.discount_price ?? '',
            stock: product.stock ?? '',
            sku: product.sku ?? '',
            is_active: !!product.is_active,
            image_url: ''
        });
        setShowModal(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const form = new FormData();

        form.append('category_id', formData.category_id);
        form.append('name[en]', formData.name.en);
        form.append('name[hi]', formData.name.hi);
        form.append('name[gu]', formData.name.gu);
        form.append('description[en]', formData.description.en || '');
        form.append('description[hi]', formData.description.hi || '');
        form.append('description[gu]', formData.description.gu || '');
        form.append('price', formData.price);
        if (formData.discount_price) form.append('discount_price', formData.discount_price);
        form.append('stock', formData.stock);
        form.append('sku', formData.sku);
        form.append('is_active', formData.is_active ? '1' : '0');

        if (imageFile) { 
            // Final check on size
            if (imageFile.size > 2 * 1024 * 1024) {
                toast.error('Selected image is too large (max 2MB). Please choose a smaller file.');
                return;
            }
            form.append('image', imageFile); 
        } else if (formData.image_url) {
            form.append('image_url', formData.image_url);
        }

        try {
            const url = editingProduct
                ? `${API_URL}/admin/products/${editingProduct.id}`
                : `${API_URL}/admin/products`;

            console.log('Submitting Product Form:', {
                url,
                method: 'POST',
                fields: {
                    category_id: formData.category_id,
                    name_en: formData.name.en,
                    price: formData.price,
                    has_image: !!imageFile
                }
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: form
            });

            if (response.ok) {
                setShowModal(false);
                resetForm();
                fetchProducts();
                toast.success(editingProduct ? 'Product updated!' : 'Product added!');
            } else {
                const err = await response.json();
                console.error('Save product error details:', err);
                toast.error(err.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error saving product catch block:', error);
            toast.error('Error: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) { 
                setProducts(products.filter(p => p.id !== id)); 
                toast.success('Product deleted successfully');
            } else {
                const err = await response.json();
                console.error('Delete product error:', err);
                toast.error(err.message || 'Could not delete product');
            }
        } catch (error) {
            console.error('Error deleting product catch block:', error);
            toast.error('Delete Error: ' + error.message);
        }
    };

    // ── Home Products methods ────────────────────────────────────────────────
    const getHomeList = (section) => {
        if (section === 'featured') return featuredProducts;
        if (section === 'arrivals') return arrivalsProducts;
        if (section === 'best_selling') return bestSellingProducts;
        return saleProducts;
    };

    const setHomeList = (section, data) => {
        if (section === 'featured') { setFeaturedProducts(data); saveHomeProducts(STORAGE_KEY_FEATURED, data); }
        else if (section === 'arrivals') { setArrivalsProducts(data); saveHomeProducts(STORAGE_KEY_ARRIVALS, data); }
        else if (section === 'best_selling') { setBestSellingProducts(data); saveHomeProducts(STORAGE_KEY_BESTSELLING, data); }
        else { setSaleProducts(data); saveHomeProducts(STORAGE_KEY_SALE, data); }
    };

    const openHomeEdit = (item) => {
        setEditingHomeItem(item);
        setHomeFormData({
            name: (typeof item.name === 'object' && item.name !== null) ? (item.name.en || Object.values(item.name)[0] || '') : (item.name || ''),
            description: item.description || { en: '', hi: '', gu: '' },
            price: item.price || '',
            oldPrice: item.oldPrice || '',
            img: item.img || '',
            isNew: item.isNew || false,
            section: item.section
        });
        setHomeImageFile(null);
        setShowHomeModal(true);
    };

    const openHomeAdd = (section) => {
        setEditingHomeItem(null);
        setHomeFormData({
            name: '',
            description: { en: '', hi: '', gu: '' },
            price: '',
            oldPrice: '',
            img: '',
            isNew: false,
            section: section
        });
        setHomeImageFile(null);
        setShowHomeModal(true);
    };

    // Convert uploaded file to base64 and set as img
    const handleHomeImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Validate size (max 2MB for localStorage)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB for home products.');
            e.target.value = '';
            return;
        }
        setHomeImageFile(file);
        setHomeImageUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setHomeFormData(prev => ({ ...prev, img: reader.result }));
            setHomeImageUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleHomeSubmit = async (e) => {
        e.preventDefault();
        const section = homeFormData.section;
        const currentList = getHomeList(section);

        let finalFormData = { ...homeFormData };

        let updated;
        if (editingHomeItem) {
            updated = currentList.map(p =>
                p.id === editingHomeItem.id
                    ? { ...p, ...finalFormData }
                    : p
            );
        } else {
            const newItem = {
                ...finalFormData,
                id: 'h' + Date.now(),
            };
            updated = [...currentList, newItem];
        }

        const success = await saveHomeProducts(section === 'featured' ? STORAGE_KEY_FEATURED : section === 'arrivals' ? STORAGE_KEY_ARRIVALS : section === 'best_selling' ? STORAGE_KEY_BESTSELLING : STORAGE_KEY_SALE, updated);

        if (success) {
            setHomeListLocally(section, updated);
            setShowHomeModal(false);
            setEditingHomeItem(null);
            setHomeImageFile(null);
            toast.success('Home section updated successfully!');
        }
    };

    const setHomeListLocally = (section, data) => {
        if (section === 'featured') setFeaturedProducts(data);
        else if (section === 'arrivals') setArrivalsProducts(data);
        else if (section === 'best_selling') setBestSellingProducts(data);
        else setSaleProducts(data);
    };

    const handleHomeDelete = (item) => {
        const displayName = (typeof item.name === 'object' && item.name !== null) ? (item.name.en || Object.values(item.name)[0]) : item.name;
        if (!window.confirm(`Remove "${displayName}" from this section?`)) return;
        const list = getHomeList(item.section);
        const updated = list.filter(p => p.id !== item.id);
        setHomeList(item.section, updated);
    };

    const resetHomeProducts = (section) => {
        const sectionName = section === 'featured' ? 'Featured' : section === 'arrivals' ? 'New Arrivals' : section === 'best_selling' ? 'Best Selling' : 'Sale';
        if (!window.confirm(`Reset all ${sectionName} products to defaults?`)) return;

        if (section === 'featured') { setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS); saveHomeProducts(STORAGE_KEY_FEATURED, DEFAULT_FEATURED_PRODUCTS); }
        else if (section === 'arrivals') { setArrivalsProducts(DEFAULT_NEW_ARRIVALS); saveHomeProducts(STORAGE_KEY_ARRIVALS, DEFAULT_NEW_ARRIVALS); }
        else if (section === 'best_selling') { setBestSellingProducts(DEFAULT_BEST_SELLING); saveHomeProducts(STORAGE_KEY_BESTSELLING, DEFAULT_BEST_SELLING); }
        else { setSaleProducts(DEFAULT_SALE_PRODUCTS); saveHomeProducts(STORAGE_KEY_SALE, DEFAULT_SALE_PRODUCTS); }
    };

    // ── Home Products Table Sub-Component ───────────────────────────────────
    const HomeProductTable = ({ title, icon, color, items, section }) => (
        <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                    <span className={`badge bg-${color} p-2 rounded-circle shadow-sm`}>
                        <i className={`fa-solid ${icon} fw-bold`}></i>
                    </span>
                    <h5 className="fw-bold mb-0">{title}</h5>
                    <span className="text-muted smaller ms-auto ms-md-0">{items.length} products</span>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-success shadow-sm px-3 flex-grow-1 flex-md-grow-0"
                        onClick={() => openHomeAdd(section)}
                    >
                        <i className="fa-solid fa-plus me-1"></i> Add
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary shadow-sm flex-grow-1 flex-md-grow-0"
                        onClick={() => resetHomeProducts(section)}
                        title="Reset to defaults"
                    >
                        <i className="fa-solid fa-rotate-left me-1"></i> Reset
                    </button>
                </div>
            </div>
            <div className="table-responsive rounded-3 border">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="py-2 px-3">Image</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Price</th>
                            {section === 'sale' && <th className="py-2">Old Price</th>}
                            <th className="py-2">Tag</th>
                            <th className="py-2 text-end px-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td className="px-3">
                                    <img
                                        src={getImageUrl(item.img)}
                                        alt={(typeof item.name === 'object' && item.name !== null) ? (item.name.en || Object.values(item.name)[0]) : item.name}
                                        className="rounded-2 border"
                                        width="50" height="50"
                                        style={{ objectFit: 'cover' }}
                                        onError={e => { e.target.src = 'https://placehold.co/50x50?text=?'; }}
                                    />
                                </td>
                                <td><div className="fw-semibold">{(typeof item.name === 'object' && item.name !== null) ? (item.name.en || Object.values(item.name)[0]) : item.name}</div></td>
                                <td><span className="text-success fw-bold">{item.price}</span></td>
                                {section === 'sale' && (
                                    <td><span className="text-muted text-decoration-line-through">₹{item.oldPrice}</span></td>
                                )}
                                <td>
                                    {item.isNew && <span className="badge bg-warning text-dark">New</span>}
                                    {section === 'sale' && <span className="badge bg-danger">Sale</span>}
                                    {section === 'featured' && !item.isNew && <span className="badge bg-success bg-opacity-10 text-success">Featured</span>}
                                    {section === 'arrivals' && !item.isNew && <span className="badge bg-info bg-opacity-10 text-info">Arrival</span>}
                                </td>
                                <td className="text-end px-3">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            className="btn btn-sm btn-light border shadow-sm"
                                            onClick={() => openHomeEdit(item)}
                                            title="Edit Product"
                                        >
                                            <i className="fa-solid fa-pencil text-primary"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light border shadow-sm"
                                            onClick={() => handleHomeDelete(item)}
                                            title="Delete Product"
                                        >
                                            <i className="fa-solid fa-trash text-danger"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            {/* ── DB Products Section ─────────────────────────────────── */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <h4 className="fw-bold mb-0 text-center text-md-start">Product Management</h4>
                        <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm w-100 w-md-auto" onClick={() => { resetForm(); setShowModal(true); }}>
                            <i className="fa-solid fa-plus me-2"></i> Add New Product
                        </button>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                                <span className="input-group-text bg-white border-0">
                                    <i className="fa-solid fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none ps-0"
                                    placeholder="Search by name or SKU..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle border-top">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-4">Image</th>
                                    <th className="py-3">Details</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3 text-center">Stock</th>
                                    <th className="py-3 text-center">Status</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="spinner-border text-success"></div>
                                        </td>
                                    </tr>
                                ) : products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4">
                                                <div className="rounded-3 shadow-sm border p-1 bg-white overflow-hidden" style={{ width: '60px', height: '60px' }}>
                                                    <img
                                                        src={getImageUrl(product.image)}
                                                        alt={product.name?.en || 'product'}
                                                        className="w-100 h-100"
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            console.warn(`Product image failed to load: ${product.image}`);
                                                            e.target.src = 'https://placehold.co/60x60?text=Error';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold fs-6">{product.name?.en}</div>
                                                <div className="smaller text-muted">SKU: <span className="fw-medium text-dark">{product.sku}</span></div>
                                                <div className="smaller text-muted d-md-none">{product.category?.name?.en}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-success bg-opacity-10 text-success fw-medium">
                                                    {product.category?.name?.en || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-bold">₹{product.price}</div>
                                                {product.discount_price && (
                                                    <div className="smaller text-danger text-decoration-line-through opacity-75">₹{product.discount_price}</div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className={`fw-bold ${product.stock < 10 ? 'text-danger' : 'text-dark'}`}>{product.stock}</div>
                                                <div className="smaller text-muted">units</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-sm btn-light border shadow-sm" onClick={() => handleEdit(product)}>
                                                        <i className="fa-solid fa-pencil text-primary"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-light border shadow-sm" onClick={() => handleDelete(product.id)}>
                                                        <i className="fa-solid fa-trash text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            <i className="fa-solid fa-box-open fa-3x mb-3 opacity-25"></i>
                                            <p className="mb-0">No products found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Home Page Products Section ──────────────────────────── */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-3 p-md-4">
                    {/* Section Header */}
                    <div className="mb-4">
                        <h4 className="fw-bold mb-2">
                            <i className="fa-solid fa-house-chimney me-2 text-warning"></i>
                            Home Page Products
                        </h4>
                        <p className="text-muted mb-0 small lh-sm">
                            Edit products appearing on the Home page outside of category sections.
                        </p>
                    </div>

                    <div className="alert alert-info border-0 d-flex align-items-start gap-2 py-3 mb-4" style={{ background: 'rgba(13,110,253,0.07)', borderRadius: '12px' }}>
                        <i className="fa-solid fa-circle-info text-primary mt-1"></i>
                        <span className="small">Changes here update the <strong>Featured</strong>, <strong>Arrivals</strong>, and <strong>Sale</strong> sections live for all visitors.</span>
                    </div>

                    <hr />

                    {/* Best Selling Products Table */}
                    <HomeProductTable
                        title="Best Selling Products"
                        icon="fa-trophy"
                        color="primary"
                        items={bestSellingProducts}
                        section="best_selling"
                    />

                    {/* Featured Products Table */}
                    <HomeProductTable
                        title="Featured Products"
                        icon="fa-star"
                        color="success"
                        items={featuredProducts}
                        section="featured"
                    />

                    {/* New Arrivals Table */}
                    <HomeProductTable
                        title="New Arrivals"
                        icon="fa-bolt"
                        color="info"
                        items={arrivalsProducts}
                        section="arrivals"
                    />

                    {/* Sale Products Table */}
                    <HomeProductTable
                        title="Sale Products"
                        icon="fa-tag"
                        color="danger"
                        items={saleProducts}
                        section="sale"
                    />
                </div>
            </div>

            {/* ── DB Product Add/Edit Modal ────────────────────────────── */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-bottom p-4">
                                <h5 className="modal-title fw-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Category</label>
                                            <select
                                                className="form-select shadow-none"
                                                required
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name.en}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Product Name</label>
                                            <div className="card border p-3 bg-light">
                                                <div className="row g-3">
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">English</label>
                                                        <input type="text" className="form-control shadow-none" required value={formData.name.en}
                                                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">Hindi (हिंदी)</label>
                                                        <input type="text" className="form-control shadow-none" value={formData.name.hi}
                                                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, hi: e.target.value } })} />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">Gujarati (ગુજરાતી)</label>
                                                        <input type="text" className="form-control shadow-none" value={formData.name.gu}
                                                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, gu: e.target.value } })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-bold">Price (₹)</label>
                                            <input type="number" className="form-control shadow-none" required value={formData.price ?? ''}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold">Discount Price (₹)</label>
                                            <input type="number" className="form-control shadow-none" value={formData.discount_price ?? ''}
                                                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold">Stock</label>
                                            <input type="number" className="form-control shadow-none" required value={formData.stock ?? ''}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Product Description</label>
                                            <div className="card border p-3 bg-light">
                                                <div className="row g-3">
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">English</label>
                                                        <textarea className="form-control shadow-none" rows="3" value={formData.description.en}
                                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}></textarea>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">Hindi (हिंदी)</label>
                                                        <textarea className="form-control shadow-none" rows="3" value={formData.description.hi}
                                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, hi: e.target.value } })}></textarea>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="smaller text-muted">Gujarati (ગુજરાતી)</label>
                                                        <textarea className="form-control shadow-none" rows="3" value={formData.description.gu}
                                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, gu: e.target.value } })}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">SKU</label>
                                            <input type="text" className="form-control shadow-none" value={formData.sku ?? ''}
                                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <hr className="flex-grow-1 m-0" />
                                                <span className="text-muted small px-2">Upload Image OR Paste URL</span>
                                                <hr className="flex-grow-1 m-0" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">
                                                <i className="fa-solid fa-upload me-2 text-primary"></i>Upload Image File
                                            </label>
                                            <input type="file" className="form-control shadow-none"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setImageFile(e.target.files[0]);
                                                    setFormData({ ...formData, image_url: '' });
                                                }} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">
                                                <i className="fa-solid fa-link me-2 text-secondary"></i>Image URL
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="https://example.com/image.jpg"
                                                value={formData.image_url}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, image_url: e.target.value });
                                                    setImageFile(null);
                                                }}
                                                disabled={!!imageFile}
                                            />
                                        </div>
                                        
                                        {(imageFile || formData.image_url || editingProduct?.image) && (
                                            <div className="col-12 mt-3">
                                                <div className="p-2 border rounded bg-light d-flex align-items-center gap-3">
                                                    <img 
                                                        src={imageFile ? URL.createObjectURL(imageFile) : (formData.image_url || getImageUrl(editingProduct?.image))} 
                                                        alt="preview" 
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                        onError={e => { e.target.src = 'https://placehold.co/60x60?text=?'; }}
                                                    />
                                                    <div className="smaller text-muted">
                                                        {imageFile ? (
                                                            <span>New file: <strong>{imageFile.name}</strong></span>
                                                        ) : formData.image_url ? (
                                                            <span>Using URL</span>
                                                        ) : (
                                                            <span>Current image</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                                                <label className="form-check-label fw-bold">Active for Sale</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-5 fw-bold shadow-sm">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Home Product Edit Modal ──────────────────────────────── */}
            {showHomeModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-bottom p-4">
                                <div>
                                    <h5 className="modal-title fw-bold mb-0">
                                        {editingHomeItem ? 'Edit Home Product' : 'Add New Home Product'}
                                    </h5>
                                    <span className="small text-muted">
                                        Section: <strong>{homeFormData.section === 'featured' ? 'Featured Products' : homeFormData.section === 'arrivals' ? 'New Arrivals' : homeFormData.section === 'best_selling' ? 'Best Selling Products' : 'Sale Products'}</strong>
                                    </span>
                                </div>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowHomeModal(false)}></button>
                            </div>
                            <form onSubmit={handleHomeSubmit}>
                                <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                    <div className="row g-3">

                                        {/* ── Image Preview ── */}
                                        <div className="col-12">
                                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: '#f8f9fa', border: '1px dashed #dee2e6' }}>
                                                <div style={{ flexShrink: 0 }}>
                                                    {homeImageUploading ? (
                                                        <div style={{ width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <div className="spinner-border spinner-border-sm text-success"></div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={homeFormData.img || 'https://placehold.co/90x90?text=No+Image'}
                                                            alt="preview"
                                                            className="rounded-3 border shadow-sm"
                                                            style={{ width: 90, height: 90, objectFit: 'cover' }}
                                                            onError={e => { e.target.src = 'https://placehold.co/90x90?text=?'; }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold small mb-1">Product Image</div>
                                                    <p className="text-muted small mb-0">
                                                        {homeImageFile ? (
                                                            <><i className="fa-solid fa-check-circle text-success me-1"></i>{homeImageFile.name} ({(homeImageFile.size / 1024).toFixed(0)} KB)</>
                                                        ) : 'No file chosen'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Upload File ── */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">
                                                <i className="fa-solid fa-upload me-2 text-primary"></i>Upload Image File
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleHomeImageUpload}
                                            />
                                            <div className="form-text">JPG, PNG, WEBP — max 2MB. Uploaded image is saved locally.</div>
                                        </div>

                                        {/* ── OR divider ── */}
                                        <div className="col-12">
                                            <div className="d-flex align-items-center gap-2">
                                                <hr className="flex-grow-1 m-0" />
                                                <span className="text-muted small px-2">OR paste URL</span>
                                                <hr className="flex-grow-1 m-0" />
                                            </div>
                                        </div>

                                        {/* ── Image URL ── */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">
                                                <i className="fa-solid fa-link me-2 text-secondary"></i>Image URL
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="https://example.com/image.jpg"
                                                value={homeImageFile ? '' : homeFormData.img}
                                                disabled={!!homeImageFile}
                                                onChange={e => {
                                                    setHomeImageFile(null);
                                                    setHomeFormData({ ...homeFormData, img: e.target.value });
                                                }}
                                            />
                                            {homeImageFile && (
                                                <div className="form-text text-warning">
                                                    <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                                    Uploaded file is active. <button type="button" className="btn btn-link btn-sm p-0 text-danger" onClick={() => { setHomeImageFile(null); setHomeFormData(prev => ({ ...prev, img: editingHomeItem?.img || '' })); }}>Clear upload</button> to use URL instead.
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Name ── */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Product Name</label>
                                            <input
                                                type="text"
                                                className="form-control shadow-none"
                                                required
                                                value={homeFormData.name}
                                                onChange={e => setHomeFormData({ ...homeFormData, name: e.target.value })}
                                            />
                                        </div>

                                        {/* ── Description ── */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Product Description</label>
                                            <div className="card border p-3 bg-light">
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <label className="smaller text-muted">English</label>
                                                        <textarea
                                                            className="form-control shadow-none"
                                                            rows="2"
                                                            value={homeFormData.description?.en || ''}
                                                            onChange={(e) => setHomeFormData({ ...homeFormData, description: { ...homeFormData.description, en: e.target.value } })}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="smaller text-muted">Hindi (हिंदी)</label>
                                                        <textarea
                                                            className="form-control shadow-none"
                                                            rows="2"
                                                            value={homeFormData.description?.hi || ''}
                                                            onChange={(e) => setHomeFormData({ ...homeFormData, description: { ...homeFormData.description, hi: e.target.value } })}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="smaller text-muted">Gujarati (ગુજરાતી)</label>
                                                        <textarea
                                                            className="form-control shadow-none"
                                                            rows="2"
                                                            value={homeFormData.description?.gu || ''}
                                                            onChange={(e) => setHomeFormData({ ...homeFormData, description: { ...homeFormData.description, gu: e.target.value } })}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Price / Old Price ── */}
                                        <div className={`col-${homeFormData.section === 'sale' ? '6' : '12'}`}>
                                            <label className="form-label fw-bold">Price (₹)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={homeFormData.price}
                                                onChange={e => setHomeFormData({ ...homeFormData, price: e.target.value })}
                                            />
                                        </div>

                                        {homeFormData.section === 'sale' && (
                                            <div className="col-6">
                                                <label className="form-label fw-bold">Old Price (₹) <span className="text-muted fw-normal">(before discount)</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={homeFormData.oldPrice}
                                                    onChange={e => setHomeFormData({ ...homeFormData, oldPrice: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {/* ── New Badge ── */}
                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="homeIsNew"
                                                    checked={homeFormData.isNew}
                                                    onChange={e => setHomeFormData({ ...homeFormData, isNew: e.target.checked })}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="homeIsNew">Mark as "New" Badge</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowHomeModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-warning px-5 fw-bold shadow-sm">
                                        <i className="fa-solid fa-floppy-disk me-2"></i>
                                        {editingHomeItem ? 'Save Changes' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
