import React, { useState, useCallback, useEffect } from 'react'
import WellnessTrackerHome from './WellnessTrackerHome'
import './index.css'
import Loader from '../../Loader/Loader'
import { useDisableZoom, useCameras } from '../../../hooks'
import Scanner from './WellnessTrackerScanner'
import { useAppContext } from '../../../context/AppContext'
import { handleAnalytics } from '../../../hooks/constant'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import TokenHeader from '../../TokenHeader/TokenHeader'

const HealthWellness = () => {
  const { authorizationId, authorizationError, authInProgress } =
    useAppContext()
  const cameras = useCameras()
  useDisableZoom()
  const [isLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [cameraId, setCameraId] = useState()
  const [isLicenseValid, setIsLicenseValid] = useState(false)
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()

  const updateLicenseStatus = useCallback((valid) => {
    setIsLicenseValid(valid)
  }, [])

  useEffect(() => {
    if (!cameras?.length) return
    setCameraId(cameras[0].deviceId)
  }, [cameras])

  const handleStart = useCallback(() => {
    setStarted(false)
  }, [])

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_wellness_scan_lp_impression`,
        app_name: `wellness_scanner`,
        event: `user_engaged_wellness_scan`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  useEffect(() => {
    if (authorizationId) {
      handleAnalytics('wellness_lp_impression', authorizationId)
    }
  }, [authorizationId])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  if (isLoading || authInProgress || authorizationError) {
    return <Loader />
  }

  return (
    <>
      <div className='ai-store-wellness-tracker-home'>
        {isTokenisationEnabled && <TokenHeader background='#64b7e7' />}
        {started ? (
          <Scanner
            cameraId={cameraId}
            onLicenseStatus={updateLicenseStatus}
            handleStart={handleStart}
            isLicenseValid={isLicenseValid}
          />
        ) : (
          <WellnessTrackerHome setStarted={setStarted} />
        )}
      </div>
    </>
  )
}

export default HealthWellness
