import React from 'react'
import PropTypes from 'prop-types'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'

// card sizes
const sizes = {
  full: '100%',
  half: 'calc(50% - .5rem)',
  quarter: 'calc(25% - .75rem)'
}

const OfferCard = ({ size, offerImageUrl, title, environment }) => {
  return (
    <div className='offer-card' style={{ width: sizes[size] }}>
      <img
        src={`${getWidgetBaseUrl(environment)}${offerImageUrl}`}
        alt={title}
      />
    </div>
  )
}

OfferCard.propTypes = {
  size: PropTypes.oneOf(['full', 'half', 'quarter']),
  offerImageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  environment: PropTypes.string
}

export default OfferCard
