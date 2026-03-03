import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { portfolioItems } from '../content/portfolio';

const Portfolio = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

 

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

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
