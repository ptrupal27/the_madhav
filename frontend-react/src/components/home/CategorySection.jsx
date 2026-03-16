import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api, { getImageUrl } from '../../services/api';

const CategorySection = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories...');
                const data = await api.getCategories();
                console.log('Categories data received:', data);
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const lang = localStorage.getItem('i18nextLng') || 'en';

    return (
        <section className="category-section py-5 bg-light">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">{t('shop_by')} <span className="text-success">{t('category_title')}</span></h2>
                </div>

                <div className="row g-4 justify-content-center">
                    {categories.length > 0 ? categories.map((cat, index) => {
                        const catName = typeof cat.name === 'object' ? (cat.name[lang] || cat.name.en || Object.values(cat.name)[0]) : cat.name;
                        return (
                            <div key={index} className="col-lg-3 col-md-6 col-6">
                                <Link to={`/products/${cat.slug}`} className="text-decoration-none">
                                    <div className="category-card">
                                        <img src={getImageUrl(cat.image)} alt={catName} />
                                        <h5>{catName}</h5>
                                    </div>
                                </Link>
                            </div>
                        );
                    }) : (
                        <div className="col-12 text-center text-muted">
                            <p>No categories found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
