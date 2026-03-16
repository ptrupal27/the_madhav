import React from 'react';
import { useTranslation } from 'react-i18next';

const BrandIntro = () => {
    const { t } = useTranslation();

    return (
        <section className="brand-intro">
            <div className="container">
                <div className="intro-content">
                    <h1>{t('features.brand_title')}</h1>
                    <p className="main-text">
                        {t('features.brand_desc_part1')} <strong>{t('features.brand_desc_part2')}</strong>, <strong>{t('features.brand_desc_part3')}</strong>,
                        <strong> {t('features.brand_desc_part4')}</strong>, {t('features.brand_desc_part5')} <strong>{t('features.brand_desc_part6')}</strong> {t('features.brand_desc_part7')} <strong>{t('features.brand_desc_part8')}</strong>, {t('features.brand_desc_part9')}
                    </p>

                    <div className="categories-highlight">
                        <span className="tag">{t('features.tag_crop_protection')}</span>
                        <span className="tag">{t('features.tag_organic_nutrition')}</span>
                        <span className="tag">{t('features.tag_agri_tools')}</span>
                        <span className="tag">{t('features.tag_hybrid_seeds')}</span>
                        <span className="tag">{t('features.tag_soil_wellness')}</span>
                    </div>

                    <p className="trust-points">
                        🌱 {t('features.trust_genuine')} | 🚚 {t('features.trust_delivery')} | 🧾 {t('features.trust_gst')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BrandIntro;
