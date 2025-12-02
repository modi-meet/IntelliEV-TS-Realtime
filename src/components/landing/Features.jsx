import React from 'react';

const Features = () => {
  return (
    <section
      id="features"
      className="py-20"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3
            className="text-4xl font-extrabold"
            style={{ color: 'var(--text-dark)' }}
          >
            Our Core Pillars
          </h3>
          <p
            className="text-lg mt-4 max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            We've built our network on three pillars designed to address every
            aspect of the modern EV experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-car-burst text-3xl"></i>
            </div>
            <h4 className="text-2xl font-bold mb-3">Emergency Response</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              In a collision, your vehicle automatically alerts emergency
              services with your precise location and vehicle data. Nearby
              IntelliEV users are also notified to offer immediate assistance.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-network-wired text-3xl"></i>
            </div>
            <h4 className="text-2xl font-bold mb-3">
              Intelligent Connectivity
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Using V2X (Vehicle-to-Everything) technology, your car
              communicates with others to report hazards, traffic jams, and road
              conditions in real-time, creating a collaborative and safer road
              network.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-charging-station text-3xl"></i>
            </div>
            <h4 className="text-2xl font-bold mb-3">Smart Infrastructure</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              End range anxiety. Find and reserve available charging stations,
              get live updates on their status, and let your vehicle's
              navigation route you to the most efficient charging spot on your
              journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
