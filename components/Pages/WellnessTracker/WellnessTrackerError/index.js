import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import WellnessTrackerHeader from '../WellnessTrackerHeader'
import './index.css'
import { useAppContext } from '../../../../context/AppContext'
import { handleAnalytics } from '../../../../hooks/constant'
import { useNavigate } from 'react-router-dom'

const WellnessTrackerError = ({
  deviceCompatible,
  handleStart,
  cameraPermissionError
}) => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()

  const redirectionFromErrorScreen = () => {
    if (deviceCompatible) {
      handleStart()
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    if (authorizationId) {
      handleAnalytics('wellness_error_impression', authorizationId)
    }
  }, [authorizationId])

  return (
    <div className='ai-store-wellness-tracker-error'>
      <WellnessTrackerHeader color='#ffffff' title='' />
      <div className='wellness-tracker-error-body'>
        <div className='wellness-tracker-error-content'>
          <div className='wellness-tracker-error-title'>
            {cameraPermissionError
              ? 'Camera Permission Required'
              : deviceCompatible
                ? 'Oops!'
                : 'Device Incompatible'}
          </div>
          <p>
            {cameraPermissionError
              ? 'To use the Wellness Scan, we need access to your camera'
              : deviceCompatible
                ? 'We noticed a few hiccups while trying to process your data'
                : 'Looks like your device does not support this feature'}
          </p>
          <p>
            {cameraPermissionError
              ? 'Please enable camera permissions in your app settings'
              : deviceCompatible
                ? `Don't worry, even the best of us have off days!`
                : `Don't worry, we will bring this feature to your device soon`}
          </p>
          <button
            className='ai-track-wellness-btn'
            onClick={redirectionFromErrorScreen}
          >
            {cameraPermissionError || !deviceCompatible
              ? 'Back to Explore'
              : 'Scan again'}
          </button>
        </div>
      </div>
    </div>
  )
}

WellnessTrackerError.propTypes = {
  deviceCompatible: PropTypes.bool,
  handleStart: PropTypes.func,
  cameraPermissionError: PropTypes.bool
}

export default WellnessTrackerError
