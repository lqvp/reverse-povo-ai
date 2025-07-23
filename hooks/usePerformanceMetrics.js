import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { trackEvent } from '../helpers/analyticsHelper'
import { getTenantName } from '../helpers/tenantHelper'

const tenant = getTenantName()

const usePerformanceMetrics = () => {
  const { authorizationId } = useAppContext()
  const sendToGTM = (key, value) => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId || 'NA',
        tenant: tenant || 'NA',
        [key]: value
      }
      trackEvent('performance_metrics', properties)
    }
  }

  useEffect(() => {
    // Get Internet Speed & Connection Type
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection
    const internetSpeed = connection?.downlink ?? 'NA'
    const connectionType = connection?.effectiveType ?? 'unknown'

    sendToGTM('internet_speed', internetSpeed)
    sendToGTM('connection_type', connectionType)

    // FCP Observer
    const fcpObserver = new PerformanceObserver((entryList) => {
      const fcpEntry = entryList
        .getEntries()
        .find((entry) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        sendToGTM('fcp', Math.round(fcpEntry.startTime))
      }
    })
    fcpObserver.observe({ type: 'paint', buffered: true })

    // LCP Observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const lastEntry = entryList.getEntries().pop()
      if (lastEntry) {
        sendToGTM('lcp', Math.round(lastEntry.startTime))
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // DOM Content Loaded Time
    const domContentLoadedTime = Math.round(
      performance.timing.domContentLoadedEventEnd -
        performance.timing.navigationStart
    )
    sendToGTM('dom_content_loaded', domContentLoadedTime)

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
    }
    // eslint-disable-next-line
  }, [authorizationId])
}

export default usePerformanceMetrics
