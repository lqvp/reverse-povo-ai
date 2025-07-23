import { getConfigForHostname } from './tenantHelper'

const { tenant } = getConfigForHostname()
export const redirectionHandler = (component, externalId, environment) => {
  const url = component?.redirectUrl[environment || 'localhost']
  if (!url) return false
  switch (component?.type) {
    case 'link':
    case 'deeplink':
      if (typeof url === 'string') {
        window.location.assign(url)
      } else {
        window.location.assign(url[environment])
      }
      return true
    case 'linkWithTenant': {
      let redirectionURL = url
      if (redirectionURL) {
        const delimiter = redirectionURL.includes('?') ? '&' : '?'
        redirectionURL += tenant ? `${delimiter}tenant=${tenant}` : ''
      }
      if (typeof redirectionURL === 'string') {
        window.location.assign(redirectionURL)
      } else {
        window.location.assign(redirectionURL[environment])
      }
      return true
    }

    case 'linkWithMSISDN': {
      const msisdnCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('msisdn='))
      const msisdn = msisdnCookie ? msisdnCookie.split('=')[1] : null
      let redirectionURL = url
      if (redirectionURL) {
        const delimiter = redirectionURL.includes('?') ? '&' : '?'
        redirectionURL += msisdn ? `${delimiter}custParam=${msisdn}` : ''
      }
      window.location.assign(redirectionURL)
      return true
    }

    case 'linkWithId':
      if (typeof url === 'string') {
        window.location.assign(
          `${url}/?id=${externalId != null ? externalId : 'null'}`
        )
      } else {
        window.location.assign(
          `${url[environment]}/?id=${externalId != null ? externalId : 'null'}`
        )
      }
      return true

    case 'openInBrowser':
      if (typeof url === 'string') {
        window.open(url, '_blank')
      } else {
        window.open(url[environment], '_blank')
      }
      return true

    default:
      return false
  }
}
