import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Portfolio = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const portfolioItems = [
    { id: 1, category: 'logo', title: 'Modern Tech Logo', type: 'image', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500&q=60' },
    { id: 2, category: 'video', title: 'Brand Story Video', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 3, category: 'branding', title: 'Corporate Identity', type: 'image', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=500&q=60' },
    { id: 4, category: 'motion', title: 'Dynamic Intro', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 5, category: 'flyer', title: 'Event Flyer Design', type: 'image', url: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=500&q=60' },
    { id: 6, category: 'animation', title: '3D Product Reveal', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ];

  const categories = ['all', 'logo', 'branding', 'video', 'motion', 'flyer', 'animation'];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div id="portfolio" className="section">
      <div className="section-title-holder" style={{ background: 'var(--main-gradient)' }}>
        <div className="section-num">
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>02</span>
        </div>
        <h2 className="entry-title">PORTFOLIO</h2>
      </div>
      <div className="section-content-holder">
        <div className="portfolio-filters" style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? 'var(--main-gradient)' : 'transparent',
                color: filter === cat ? 'var(--white)' : 'var(--ash-grey)',
                border: '1px solid var(--ash-grey)',
                padding: '5px 15px',
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}
            >
              {cat === 'all' ? 'All' : t(`services.${cat}`)}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio-item">
              {item.type === 'image' ? (
                <>
                  <img src={item.url} alt={item.title} />
                  <div className="portfolio-text-holder" style={{ background: 'rgba(138, 43, 226, 0.8)' }}>
                    <p className="portfolio-text">{item.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--white)' }}>{t(`services.${item.category}`)}</p>
                  </div>
                </>
              ) : (
                <>
                  <iframe 
                    src={item.url} 
                    title={item.title}
                    frameBorder="0" 
                    allowFullScreen
                    style={{ width: '100%', height: '100%' }}
                  ></iframe>
                  <div className="portfolio-text-holder" style={{ background: 'rgba(0, 191, 255, 0.8)' }}>
                    <p className="portfolio-text">{item.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--white)' }}>{t(`services.${item.category}`)}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
};

export default Portfolio;
