import React, { useEffect, useRef, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';
import SaleSection from '../components/home/SaleSection';
import BrandIntro from '../components/home/BrandIntro';
import FeatureProductSection from '../components/home/FeatureProductSection';
import { API_URL } from '../services/api';

import { useTranslation } from 'react-i18next';

const Home = () => {
  const taglineRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [homeSettings, setHomeSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const productsSection1 = [
    { id: 'h9', name: t('products.wheat_seeds_title'), description: t('products.wheat_seeds_desc'), price: '₹499', img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400', isNew: true },
    { id: 'h10', name: t('products.manure_title'), description: t('products.manure_desc'), price: '₹850', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=400' },
    { id: 'h11', name: t('products.trowel_title'), description: t('products.trowel_desc'), price: '₹220', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400' },
    { id: 'h12', name: t('products.bio_pesticide_title'), description: t('products.bio_pesticide_desc'), price: '₹560', img: 'https://images.unsplash.com/photo-1591461159338-795646f8885b?q=80&w=400' },
    { id: 'h13', name: t('products.drip_kit_title'), description: t('products.drip_kit_desc'), price: '₹1,200', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400' },
    { id: 'h14', name: t('products.sprayer_title'), description: t('products.sprayer_desc'), price: '₹990', img: 'https://images.unsplash.com/photo-1505305976870-c0be14102eaf?q=80&w=400' },
    { id: 'h15', name: t('products.soil_booster'), description: "", price: '₹1,450', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500' },
    { id: 'h16', name: t('products.tool_set'), description: "", price: '₹1,999', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500' }
  ];

  const productsSection2 = [
    { id: 'h17', name: t('products.aloe_vera'), description: t('products.aloe_vera_desc'), price: '₹299', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500', isNew: true },
    { id: 'h18', name: t('products.water_pump'), description: t('products.water_pump_desc'), price: '₹8,500', img: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=500' },
    { id: 'h19', name: t('products.drip_pipe'), description: t('products.drip_pipe_desc'), price: '₹1,200', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500' },
    { id: 'h20', name: t('products.cow_feed'), description: t('products.cow_feed_desc'), price: '₹1,800', img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500' }
  ];

  const productsSection3 = [
    { id: 'b1', section: 'best_selling', name: 'Premium Wheat Seeds', price: '550', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400' },
    { id: 'b2', section: 'best_selling', name: 'Organic Fertilizer', price: '900', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=400' },
    { id: 'b3', section: 'best_selling', name: 'Smart Irrigation Controller', price: '2500', img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=400' },
    { id: 'b4', section: 'best_selling', name: 'High-Yield Corn Seeds', price: '700', img: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=400' }
  ];

  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/home-settings`);
        const data = await response.json();
        setHomeSettings(data);
      } catch (error) {
        console.error('Error fetching home settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchHomeSettings();
  }, []);

  useEffect(() => {
    const el = taglineRef.current;
    if (!el) return;

    const texts = [
      t('home_tagline1'),
      t('home_tagline2'),
      t('home_tagline3')
    ];

    const TYPE_SPEED = 90;
    const HOLD_TIME = 2500;

    let textIndex = 0;
    let charIndex = 0;
    let timer;

    el.classList.add("cursor");

    function typeText() {
      const text = texts[textIndex];

      if (charIndex <= text.length) {
        el.textContent = text.slice(0, charIndex);
        charIndex++;
        timer = setTimeout(typeText, TYPE_SPEED);
      } else {
        timer = setTimeout(() => {
          el.style.opacity = "0";
          setTimeout(() => {
            textIndex = (textIndex + 1) % texts.length;
            charIndex = 0;
            el.textContent = "";
            el.style.opacity = "1";
            typeText();
          }, 600);
        }, HOLD_TIME);
      }
    }

    typeText();
    return () => clearTimeout(timer);
  }, [t, i18n.language]);

  return (
    <>
      <HeroSlider />
      <CategorySection key={`cat-${i18n.language}`} />
      <div id="bestselling" className="scroll-mt-5">
        <ProductSection key={`prod-${i18n.language}`} products={homeSettings?.home_bestselling_products} />
      </div>

      <section className="slider-headline-section">
        <div className="container">
          <div className="slider-wrapper">
            <h1 id="sliding-tagline" ref={taglineRef}>{t('default_tagline')}</h1>
          </div>
        </div>
      </section>
      <div id="featured" className="scroll-mt-5">
        <FeatureProductSection key={`feat-${i18n.language}`} title={t('features.featured_products')} subTitle={t('features.premium_quality')} products={homeSettings?.home_featured_products || productsSection1} storageKey="home_featured_products" />
      </div>



      <div className="my-5"></div>

      <FeatureProductSection key={`new-${i18n.language}`} title={t('features.new_arrivals')} subTitle={t('features.just_landed')} products={homeSettings?.home_arrivals_products || productsSection2} storageKey="home_arrivals_products" />

      <SaleSection products={homeSettings?.home_sale_products} />
      <BrandIntro />

      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="fa-solid fa-tags fa-3x text-success mb-3"></i>
                <h5>{t('features.lowest_prices')}</h5>
                <p className="text-muted">{t('features.lowest_prices_desc')}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="fa-solid fa-headset fa-3x text-success mb-3"></i>
                <h5>{t('features.available_24_7')}</h5>
                <p className="text-muted">{t('features.available_24_7_desc')}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="fa-solid fa-truck-fast fa-3x text-success mb-3"></i>
                <h5>{t('features.fast_delivery')}</h5>
                <p className="text-muted">{t('features.fast_delivery_desc')}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <i className="fa-solid fa-shield-halved fa-3x text-success mb-3"></i>
                <h5>{t('features.secure')}</h5>
                <p className="text-muted">{t('features.secure_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
