import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { onsitePhotos } from '../content/gallery';

const Gallery = () => {
  const { t } = useLanguage();

 

  const loopPhotos = [...onsitePhotos, ...onsitePhotos];
  return (
    <div id="gallery" className="section compact">
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
