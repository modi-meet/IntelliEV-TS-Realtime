import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Card from '../ui/Card';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold">Join the Revolution</h3>
          <p
            className="text-lg mt-4 text-[#6c757d]"
          >
            Have questions or want to partner with us? Reach out!
          </p>
        </div>
        <Card variant="landing" className="rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-bold mb-4">Get in Touch</h4>
            <p className="mb-6 text-[#6c757d]">
              We're excited to hear from drivers, developers, and city
              partners who want to build the future of mobility with us.
            </p>
            <div className="space-y-4">
              <p className="flex items-center">
                <FaEnvelope className="mr-3 text-[#20c997]" />{' '}
                contact@intelliev.network
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-3 text-[#20c997]" />{' '}
                +91 80 1234 5678
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-3 text-[#20c997]" />{' '}
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="font-semibold block mb-1">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-semibold block mb-1">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-semibold block mb-1">
                Message
              </label>
              <TextArea
                id="message"
                rows={4}
                placeholder="How can we help?"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
