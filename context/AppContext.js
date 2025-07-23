import React, { createContext, useContext, useEffect, useState } from 'react'
import { getConfigForHostname, getTenantName } from '../helpers/tenantHelper'
import { getExternalIdFromParams } from '../helpers/helperFunctions'
import common from '@kelchy/common'
import { axiosGet } from '../utils/axios'
import Loader from '../components/Loader/Loader'
import PropTypes from 'prop-types'
import { fetchNewXAuth } from '../helpers/getXAuthFromBridge'
import { setXAuthCookie } from '../helpers/webBridgeHelper'
import { EnvironmentDomainMap } from '../helpers/constant'
import { tenantType } from '../common/constants'

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({
  children,
  isWidget = false,
  exploreExternalId
}) => {
  const [authorizationId, setAuthorizationId] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorizationError, setAuthorizationError] = useState(false)
  const [newXAuthFetched, setNewXAuthFetched] = useState(null)

  const { environment } = getConfigForHostname()

  const getCookies = async (externalId) => {
    let headers = {}
    if (externalId) {
      headers = { Authorization: externalId }
    }
    const { data: verifyCookieResponse, error: verifyCookieError } =
      await common.awaitWrap(axiosGet('/verify', { headers }))
    setLoading(false)
    if (verifyCookieError) {
      setAuthorizationError(true)
      console.error(
        'Error in starting the app in browser with custom cookie',
        verifyCookieError
      )
      if (tenant === tenantType.sgcircles) {
        const { data: newXAuth, error: xAuthRefetchError } =
          await common.awaitWrap(fetchNewXAuth())
        if (!xAuthRefetchError) {
          setNewXAuthFetched(newXAuth)
        }
      }
    } else {
      const externalId = verifyCookieResponse?.data?.externalId
      setAuthorizationId(externalId)
    }
  }

  useEffect(() => {
    if (newXAuthFetched) {
      setXAuthCookie(newXAuthFetched, EnvironmentDomainMap?.[environment])
      getCookies()
    }
    // eslint-disable-next-line
  }, [newXAuthFetched])

  useEffect(() => {
    const externalId = getExternalIdFromParams()
    // limit the the verify api is called to 1
    if (isWidget) {
      const isVerifyApiCalled = sessionStorage.getItem('isVerifyApiCalled')
      if (!isVerifyApiCalled) {
        getCookies(externalId)
        sessionStorage.setItem('isVerifyApiCalled', true)
      } else {
        setAuthorizationId(exploreExternalId)
        setLoading(false)
      }
    } else {
      getCookies(externalId)
    }

    const tenantName = getTenantName()
    setTenant(tenantName)
    sessionStorage.setItem('tenant', tenantName)
    // eslint-disable-next-line
  }, [isWidget, exploreExternalId])

  return (
    <AppContext.Provider
      value={{
        authorizationId,
        tenant,
        authorizationError,
        authInProgress: loading
      }}
    >
      {loading ? <>{isWidget ? '' : <Loader />}</> : children}
    </AppContext.Provider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isWidget: PropTypes.bool,
  exploreExternalId: PropTypes.string
}
