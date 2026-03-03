import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Gallery = () => {
  const { t } = useLanguage();

  const onsitePhotos = [
    { id: 1, title: 'Onsite Shoot A', url: 'https://images.unsplash.com/photo-1519681393784-5f48f9640b39?auto=format&fit=crop&w=800&q=60' },
    { id: 2, title: 'Onsite Setup B', url: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=800&q=60' },
    { id: 3, title: 'Production Crew', url: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=60' },
    { id: 4, title: 'Behind The Scenes', url: 'https://images.unsplash.com/photo-1520226607048-8dda3a35556e?auto=format&fit=crop&w=800&q=60' },
    { id: 5, title: 'Equipment Layout', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60' },
    { id: 6, title: 'Client Location', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60' },
  ];

  const loopPhotos = [...onsitePhotos, ...onsitePhotos];
  return (
    <div id="gallery" className="section">
      <div className="section-title-holder" style={{ background: 'var(--main-gradient)' }}>
        <div className="section-num">
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>02</span>
        </div>
        <h2 className="entry-title">{t('nav.gallery').toUpperCase()}</h2>
      </div>
      <div className="section-content-holder">
        <div className="gallery-slider">
          <div className="gallery-track">
            {loopPhotos.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="gallery-item">
                <img src={item.url} alt={item.title} />
                <div className="gallery-text-holder" style={{ background: 'rgba(0, 191, 255, 0.8)' }}>
                  <p className="gallery-text">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
};

export default Gallery;
