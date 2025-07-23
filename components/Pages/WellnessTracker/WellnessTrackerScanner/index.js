import React, { useCallback, useEffect, useRef, useState } from 'react'
import './index.css'
import {
  useError,
  useMonitor,
  usePageVisibility,
  usePrevious
} from '../../../../hooks'
import Timer from './Timer'
import {
  DEFAULT_MEASUREMENT_DURATION,
  VideoReadyState,
  handleAnalytics
} from '../../../../hooks/constant'
import Loader from '../../../Loader/Loader'
import WellnessTrackerHeader from '../WellnessTrackerHeader'
import WellnessTrackerDetails from '../WellnessTrackerDetails'
import { useAppContext } from '../../../../context/AppContext'
import WellnessTrackerError from '../WellnessTrackerError'
import { HealthMonitorCodes, isIos, SessionState } from '@binah/web-sdk'
import PropTypes from 'prop-types'
import { isIOSVersionCompatible } from '../../../../helpers/helperFunctions'

const Scanner = ({ cameraId, onLicenseStatus, handleStart }) => {
  const { authorizationId } = useAppContext()
  const video = useRef(null)
  const [startMeasuring, setStartMeasuring] = useState(false)
  const [viewResults, setViewResults] = useState(false)
  const isPageVisible = usePageVisibility()
  const [processingTime] = useState(DEFAULT_MEASUREMENT_DURATION)
  const [licenseKey] = useState(process.env.REACT_APP_BINAH_LICENSE_KEY ?? '')
  const { sessionState, vitalSigns, error, info, isMeasurementCompleted } =
    useMonitor(
      video,
      cameraId,
      processingTime,
      licenseKey,
      null,
      startMeasuring
    )
  const prevSessionState = usePrevious(sessionState)
  const errorMessage = useError(error)

  const isMeasuring = useCallback(
    () => sessionState === SessionState.MEASURING,
    [sessionState]
  )

  const isVideoReady = useCallback(
    () =>
      video.current !== null &&
      video.current.readyState === VideoReadyState.HAVE_ENOUGH_DATA,
    []
  )

  const handleButtonClick = useCallback(() => {
    if (!isMeasuring()) {
      handleAnalytics(`wellness_start_scan_click`, authorizationId)
    }
    if (sessionState === SessionState.ACTIVE) {
      setStartMeasuring(true)
    } else if (isMeasuring()) {
      setStartMeasuring(false)
    }
  }, [sessionState, authorizationId, isMeasuring])

  useEffect(() => {
    if (isMeasuring()) {
      !isPageVisible && setStartMeasuring(false)
    } else if (
      (sessionState === SessionState.ACTIVE ||
        sessionState === SessionState.TERMINATED) &&
      errorMessage
    )
      if (
        sessionState === SessionState.ACTIVE &&
        prevSessionState !== sessionState
      ) {
        setStartMeasuring(false)
      }
  }, [errorMessage, sessionState, isPageVisible, isMeasuring, prevSessionState])

  useEffect(() => {
    onLicenseStatus(!(error?.code in HealthMonitorCodes))
  }, [error, onLicenseStatus])

  useEffect(() => {
    if (authorizationId) {
      handleAnalytics(`wellness_scan_impression`, authorizationId)
    }
  }, [authorizationId])

  if (
    error?.code ===
    HealthMonitorCodes.CAMERA_CODE_CAMERA_MISSING_PERMISSIONS_ERROR
  ) {
    return (
      <WellnessTrackerError
        cameraPermissionError={true}
        handleStart={handleStart}
      />
    )
  }

  if (!isIOSVersionCompatible()) {
    return (
      <WellnessTrackerError
        deviceCompatible={false}
        handleStart={handleStart}
      />
    )
  }

  if (errorMessage) {
    return (
      <WellnessTrackerError deviceCompatible={true} handleStart={handleStart} />
    )
  }

  return (
    <>
      <div className='wellness-scanner-container'>
        {viewResults ? (
          <WellnessTrackerDetails
            vitalSigns={vitalSigns}
            handleStart={handleStart}
          />
        ) : (
          <>
            {!isVideoReady() && licenseKey && <Loader />}
            <WellnessTrackerHeader
              handleBack={handleStart}
              title='Wellness Scan'
            />
            <div className='wellness-scanner-body'>
              <div className='wellness-scanner-content'>
                {(isMeasuring() || isMeasurementCompleted) && (
                  <div className='wellness-scanner-info'>
                    {info.message && isMeasuring() ? (
                      <span className='wellness-error-danger'>
                        Unable to detect face, Please position you face inside
                        the frame
                      </span>
                    ) : (
                      <>
                        {isMeasurementCompleted
                          ? 'Thank you for your patience'
                          : 'Position your face inside the frame'}
                      </>
                    )}
                  </div>
                )}
                <img
                  src='/images/wellness_track/mask.svg'
                  className='wellness-scanner-mask'
                  alt='mask'
                />
                <video
                  ref={video}
                  id='video'
                  muted={true}
                  playsInline={true}
                  style={{ objectFit: isIos() ? 'unset' : 'contain' }}
                />
              </div>
            </div>
            <div
              className='wellness-scanner-bottom'
              style={{
                display:
                  isMeasuring() || isMeasurementCompleted ? 'none' : 'flex'
              }}
            >
              <button
                onClick={handleButtonClick}
                className='ai-track-wellness-btn'
              >
                Start
              </button>
            </div>
            <div
              className='wellness-scanner-bottom timer-container'
              style={{
                display:
                  !isMeasuring() && !isMeasurementCompleted ? 'none' : 'flex'
              }}
            >
              <Timer
                started={isMeasuring()}
                durationSeconds={processingTime}
                setViewResults={setViewResults}
                pulseRate={vitalSigns?.pulseRate?.value}
                isMeasurementCompleted={isMeasurementCompleted}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

Scanner.propTypes = {
  cameraId: PropTypes.string.isRequired,
  onLicenseStatus: PropTypes.func.isRequired,
  handleStart: PropTypes.func.isRequired,
  isLicenseValid: PropTypes.bool.isRequired
}

export default Scanner
