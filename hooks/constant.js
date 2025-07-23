import { trackEvent } from '../helpers/analyticsHelper'

export const InfoType = {
  NONE: 'NONE',
  INSTRUCTION: 'INSTRUCTION',
  SUCCESS: 'SUCCESS'
}

export const VideoReadyState = {
  HAVE_ENOUGH_DATA: 4
}

export const DEFAULT_MEASUREMENT_DURATION = 60
export const MIN_MEASUREMENT_DURATION = 20
export const MAX_MEASUREMENT_DURATION = 180

export const handleAnalytics = (eventName, authorizationId) => {
  const properties = {
    external_id: authorizationId,
    app_name: 'wellness_tracker'
  }
  trackEvent(eventName, properties)
}

const STRESS_LEVEL = {
  0: 'UNKNOWN',
  1: 'Low',
  2: 'NORMAL',
  3: 'MILD',
  4: 'High',
  5: 'Extreme'
}

// Define color constants
const COLOR_NORMAL = '#89DD00'
const COLOR_BORDERLINE = '#F1CC09'
const COLOR_CRITICAL = '#FF7474'

export const getIndicatorPosition = (score) => {
  let percentage = 0
  if (score >= 0) {
    percentage = (score / 10) * 100
  }
  return percentage
}

export const getWellnessValue = (vitalSigns, key) => {
  if (key === 'stress') {
    if (!vitalSigns[key]?.value) {
      return 'UNKNOWN'
    }
    return STRESS_LEVEL[vitalSigns[key]?.value]
  }
  if (key === 'bloodPressure') {
    return `${vitalSigns[key]?.value?.systolic ?? 0}/${
      vitalSigns[key]?.value?.diastolic ?? 0
    }`
  }
  return vitalSigns[key]?.value ?? 0
}

export const getIndicatorColor = (vitalSigns, key) => {
  if (!vitalSigns || !key) {
    return COLOR_NORMAL
  }

  const scoreValue =
    key === 'bloodPressure'
      ? vitalSigns[key]?.value?.systolic
      : vitalSigns[key]?.value

  if (scoreValue === undefined) {
    return COLOR_NORMAL
  }

  switch (key) {
    case 'stress':
      if (scoreValue === 0 || scoreValue === 1) {
        return COLOR_NORMAL
      }
      return scoreValue <= 2 ? COLOR_BORDERLINE : COLOR_CRITICAL

    case 'hemoglobin':
      if (scoreValue < 11) {
        return COLOR_CRITICAL
      } else if (scoreValue <= 12.5) {
        return COLOR_BORDERLINE
      } else {
        return COLOR_NORMAL
      }

    case 'respirationRate':
      if (scoreValue < 10) {
        return COLOR_CRITICAL
      } else if (scoreValue < 12) {
        return COLOR_BORDERLINE
      } else if (scoreValue <= 20) {
        return COLOR_NORMAL
      } else {
        return COLOR_CRITICAL
      }

    case 'bloodPressure':
      if (scoreValue < 100) {
        return COLOR_CRITICAL
      } else if (scoreValue <= 110) {
        return COLOR_BORDERLINE
      } else if (scoreValue <= 125) {
        return COLOR_NORMAL
      } else if (scoreValue < 135) {
        return COLOR_BORDERLINE
      } else {
        return COLOR_CRITICAL
      }

    case 'pulseRate':
      if (scoreValue < 60) {
        return COLOR_CRITICAL
      } else if (scoreValue <= 100) {
        return COLOR_NORMAL
      } else if (scoreValue <= 120) {
        return COLOR_BORDERLINE
      } else {
        return COLOR_CRITICAL
      }

    default:
      return COLOR_NORMAL
  }
}
