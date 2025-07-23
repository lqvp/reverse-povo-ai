import { WebbridgePlatformType } from './constant'

export const getWebbridgePlatform = () => {
  if (
    window?.AndroidShareHandlerV1?.refreshXAuthToken ||
    window?.AndroidShareHandler?.refreshXAuthToken
  ) {
    return WebbridgePlatformType.ANDROID
  } else if (window.webkit?.messageHandlers?.refreshXAuthTokenHandler) {
    return WebbridgePlatformType.IOS
  } else if (window.location.hostname.includes('localhost')) {
    return WebbridgePlatformType.DEV
  } else {
    return WebbridgePlatformType.UNSUPPORTED
  }
}

export function parseAndroidAuthObj(jsonString) {
  return JSON.parse(jsonString)
}

export const setXAuthCookie = (xAuth, domain, sameSite) => {
  document.cookie = `x-auth=${xAuth};Domain=${domain};Secure${sameSite ? `;SameSite=${sameSite}` : ''}`
}

export const CookieSameSite = {
  NONE: 'None',
  STRICT: 'Strict',
  LAX: 'Lax'
}
