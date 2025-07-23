import {
  FALLBACK_NEWS_IMAGE_PROD,
  FALLBACK_NEWS_IMAGE_STAGING,
  POLLING_GAME_PROD_API,
  POLLING_GAME_STAGING_API
} from '../common/constants'

export const getBaseUrl = () => {
  const hostName = window.location.hostname
  if (hostName?.includes('circleslife.co')) {
    return 'https://aistore-api.circleslife.co'
  } else if (hostName?.includes('circles.life')) {
    return 'https://aistore-api.circles.life'
  } else {
    return 'http://localhost:8080'
  }
}

// Get polling game api host url
export const getPollingGameBaseUrl = () => {
  const hostName = window.location.hostname
  if (hostName?.includes('circleslife.co')) {
    return POLLING_GAME_STAGING_API
  } else if (hostName?.includes('circles.life')) {
    return POLLING_GAME_PROD_API
  } else {
    return 'http://localhost:3080'
  }
}

// Get fallback news image
export const getFallbackNewsImage = () => {
  const hostName = window.location.hostname
  if (hostName?.includes('circleslife.co')) {
    return FALLBACK_NEWS_IMAGE_STAGING
  } else if (hostName?.includes('circles.life')) {
    return FALLBACK_NEWS_IMAGE_PROD
  } else {
    return 'http://localhost:3080'
  }
}

export const isAgentIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

// Check if the email is valid
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// filter data by platform compatibility
export const filterByDeviceCompatibility = (data, isBanner = false) => {
  const isIOS = isAgentIOS()

  return data?.filter((item) => {
    if (item?.restrictToPlatform) {
      const { ios, android } = item.restrictToPlatform || {}

      const isPlatformCompatible = isIOS
        ? ios && ios.showOnPlatform
        : android && android.showOnPlatform

      return isPlatformCompatible && item.enabled !== false
    }

    return isBanner ? item.enabled !== false : false
  })
}

export const parseStreamData = (data) => {
  /* eslint-disable no-restricted-syntax */
  try {
    const jsonData = JSON.parse(data)
    return { json: jsonData }
  } catch (error) {
    // If parsing fails, look for JSON inside a mixed string
    const jsonStart = data.indexOf('{')
    const jsonEnd = data.lastIndexOf('}')

    if (jsonStart !== -1 && jsonEnd !== -1) {
      let jsonString = data.slice(jsonStart, jsonEnd + 1)
      const text = data.slice(0, jsonStart).trim()

      try {
        /* eslint-disable no-control-regex */
        jsonString = jsonString.replace(/[\u0000-\u001F\u007F]/g, '')
        jsonString = jsonString.replace(/([^\\])\n/g, '$1\\n')
        const jsonData = JSON.parse(jsonString)
        return { text, json: jsonData }
      } catch (jsonError) {
        return {}
      }
    }
  }
  /* eslint-disable no-restricted-syntax */

  // Return as plain text if no JSON is found
  return { text: data }
}

export const getUserCurrentTimeandTimeZone = () => {
  const date = new Date()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const currentTime = date.toLocaleString('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const userTimeWithTimeZone = `${currentTime} ${timeZone}`
  return userTimeWithTimeZone
}
