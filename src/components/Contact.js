import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { name: 'Facebook Ghana', url: 'https://www.facebook.com/OKAWEMEDIA.ghana/' },
    { name: 'Facebook Gabon', url: 'https://www.facebook.com/okawencogabon/' },
    { name: 'Facebook Senegal', url: 'https://www.facebook.com/Okawencosenegal' },
    { name: 'Facebook Cote d\'Ivoire', url: 'https://www.facebook.com/profile.php?id=61580301149806' },
    { name: 'Instagram', url: 'https://www.instagram.com/okawe.media/' },
    { name: 'Google Business', url: 'https://share.google/EzI0Yh4GaaglKiUWk' },
  ];

  return (
    <div id="contact" className="section">
      <div className="section-title-holder" style={{ background: 'var(--main-gradient)' }}>
        <div className="section-num">
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>03</span>
        </div>
        <h2 className="entry-title">CONTACT</h2>
      </div>
      <div className="section-content-holder">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="contact-info">
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '24px', marginBottom: '20px', color: 'var(--violet)' }}>GET IN TOUCH</h3>
            <p style={{ color: 'var(--ash-grey)', marginBottom: '30px' }}>Ready to start your next project? Contact us today.</p>
            
            <div className="contact-details" style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>Call Us:</strong> <span style={{ color: 'var(--light-blue)' }}>0505775482</span></p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>WhatsApp:</strong> <span style={{ color: '#25D366' }}>0266696183</span></p>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>Email:</strong> <span style={{ color: 'var(--light-blue)' }}>okawenco@gmail.com</span></p>
              </div>
            </div>

            <div className="social-links">
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px', color: 'var(--ash-grey)' }}>Follow Us</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      border: '1px solid var(--violet)',
                      padding: '5px 10px',
                      color: 'var(--white)',
                      background: 'rgba(138, 43, 226, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.target.style.background = 'var(--violet)'; e.target.style.color = 'var(--white)'; }}
                    onMouseOut={(e) => { e.target.style.background = 'rgba(138, 43, 226, 0.1)'; e.target.style.color = 'var(--white)'; }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '24px', marginBottom: '20px', color: 'var(--violet)' }}>SEND A MESSAGE</h3>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn" style={{ background: 'var(--main-gradient)', color: 'var(--white)', width: '100%', borderRadius: '5px' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
};

export default Contact;
