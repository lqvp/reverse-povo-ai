import React from 'react'
import PropTypes from 'prop-types'
import './CustomJoyride.css'

const SpotlightOverlay = ({ top, left, size }) => {
  return (
    <div className='custom-overlay'>
      <div
        className='circle-spotlight'
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  )
}

SpotlightOverlay.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  size: PropTypes.number
}

export default SpotlightOverlay
