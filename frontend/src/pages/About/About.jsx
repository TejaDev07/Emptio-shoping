import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      <div className="prose prose-lg mx-auto">
        <p className="mb-4">
          Welcome to Emptio, your one-stop shop for all your needs. We are committed to providing quality products at affordable prices, ensuring a seamless shopping experience for our customers.
        </p>
        <p className="mb-4">
          Founded in 2025, Emptio has grown from a small online store to a comprehensive e-commerce platform offering a wide range of products across various categories including fashion, electronics, beauty, and home & garden items.
        </p>
        <p className="mb-4">
          Our mission is to make shopping accessible and enjoyable for everyone. We believe in quality, affordability, and excellent customer service. Whether you're looking for the latest fashion trends, cutting-edge electronics, or everyday essentials, we've got you covered.
        </p>
        <p>
          Thank you for choosing Emptio. We look forward to serving you!
        </p>
      </div>
    </div>
  );
};

export default About;