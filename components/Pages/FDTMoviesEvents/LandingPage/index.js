import React from 'react'
import { movieseventsData } from '../../../../static/movieseventsData'
import MovieBannerCarousel from '../MovieBannerCarousel'
import MovieBookingCarousel from '../MovieBookingCarousel'
import './index.css'
import PropTypes from 'prop-types'

const LandingPage = ({ handleBookingClick }) => {
  return (
    <>
      <div className='landing-page-container'></div>
      <MovieBannerCarousel
        banners={movieseventsData?.banner}
        handleBookingClick={handleBookingClick}
      />
      <div className='booking-container'>
        <div className='movie-event-title'>NOW SHOWING</div>
        <MovieBookingCarousel
          movies={movieseventsData?.movies}
          handleBookingClick={handleBookingClick}
          bookingType='movie'
        />
        <div className='movie-event-title'>TRENDING EVENTS</div>
        <MovieBookingCarousel
          movies={movieseventsData?.events}
          handleBookingClick={handleBookingClick}
          bookingType='event'
        />
      </div>
    </>
  )
}

LandingPage.propTypes = {
  handleBookingClick: PropTypes.func
}

export default LandingPage
