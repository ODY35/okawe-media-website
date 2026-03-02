import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/images/logo.png';
// To use a local video:
// 1. Place your video in src/assets/videos/hero-bg.mp4
// 2. Uncomment the line below:
// import heroVideo from '../assets/videos/hero-bg.mp4';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <div id="home" className="hero">
      <div className="hero-video-container">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          {/* Example of using a local video: */}
          {/* <source src={heroVideo} type="video/mp4" /> */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-ink-swirls-2651-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="hero-content">
        <img src={logo} alt="OKAWE MEDIA" className="hero-logo" />
        <h1 className="big-title" style={{ background: 'var(--main-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('hero.title')}
        </h1>
        <p className="title-desc" style={{ color: 'var(--light-blue)' }}>{t('hero.subtitle')}</p>
        <div style={{ marginTop: '40px' }}>
          <a href="#services" className="btn" style={{ background: 'var(--main-gradient)', color: 'var(--white)', borderRadius: '5px' }}>Our Services</a>
          <a href="#contact" className="btn" style={{ border: '2px solid var(--violet)', color: 'var(--white)', marginLeft: '15px', borderRadius: '5px' }}>Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
