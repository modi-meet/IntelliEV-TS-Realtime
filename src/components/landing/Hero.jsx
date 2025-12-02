import React from 'react';

const Hero = () => {
  return (
    <section className="hero-bg">
      <div className="max-w-5xl mx-auto text-center px-6 py-24 md:py-32">
        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
          style={{ color: 'var(--text-dark)' }}
        >
          Driving the Future of EV Safety and Connectivity
        </h2>
        <p
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Drive with confidence. IntelliEV connects your vehicle to a smart
          ecosystem of drivers, emergency responders, and city infrastructure,
          creating a safer, more efficient journey for everyone.
        </p>
        <a
          href="#features"
          className="btn-primary font-bold px-8 py-4 rounded-lg text-lg inline-block"
        >
          Discover How It Works
        </a>
      </div>
    </section>
  );
};

export default Hero;
