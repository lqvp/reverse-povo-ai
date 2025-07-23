import React from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'

const MovieBookingCarousel = ({ movies, handleBookingClick, bookingType }) => {
  const settings = {
    slidesToShow: 2.3,
    slidesToScroll: 1,
    infinite: false,
    speed: 500,
    arrows: false
  }

  return (
    <div className='movie-carousel-container'>
      <Slider {...settings}>
        {movies?.map((movie, index) => (
          <div key={index} className='movie-carousel-slide'>
            <div className='movie-image-wrapper'>
              <img
                src={movie?.image}
                alt={movie?.name}
                className='movie-image'
              />
              {movie?.rating && (
                <div className='movie-rating'>
                  <img src={'images/moviesevents/noto_star.png'} alt='rating' />
                  <div>{movie.rating}</div>
                </div>
              )}
              <button
                className='book-now-btn'
                onClick={() => handleBookingClick(movie, bookingType)}
              >
                Book Now
              </button>
            </div>
            <div className='movie-text'>
              <div className='movie-title'>{movie?.name}</div>
              <div className='movie-description'>{movie?.description}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

MovieBookingCarousel.propTypes = {
  movies: PropTypes.array,
  handleBookingClick: PropTypes.func
}

export default MovieBookingCarousel
