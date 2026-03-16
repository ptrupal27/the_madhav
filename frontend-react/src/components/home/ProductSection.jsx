import React, { useState, useEffect } from 'react';
import ProductCard from '../common/ProductCard';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../../services/api';

const ProductSection = ({ products: passedProducts }) => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState(passedProducts || []);
    const [loading, setLoading] = useState(!passedProducts);

    useEffect(() => {
        if (passedProducts && passedProducts.length > 0) {
            setProducts(passedProducts);
            setLoading(false);
        } else {
            loadProducts();
        }
    }, [passedProducts, i18n.language]);

    const loadProducts = async () => {
        try {
            const stored = localStorage.getItem('home_bestselling_products');
            if (stored) {
                setProducts(JSON.parse(stored));
                setLoading(false);
                return;
            }
            
            // Fallback to API if nothing in localStorage
            await fetchProductsFromAPI();
        } catch (error) {
            console.error('Error loading best selling products:', error);
            await fetchProductsFromAPI();
        }
    };

    const fetchProductsFromAPI = async () => {
        try {
            const response = await api.getProducts();
            const productData = response.data || response;
            const finalData = Array.isArray(productData) ? productData.slice(0, 8) : [];
            setProducts(finalData);
            
            // Initialize localStorage with API data if empty
            if (finalData.length > 0) {
                localStorage.setItem('home_bestselling_products', JSON.stringify(finalData));
            }
        } catch (error) {
            console.error('Error fetching best selling products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <section className="best-selling-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">{t('features.best_selling_part1')} <span className="text-success">{t('features.best_selling_part2')}</span></h2>
                    <p className="section-subtitle">{t('features.agricultural_essentials')}</p>
                </div>

                <div className="cards-wrapper">
                    {products.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
