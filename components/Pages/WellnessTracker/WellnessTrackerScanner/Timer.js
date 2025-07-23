import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTimer } from '../../../../hooks'
import { DEFAULT_MEASUREMENT_DURATION } from '../../../../hooks/constant'
import ResultLoader from './ResultLoader'

const Timer = ({
  started,
  durationSeconds,
  setViewResults,
  pulseRate,
  isMeasurementCompleted
}) => {
  const seconds = useTimer(started, durationSeconds)
  const widthPercentage = (seconds / DEFAULT_MEASUREMENT_DURATION) * 100

  useEffect(() => {
    if (isMeasurementCompleted) {
      const timerId = setTimeout(() => {
        setViewResults(true)
      }, 2000)

      return () => {
        clearTimeout(timerId)
      }
    }
  }, [isMeasurementCompleted, setViewResults])

  return (
    <>
      {isMeasurementCompleted ? (
        <ResultLoader open={true} />
      ) : (
        <>
          <div className='wellness-scanner-heart-info'>
            <div className='wellness-scanner-heart-text'>
              {pulseRate ?? 0} <span>bpm</span>
            </div>
            <img src='images/wellness_track/heart-beat.svg' alt='heart-rate' />
          </div>
          <div className='wellness-tracker-timer'>
            <div
              className='wellness-tracker-timer-inner'
              style={{ width: `${widthPercentage}%` }}
            >
              <div className='wellness-tracker-timer-content'>
                {widthPercentage.toFixed(0)}%
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

Timer.propTypes = {
  started: PropTypes.bool.isRequired,
  durationSeconds: PropTypes.number.isRequired,
  setViewResults: PropTypes.func.isRequired,
  pulseRate: PropTypes.number,
  isMeasurementCompleted: PropTypes.bool.isRequired
}

export default Timer
