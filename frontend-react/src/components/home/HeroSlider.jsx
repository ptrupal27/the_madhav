import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSlider = () => {
    const { t } = useTranslation();
    return (
        <Carousel id="heroSlider" fade indicators={true} controls={true} interval={5000}>
            <Carousel.Item>
                <div
                    className="slider-image-box"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')" }}
                ></div>
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center h-100 ">
                    <h1 className="display-2 fw-800 animate__animated animate__fadeInDown">{t('slider.title1')}</h1>
                    <p className="lead animate__animated animate__fadeInUp fs-4 mb-4">{t('slider.desc1')}</p>
                    <a href="#bestselling" onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('bestselling');
                        if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }} className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold animate__animated animate__zoomIn text-white text-decoration-none">
                        {t('slider.btn1')} <i className="fa-solid fa-circle-arrow-right ms-2"></i>
                    </a>
                </div>
            </Carousel.Item>

            <Carousel.Item>
                <div
                    className="slider-image-box"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop')" }}
                ></div>
                <div className="carousel-caption d-flex flex-column align-items-center justify-content-center h-100">
                    <h1 className="display-2 fw-800">{t('slider.title2')}</h1>
                    <p className="lead fs-4 mb-4">{t('slider.desc2')}</p>

                    <a href="#featured" onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('featured');
                        if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }} className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold text-white text-decoration-none">
                        {t('slider.btn2')} <i className="fa-solid fa-gear ms-2"></i>
                    </a>
                </div>
            </Carousel.Item>
        </Carousel>
    );
};

export default HeroSlider;
