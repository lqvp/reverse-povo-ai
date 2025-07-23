import { useCallback, useEffect, useRef, useState } from 'react'
import monitor, {
  DeviceOrientation,
  HealthMonitorCodes,
  ImageValidity,
  SessionState
} from '@binah/web-sdk'
import { InfoType } from './constant'
import { awaitWrap } from '@kelchy/common'

const useMonitor = (
  video,
  cameraId,
  processingTime,
  licenseKey,
  productId,
  startMeasuring
) => {
  const [session, setSession] = useState()
  const [sessionState, setSessionState] = useState()
  const [isMonitorReady, setIsMonitorReady] = useState()
  const [enabledVitalSigns, setEnabledVitalSigns] = useState()
  const [offlineMeasurements, setOfflineMeasurements] = useState()
  const [vitalSigns, setVitalSigns] = useState()
  const [isMeasurementCompleted, setIsMeasurementCompleted] = useState(false)
  const [error, setError] = useState({ code: -1 })
  const [warning, setWarning] = useState({ code: -1 })
  const [info, setInfo] = useState({ type: InfoType.NONE })
  const isDismissing = useRef(false)

  const setInfoWithDismiss = useCallback(
    (info, seconds) => {
      if (!isDismissing.current) {
        setInfo(info)
        if (seconds) {
          isDismissing.current = true
          setTimeout(() => {
            setInfo({ type: InfoType.NONE })
            isDismissing.current = false
          }, seconds * 1000)
        }
      }
    },
    // eslint-disable-next-line
    [InfoType, setInfo, info, isDismissing, isDismissing.current]
  )

  const updateVitalSigns = useCallback((vitalSigns) => {
    setVitalSigns((prev) => ({
      ...prev,
      ...vitalSigns
    }))
  }, [])

  const onVitalSign = useCallback((vitalSign) => {
    updateVitalSigns(vitalSign)
    // eslint-disable-next-line
  }, [])

  const onFinalResults = useCallback((vitalSignsResults) => {
    updateVitalSigns(vitalSignsResults.results)
    setIsMeasurementCompleted(true)
    // eslint-disable-next-line
  }, [])

  const onError = (errorData) => {
    setError(errorData)
  }

  const onWarning = (warningData) => {
    if (
      warningData.code ===
      HealthMonitorCodes.MEASUREMENT_CODE_MISDETECTION_DURATION_EXCEEDS_LIMIT_WARNING
    ) {
      setVitalSigns(null)
    }
    setWarning(warningData)
  }

  const onStateChange = useCallback((state) => {
    setSessionState(state)
    if (state === SessionState.MEASURING) {
      setVitalSigns(null)
      setIsMeasurementCompleted(false)
    }
  }, [])

  const onEnabledVitalSigns = useCallback((vitalSigns) => {
    setEnabledVitalSigns(vitalSigns)
  }, [])

  const onOfflineMeasurement = useCallback((offlineMeasurements) => {
    setOfflineMeasurements(offlineMeasurements)
  }, [])

  const onImageData = useCallback((imageValidity) => {
    let message
    if (imageValidity !== ImageValidity.VALID) {
      switch (imageValidity) {
        case ImageValidity.INVALID_DEVICE_ORIENTATION:
          message = 'Unsupported Orientation'
          break
        case ImageValidity.TILTED_HEAD:
          message = 'Head Tilted'
          break
        case ImageValidity.FACE_TOO_FAR: // Placeholder, currently not supported
          message = 'You Are Too Far'
          break
        case ImageValidity.UNEVEN_LIGHT:
          message = 'Uneven Lighting'
          break
        case ImageValidity.INVALID_ROI:
        default:
          message = 'Face Not Detected'
      }
      setInfo({
        type: InfoType.INSTRUCTION,
        message: message
      })
    } else {
      setInfoWithDismiss({ type: InfoType.NONE })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const initializeMonitor = async () => {
      const { error } = await awaitWrap(
        monitor.initialize({
          licenseKey,
          licenseInfo: {
            onEnabledVitalSigns,
            onOfflineMeasurement
          }
        })
      )

      if (error) {
        setIsMonitorReady(false)
        setError({ code: error.errorCode })
      } else {
        setIsMonitorReady(true)
        setError({ code: -1 })
      }
    }

    initializeMonitor()
    // eslint-disable-next-line
  }, [licenseKey, productId])

  useEffect(() => {
    const initializeFaceSession = async () => {
      if (!isMonitorReady || !processingTime || !video.current) {
        return
      }

      sessionState === SessionState.ACTIVE && session.terminate()
      const options = {
        input: video.current,
        cameraDeviceId: cameraId,
        processingTime,
        onVitalSign,
        onFinalResults,
        onError,
        onWarning,
        onStateChange,
        orientation: DeviceOrientation.PORTRAIT,
        onImageData
      }

      const { error, data: faceSession } = await awaitWrap(
        monitor.createFaceSession(options)
      )

      if (error) {
        setError({ code: error.errorCode })
      } else {
        setSession(faceSession)
        setError({ code: -1 })
      }
    }

    initializeFaceSession()
    // eslint-disable-next-line
  }, [processingTime, isMonitorReady])

  useEffect(() => {
    if (startMeasuring) {
      if (sessionState === SessionState.ACTIVE) {
        session.start()
        setError({ code: -1 })
      }
    } else {
      sessionState === SessionState.MEASURING && session.stop()
    }
    // eslint-disable-next-line
  }, [startMeasuring])

  return {
    sessionState,
    vitalSigns: {
      pulseRate: {
        value: vitalSigns?.pulseRate?.value,
        isEnabled: enabledVitalSigns?.isEnabledPulseRate
      },
      respirationRate: {
        value: vitalSigns?.respirationRate?.value,
        isEnabled: enabledVitalSigns?.isEnabledRespirationRate
      },
      stress: {
        value: vitalSigns?.stressLevel?.value,
        isEnabled: enabledVitalSigns?.isEnabledStressLevel
      },
      stressIndex: {
        value: vitalSigns?.stressIndex?.value,
        isEnabled: enabledVitalSigns?.isEnabledStressIndex
      },
      hrvSdnn: {
        value: vitalSigns?.sdnn?.value,
        isEnabled: enabledVitalSigns?.isEnabledSdnn
      },
      spo2: {
        value: null, //TODO Spo2 is currently disabled by algo
        isEnabled: false //enabledVitalSigns?.isEnabledSpo2,
      },
      bloodPressure: {
        value: vitalSigns?.bloodPressure?.value,
        isEnabled: enabledVitalSigns?.isEnabledBloodPressure
      },
      wellnessLevel: {
        value: vitalSigns?.wellnessLevel?.value,
        isEnabled: enabledVitalSigns?.isEnabledWellnessLevel
      },
      hemoglobin: {
        value: vitalSigns?.hemoglobin?.value,
        isEnabled: enabledVitalSigns?.isEnabledHemoglobin
      },
      oxygenSaturation: {
        value: vitalSigns?.oxygenSaturation?.value,
        isEnabled: enabledVitalSigns?.isEnabledOxygenSaturation
      }
    },
    offlineMeasurements,
    error,
    warning,
    info,
    isMeasurementCompleted
  }
}

export default useMonitor
