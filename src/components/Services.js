import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Example of importing a local image:
// import logoImg from '../assets/images/logo-service.jpg';

const Services = () => {
  const { t } = useLanguage();

  const mainServices = [
    { 
      id: 'logo', 
      icon: '🎨', 
      // Replace URL with local import if needed:
      // img: logoImg,
      img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'branding', 
      icon: '✨', 
      img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'video', 
      icon: '🎥', 
      img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'motion', 
      icon: '🎬', 
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'proposal', 
      icon: '📄', 
      img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'flyer', 
      icon: '🎴', 
      img: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'card', 
      icon: '💳', 
      img: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'animation', 
      icon: '🧊', 
      img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=500&q=60' 
    },
    { 
      id: 'explainer', 
      icon: '💡', 
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=60' 
    },
  ];

  return (
    <div id="services" className="section">
      <div className="section-title-holder" style={{ background: 'var(--main-gradient)' }}>
        <div className="section-num">
          <span>01</span>
        </div>
        <h2 className="entry-title">SERVICES</h2>
      </div>
      <div className="section-content-holder">
        <div className="services-grid">
          {mainServices.map((service) => (
            <div key={service.id} className="service-holder-boxus">
              <div className="service-image-container">
                <img src={service.img} alt={t(`services.${service.id}`)} className="service-img-display" />
                <div className="service-icon-overlay">{service.icon}</div>
              </div>
              <div className="service-content-wrapper">
                <div className="service-title">{t(`services.${service.id}`)}</div>
                <div className="service-content">
                  Professional {t(`services.${service.id}`)} tailored to your brand's needs. 
                  Contact us for a custom quote.
                </div>
                <div style={{ marginTop: '20px' }}>
                  <a href="#contact" className="btn" style={{ background: 'var(--main-gradient)', color: 'var(--white)', padding: '10px 20px', fontSize: '12px' }}>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
};

export default Services;
