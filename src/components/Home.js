import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Gallery from './Gallery';
import Portfolio from './Portfolio';
import Contact from './Contact';
import WhatsAppButton from './WhatsAppButton';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Services />
      <Portfolio />
      <Gallery />
      <Contact />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
