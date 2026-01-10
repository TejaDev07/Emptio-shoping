
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import './HomeSlider.css'

const HomeSlider = () => {
  const slides = [
    {
      id: 1,
      image: '/slide1.svg',
      title: 'Welcome to Emptio',
      subtitle: 'Your Ultimate Shopping Destination',
      description: 'Discover amazing products at unbeatable prices',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    },
    {
      id: 2,
      image: '/slide2.svg',
      title: 'Fashion Collection',
      subtitle: 'Trendy & Stylish',
      description: 'Explore our latest fashion trends and styles',
      buttonText: 'View Fashion',
      buttonLink: '/products/fashion'
    },
    {
      id: 3,
      image: '/slide3.svg',
      title: 'Electronics Galore',
      subtitle: 'Latest Technology',
      description: 'Find the best gadgets and electronics',
      buttonText: 'Shop Electronics',
      buttonLink: '/products/electronics'
    },
    {
      id: 4,
      image: '/slide4.svg',
      title: 'Beauty & Wellness',
      subtitle: 'Glow Up Your Life',
      description: 'Premium beauty products for everyone',
      buttonText: 'Explore Beauty',
      buttonLink: '/products/beauty'
    }
  ];

  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper home-slider">
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-container">
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <h2 className="slide-subtitle">{slide.subtitle}</h2>
                  <p className="slide-description">{slide.description}</p>
                  <Link to={slide.buttonLink} className="slide-button">
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default HomeSlider
