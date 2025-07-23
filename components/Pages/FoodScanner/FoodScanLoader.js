import React from 'react'
import './FoodScanLoader.css'

const FoodScanLoader = () => {
  return (
    <div className='food-scan-loader-container main-body-wrapper'>
      <div className='food-scan-loader-content'>
        <div className='food-scan-loading-spinner'></div>
        <p className='food-scan-loader'>
          Hang tight!
          <br />
          Your food&apos;s about to reveal its secrets... Calories included!
        </p>
      </div>
    </div>
  )
}

export default FoodScanLoader
