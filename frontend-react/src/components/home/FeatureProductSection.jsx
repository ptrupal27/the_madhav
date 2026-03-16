import React, { useState, useEffect } from 'react';
import ProductCard from '../common/ProductCard';

// Load from localStorage — if not saved yet, save defaults now so ProductDetail can find them
const loadFromStorage = (key, defaults) => {
    try {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
        // First load: persist defaults so ProductDetail can look them up by ID
        localStorage.setItem(key, JSON.stringify(defaults));
        return defaults;
    } catch { return defaults; }
};

const FeatureProductSection = ({ title, products: passedProducts, bgColorClass = "", subTitle = "Premium Quality", storageKey }) => {
    const [products, setProducts] = useState(passedProducts || []);

    useEffect(() => {
        if (passedProducts && passedProducts.length > 0) {
            setProducts(passedProducts);
        } else if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                try {
                    setProducts(JSON.parse(stored));
                } catch (e) {
                    console.error("Error parsing stored products", e);
                }
            }
        }
    }, [passedProducts, storageKey]);

    return (
        <section className={`section-1 ${bgColorClass}`}>
            <div className="container">
                <div className="section-header text-center mb-5">
                    <span className="sub-heading">{subTitle}</span>
                    <h2 className="section-head">{title}</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="cards-wrapper">
                    {products.map((product, index) => (
                        <ProductCard key={product.id || index} product={{
                            ...product,
                            img: product.image || product.img
                        }} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureProductSection;
