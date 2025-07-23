import React, { useEffect, useState, useCallback } from 'react'
import './index.css'
import ZodiacSelectionPage from './ZodiacSelectionPage'
import CrossIcon from '../../../static/CrossIcon'
import HoroscopeDetailsPage from './HoroscopeDetailsPage'
import common from '@kelchy/common'
import { axiosPost } from '../../../utils/axios'
import Loader from '../../Loader/Loader'
import { useLocation, useNavigate } from 'react-router-dom'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { getTenantName, useFeatureAllowed } from '../../../helpers/tenantHelper'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import TokenHeader from '../../TokenHeader/TokenHeader'
import { useTenantConfig } from '../../../useTenantConfig'

const tenant = getTenantName()

const Horoscope = () => {
  const [signSelected, setSignSelected] = useState('')
  const [isSelectPageShow, setSelectPageShow] = useState(true)
  const [signData, setSignData] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()
  const location = useLocation()
  const tenantLayout = useTenantConfig(tenant)

  const getSignData = useCallback(
    async (sign) => {
      if (sign) {
        setSignSelected(sign)
      }
      const body = {
        sign: (sign || signSelected)?.toUpperCase() || ''
      }
      setIsLoading(true)
      const { data: dailyHoroscopeApiResponse } = await common.awaitWrap(
        axiosPost('/horoscope/daily_horoscope', body)
      )
      if (dailyHoroscopeApiResponse?.data) {
        setSelectPageShow(false)
        setSignData(dailyHoroscopeApiResponse?.data?.data)
      } else {
        setSelectPageShow(true)
      }
      setIsLoading(false)
    },
    [signSelected]
  )

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_daily_horoscope_impression`,
        app_name: `daily_horoscope`,
        event: `user_engaged_daily_horoscope`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  useEffect(() => {
    getSignData()
  }, [getSignData])

  const handleSignChangeClick = (param = 'scroll') => {
    window.history.replaceState(null, '', '/horoscope')
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete(param)
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    })
    setSelectPageShow(true)
  }

  const handleCloseClick = () => {
    if (isSelectPageShow && signData) {
      setSelectPageShow(false)
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className='hs-app-wrapper'
      style={{
        fontFamily: tenantLayout?.fonts?.horoscopePrimary,
        background: tenantLayout?.horoscope?.bgColor
      }}
    >
      {isTokenisationEnabled && <TokenHeader background='#000000' />}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className='hs-app-header'>
            <div className='hs-app-close-icon' onClick={handleCloseClick}>
              <CrossIcon fill={'#FFFFFF'} />
            </div>
          </div>
          {isSelectPageShow ? (
            <ZodiacSelectionPage handleSignSelected={getSignData} />
          ) : (
            <HoroscopeDetailsPage
              signData={signData}
              handleSignChangeClick={handleSignChangeClick}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Horoscope
