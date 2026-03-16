import React, { useEffect, useRef, useState } from 'react';
import SaleProductCard from './SaleProductCard';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY_SALE = 'home_sale_products';

const DEFAULT_SALE_PRODUCTS_FALLBACK = [
    { id: 's1', name: 'Hybrid Seeds', price: '149', oldPrice: '298', img: 'https://images.unsplash.com/photo-1622383529357-3747c352f741?w=300&h=200&fit=crop' },
    { id: 's2', name: 'Organic Urea', price: '300', oldPrice: '600', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&h=200&fit=crop' },
    { id: 's3', name: 'Tool Set', price: '600', oldPrice: '1200', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300&h=200&fit=crop' },
    { id: 's4', name: 'Neem Oil', price: '175', oldPrice: '350', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&h=200&fit=crop' },
    { id: 's5', name: 'pH Meter', price: '250', oldPrice: '500', img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop' },
    { id: 's6', name: 'Fruit Saplings', price: '75', oldPrice: '150', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&h=200&fit=crop' },
    { id: 's7', name: 'Drip Kit', price: '1250', oldPrice: '2500', img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=300&h=200&fit=crop' },
    { id: 's8', name: 'Bio Compost', price: '200', oldPrice: '400', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=200&fit=crop' },
];

const loadSaleProducts = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SALE);
        if (saved) return JSON.parse(saved);
        // First load: persist defaults so ProductDetail can look them up by ID
        localStorage.setItem(STORAGE_KEY_SALE, JSON.stringify(DEFAULT_SALE_PRODUCTS_FALLBACK));
        return DEFAULT_SALE_PRODUCTS_FALLBACK;
    } catch { return DEFAULT_SALE_PRODUCTS_FALLBACK; }
};

const SaleSection = ({ products: passedProducts }) => {
    const trackRef = useRef(null);
    const { t, i18n } = useTranslation();
    const [saleProducts, setSaleProducts] = useState(passedProducts || []);

    useEffect(() => {
        if (passedProducts && passedProducts.length > 0) {
            setSaleProducts(passedProducts);
        } else {
            const saved = localStorage.getItem(STORAGE_KEY_SALE);
            if (saved) {
                try {
                    setSaleProducts(JSON.parse(saved));
                } catch (e) {
                    setSaleProducts(DEFAULT_SALE_PRODUCTS_FALLBACK);
                }
            } else {
                setSaleProducts(DEFAULT_SALE_PRODUCTS_FALLBACK);
            }
        }
    }, [passedProducts, i18n.language]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let position = 0;
        const scrollSpeed = 0.7;
        let animationFrameId;

        const startScrolling = () => {
            position -= scrollSpeed;
            if (Math.abs(position) >= track.scrollWidth / 2) {
                position = 0;
            }
            track.style.transform = `translateX(${position}px)`;
            animationFrameId = requestAnimationFrame(startScrolling);
        };

        startScrolling();
        return () => cancelAnimationFrame(animationFrameId);
    }, [saleProducts]);

    return (
        <>
            <div className="sale-header">
                <h2>{t('features.sale_title')}</h2>
                <p>{t('features.sale_desc')}</p>
            </div>

            <div className="carousel-container">
                <div className="scroll-track" id="scrollTrack" ref={trackRef}>
                    {[...saleProducts, ...saleProducts].map((product, index) => (
                        <SaleProductCard key={`${product.id}-${index}`} product={product} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SaleSection;
