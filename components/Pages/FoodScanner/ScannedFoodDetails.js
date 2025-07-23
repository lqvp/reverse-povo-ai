import React from 'react'
import BackButton from '../../../static/BackButton'
import './ScannedFoodDetails.css'
import PropTypes from 'prop-types'

const ScannedFoodDetails = ({
  previewUrl,
  foodDetails,
  handleBackClick,
  rescanFood
}) => {
  const { macronutrients, name, calories } = foodDetails

  return (
    <div className='food-scanner-container main-body-wrapper'>
      <div className='food-scanner-result-back-btn'>
        <BackButton
          color='#FFF'
          fontSize='20px'
          textVisible={false}
          onClick={handleBackClick}
        />
      </div>
      <div className='food-scanner-content'>
        <img
          className='food-scanner-food-image'
          src={previewUrl ? previewUrl : './images/BG.png'}
          alt='Chilli Garlic noodles'
        />
        <p className='food-scanner-name'>{name}</p>
        <div className='food-scan-details-container'>
          <div className='macro-nutrients'>
            <p className='macro-nutrients-label'>Macronutrients</p>
            <div className='food-scanner-calories'>
              <label className='label'>kcal</label>
              <label className='value'>~{calories} / serving</label>
            </div>
            {Object.entries(macronutrients).map(([key, value]) => (
              <div className='food-scanner-macro-item' key={key}>
                <label>{key}</label> ~{value}g
              </div>
            ))}

            <button className='food-rescan-button' onClick={rescanFood}>
              Rescan
            </button>
          </div>
          <p className='food-scanner-approximation'>
            *All values are approximations
          </p>
        </div>
      </div>
    </div>
  )
}

ScannedFoodDetails.propTypes = {
  previewUrl: PropTypes.string,
  foodDetails: PropTypes.shape({
    macronutrients: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired
  }).isRequired,
  handleBackClick: PropTypes.func.isRequired,
  rescanFood: PropTypes.func.isRequired
}

export default ScannedFoodDetails
