import React from 'react';

const WhatsAppButton = () => {
  const whatsappNumber = '0266696183';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a 
      href={whatsappUrl} 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span className="whatsapp-icon">💬</span>
    </a>
  );
};

export default WhatsAppButton;
