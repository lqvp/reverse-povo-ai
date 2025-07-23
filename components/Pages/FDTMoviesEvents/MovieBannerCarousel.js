import React, { useState } from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'

const MovieBannerCarousel = ({ banners, handleBookingClick }) => {
  const [selectedSlide, setSelectedSlide] = useState(0)

  const settings = {
    dots: false,
    infinite: true,
    initialSlide: 1,
    centerMode: true,
    centerPadding: '5%',
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000
  }

  const handleSlideChange = (_, nextSlide) => {
    const totalSlides = banners?.length ?? 0
    setSelectedSlide(Math.ceil(nextSlide) % totalSlides)
  }

  return (
    <>
      {banners?.length > 0 && (
        <div className='movies-banner-container'>
          <Slider
            {...settings}
            className='movies-banner-slider'
            beforeChange={handleSlideChange}
          >
            {banners?.map((banner) => (
              <img
                key={banner?.id}
                className='movies-banner-carousel-image'
                src={banner?.image}
                alt={banner?.name}
                onClick={() => handleBookingClick(banner, 'banner')}
              />
            ))}
          </Slider>
          <div className='movies-banner-slider-dots'>
            {banners?.map((_, index) => (
              <div
                className={`movies-banner-slider-dot ${
                  index === selectedSlide ? 'active' : ''
                }`}
                key={index}
              ></div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

MovieBannerCarousel.propTypes = {
  banners: PropTypes.array,
  handleBookingClick: PropTypes.func
}

export default MovieBannerCarousel
