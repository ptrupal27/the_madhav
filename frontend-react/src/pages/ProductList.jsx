import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const ProductList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // In a real app, you would pass category to the API
                // const res = await api.getProducts(`?category=${category}`); 
                // For now, since backend might not support it, we just fetch all or mock
                const res = await api.getProducts(category ? `?category=${category}` : '');

                // Handle pagination (Laravel returns { data: [...] })
                const productData = res.data || res;

                // Assuming res is array of products
                setProducts(Array.isArray(productData) ? productData : []);
            } catch (err) {
                console.error("Failed to fetch products", err);
                // setProducts([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    return (
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

            <h2 className="text-center mb-5 text-capitalize">{category} Products</h2>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
            ) : (
                <div className="category-grid">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p className="text-center col-12">No products found in this category.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;
