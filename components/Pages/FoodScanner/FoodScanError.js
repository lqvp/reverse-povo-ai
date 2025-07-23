import React from 'react'
import './FoodScanError.css'
import PropTypes from 'prop-types'

const FoodScanError = ({ handleBackToHome }) => {
  return (
    <div className='food-scan-error-container'>
      <div className='food-scan-error-content'>
        <div className='food-scan-error-title'>Oops, mystery meal alert!</div>
        <p className='food-scan-error'>
          We can’t recognise this one, Try again
        </p>
        <button className='food-scan-error-back-btn' onClick={handleBackToHome}>
          Try again
        </button>
      </div>
    </div>
  )
}

FoodScanError.propTypes = {
  handleBackToHome: PropTypes.func.isRequired
}

export default FoodScanError
