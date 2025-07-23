import clevertap from 'clevertap-web-sdk'
import { getConfigForHostname, getTenantName } from './tenantHelper'

const tenantName = getTenantName()
const { googleAnalyticsFlag, clevertapFlag } = getConfigForHostname()

export const trackEvent = (eventName, properties) => {
  properties['external_id'] = properties?.external_id || 'ext_id_not_found'

  if (clevertapFlag) {
    clevertap.event.push(eventName, { ...properties, tenant: tenantName })
  }
  if (googleAnalyticsFlag) {
    window.dataLayer.push({
      event: eventName,
      ...properties,
      tenant: tenantName
    })
  }
}
