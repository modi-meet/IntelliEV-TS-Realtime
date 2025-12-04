import React from 'react';
import Button from '../ui/Button';

const Hero = () => {
  const bgPattern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e9ecef' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4v-9H0v-1h4V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h9V0h1v4h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9z'/%3E%3Cpath d='M6 5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h5V0h1v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v5h4v1h-4v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4h-5v4h-1v-4H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0v-1h4v-5H0V5h6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <section 
      className="bg-white"
      style={{ backgroundImage: `url("${bgPattern}")` }}
    >
      <div className="max-w-5xl mx-auto text-center px-6 py-24 md:py-32">
        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-[#212529]"
        >
          Driving the Future of EV Safety and Connectivity
        </h2>
        <p
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-[#6c757d]"
        >
          Drive with confidence. IntelliEV connects your vehicle to a smart
          ecosystem of drivers, emergency responders, and city infrastructure,
          creating a safer, more efficient journey for everyone.
        </p>
        <Button
          href="#features"
          className="px-8 py-4 text-lg"
        >
          Discover How It Works
        </Button>
      </div>
    </section>
  );
};

export default Hero;
