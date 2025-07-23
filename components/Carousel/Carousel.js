import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './Carousel.css'
import PropTypes from 'prop-types'

const Carousel = ({ data, onImageSelect, selectedImage }) => {
  const handleImageClick = (selectedImageId) => {
    if (selectedImage === selectedImageId) {
      return
    } else {
      onImageSelect(selectedImageId)
    }
  }

  const emptySlidesCount = Math.max(0, 3 - (data?.length || 0))

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    initialSlide: 0
  }

  const emptySlides = Array.from({ length: emptySlidesCount }).map(
    (_, index) => <div key={`empty-${index}`}></div>
  )

  return (
    <Slider {...settings}>
      {data?.map((d) => (
        <div key={d.id} className='carousel-item'>
          <div
            className={`image-container ${
              selectedImage === d.id ? 'selected-image' : ''
            }`}
            onClick={() => handleImageClick(d.id)}
          >
            <img src={d.url} alt={d.name} className='carousel-image' />
          </div>
          <div className='image-name'>{d.name}</div>
        </div>
      ))}
      {emptySlides}
    </Slider>
  )
}

Carousel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onImageSelect: PropTypes.func.isRequired,
  selectedImage: PropTypes.string
}

export default Carousel
