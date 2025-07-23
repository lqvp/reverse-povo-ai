import React from 'react'
import './index.css'
import LandingPage from './LandingPage'
import ComingSoon from './ComingSoon'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import Header from './Header'

const FDTMoviesEvents = () => {
  const [isBookingClicked, setIsBookingClicked] = React.useState(false)
  const { authorizationId } = useAppContext()

  const handleBookingClick = (movie, bookingType) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'movies_and_events'
    }
    let eventName

    switch (bookingType) {
      case 'banner':
        properties.feature_name = 'banner'
        properties.sku_name = movie?.name
        eventName = 'clicked events_sub_banner'
        break
      case 'movie':
        properties.feature_name = 'movie'
        properties.sku_name = movie?.name
        eventName = 'clicked movies_tile'
        break
      case 'event':
        properties.feature_name = 'event'
        properties.sku_name = movie?.name
        eventName = 'clicked events_tile'
        break
      default:
        break
    }

    trackEvent(eventName, properties)
    setIsBookingClicked(true)
  }

  return (
    <div className='movies-fdt-container'>
      <Header color='#fff' title='Movies & Events' />
      {isBookingClicked ? (
        <ComingSoon />
      ) : (
        <LandingPage handleBookingClick={handleBookingClick} />
      )}
    </div>
  )
}

export default FDTMoviesEvents
