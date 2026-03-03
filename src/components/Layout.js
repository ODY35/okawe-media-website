import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/images/logo.png';

const Layout = ({ children }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="layout">
      <header className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <img src={logo} alt="OKAWE MEDIA" className="navbar-logo" />
          </Link>
          
          <div className={`nav-elements ${isMenuOpen ? 'active' : ''}`}>
            <nav>
              <ul className="nav-links">
                <li><a href="#home" onClick={closeMenu}>{t('nav.home')}</a></li>
                <li><a href="#services" onClick={closeMenu}>{t('nav.services')}</a></li>
                <li><a href="#portfolio" onClick={closeMenu}>{t('nav.portfolio')}</a></li>
                <li><a href="#gallery" onClick={closeMenu}>{t('nav.gallery')}</a></li>
                <li><a href="#contact" onClick={closeMenu}>{t('nav.contact')}</a></li>
              </ul>
            </nav>
            <div className="language-switch">
              <button 
                onClick={() => { toggleLanguage('en'); closeMenu(); }}
                className={language === 'en' ? 'active' : ''}
                style={{
                  background: language === 'en' ? 'var(--main-gradient)' : 'transparent',
                  color: 'var(--white)',
                  border: '1px solid var(--violet)',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  marginLeft: '5px'
                }}
              >
                EN
              </button>
              <button 
                onClick={() => { toggleLanguage('fr'); closeMenu(); }}
                className={language === 'fr' ? 'active' : ''}
                style={{
                  background: language === 'fr' ? 'var(--main-gradient)' : 'transparent',
                  color: 'var(--white)',
                  border: '1px solid var(--violet)',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  marginLeft: '5px'
                }}
              >
                FR
              </button>
            </div>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`} style={{ backgroundColor: isMenuOpen ? 'transparent' : 'var(--white)' }}></span>
          </button>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="footer" style={{ backgroundColor: 'var(--navy-blue)', color: 'var(--ash-grey)', padding: '60px 0', textAlign: 'center', borderTop: '1px solid var(--violet)' }}>
        <div className="container">
          <p style={{ color: 'var(--white)', fontWeight: 'bold' }}>&copy; 2026 OKAWE Media. All rights reserved.</p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <p>Email: <span style={{ color: 'var(--light-blue)' }}>okawenco@gmail.com</span></p>
            <p>Call: <span style={{ color: 'var(--light-blue)' }}>0505775482</span></p>
          </div>
          <div style={{ marginTop: '20px' }}>
            <a href="#home" style={{ color: 'var(--violet)', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px' }}>Back to Top</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
