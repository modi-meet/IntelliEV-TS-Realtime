import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold">Join the Revolution</h3>
          <p
            className="text-lg mt-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Have questions or want to partner with us? Reach out!
          </p>
        </div>
        <div className="info-card rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-bold mb-4">Get in Touch</h4>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              We're excited to hear from drivers, developers, and city
              partners who want to build the future of mobility with us.
            </p>
            <div className="space-y-4">
              <p>
                <i
                  className="fa-solid fa-envelope mr-3"
                  style={{ color: 'var(--accent-green)' }}
                ></i>{' '}
                contact@intelliev.network
              </p>
              <p>
                <i
                  className="fa-solid fa-phone mr-3"
                  style={{ color: 'var(--accent-green)' }}
                ></i>{' '}
                +91 80 1234 5678
              </p>
              <p>
                <i
                  className="fa-solid fa-map-marker-alt mr-3"
                  style={{ color: 'var(--accent-green)' }}
                ></i>{' '}
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="font-semibold block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="form-input w-full px-4 py-3 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-semibold block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="form-input w-full px-4 py-3 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-semibold block mb-1">
                Message
              </label>
              <textarea
                id="message"
                placeholder="How can we help?"
                rows="4"
                className="form-input w-full px-4 py-3 rounded-md shadow-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full btn-primary font-bold px-6 py-3 rounded-lg text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
