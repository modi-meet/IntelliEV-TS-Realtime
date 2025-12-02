import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Audience from '../components/landing/Audience';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page-wrapper">
      <Header />
      <Hero />
      <Features />
      <Audience />
      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;
