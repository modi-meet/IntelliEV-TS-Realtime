import React from 'react';

const Audience = () => {
  return (
    <section id="audience" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold">A Network for Everyone</h3>
          <p
            className="text-lg mt-4 max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            IntelliEV is designed to benefit every stakeholder in the urban
            mobility ecosystem.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="info-card p-8 rounded-xl">
            <h4 className="text-xl font-bold mb-3">For EV Drivers</h4>
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Drive with enhanced safety and peace of mind.</li>
              <li>Receive real-time hazard and traffic alerts.</li>
              <li>Easily find and access charging stations.</li>
              <li>Be a part of a helpful driver community.</li>
            </ul>
          </div>
          <div className="info-card p-8 rounded-xl">
            <h4 className="text-xl font-bold mb-3">For Emergency Services</h4>
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Receive instant, data-rich crash notifications.</li>
              <li>Get precise GPS locations and vehicle diagnostics.</li>
              <li>Reduce response times and save lives.</li>
              <li>Coordinate with other responders in real-time.</li>
            </ul>
          </div>
          <div className="info-card p-8 rounded-xl">
            <h4 className="text-xl font-bold mb-3">For City Planners</h4>
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>Gather anonymous data on traffic flow.</li>
              <li>Identify accident-prone areas for improvement.</li>
              <li>Monitor charging infrastructure usage.</li>
              <li>Build a smarter, more efficient city.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audience;
