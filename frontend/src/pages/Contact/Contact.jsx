import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-4">
            We'd love to hear from you! Whether you have questions about our products, need help with an order, or just want to share feedback, our team is here to help.
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> support@emptio.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Shopping Street, Commerce City, CC 12345</p>
            <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input type="text" id="name" className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input type="email" id="email" className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea id="message" rows="4" className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;