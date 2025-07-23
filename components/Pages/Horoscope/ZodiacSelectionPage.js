import React, { useEffect, useState } from 'react'
import ZodiacSignCarousel from './ZodiacSignCarousel/ZodiacSignCarousel'
import {
  zodiacSigns,
  zodiacMobicomSigns
} from '../../../static/HoroscopeConstants'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { getTenantName, useFeatureAllowed } from '../../../helpers/tenantHelper'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import { useMvpAccessContext } from '../../../context/MvpAccessContext'
import { tenantType } from '../../../common/constants'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../useTenantConfig'

const tenant = getTenantName()
const zodiacSignTenant =
  tenant === tenantType.mobicom ? zodiacMobicomSigns : zodiacSigns

const ZodiacSelectionPage = ({ handleSignSelected }) => {
  const { authorizationId } = useAppContext()
  const [selectedZodiacSign, setSelectedZodiacSign] = useState(
    zodiacSignTenant[0]?.sign
  )
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const {
    setIsTokenisationModelOpen,
    setTokenisationUseCaseType,
    setTokenisationUseCaseData,
    getTokenSpec,
    setWidgetComponentIds,
    setUnlockedMvpMetaData
  } = useTokenisationContext()
  const { mvpAccessState, setMvpAccessState } = useMvpAccessContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const modifyMvpAccessState = () => {
    setMvpAccessState((prev) => {
      const updatedMvpAccess = { ...prev }
      updatedMvpAccess.horoscope = {
        dailyHoroscope: true
      }
      return updatedMvpAccess
    })
    handleSignSelected(selectedZodiacSign)
  }

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_choose_sign_impression', properties)
  }, [authorizationId])

  const handleSlideChange = (index) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_choose_sign_swipe', properties)

    setSelectedZodiacSign(zodiacSignTenant[index]?.sign)
  }

  const handleSignSelectionPropagate = () => {
    if (isTokenisationEnabled && !mvpAccessState?.horoscope?.dailyHoroscope) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
      setIsTokenisationModelOpen(true)
      setTokenisationUseCaseData({
        previewImage: `/images/tokenisation/horoscope_unlock.png`,
        title: 'Daily Horoscope',
        icon: `/images/tokenisation/horoscope_unlock_icon.png`
      })
      setWidgetComponentIds([])
      setUnlockedMvpMetaData({
        unlockedMvpName: 'Daily Horoscope',
        redirectAction: modifyMvpAccessState
      })
      getTokenSpec(
        {
          user_event: `user_daily_horoscope_unlock_click`,
          app_name: `horoscope`,
          event: `user_daily_horoscope_unlock_click`,
          swipe_depth: 0
        },
        true
      )
    } else {
      handleSignSelected(selectedZodiacSign)
    }
  }

  return (
    <div
      className='hs-onboarding-wrapper'
      style={{
        fontFamily: tenantLayout?.fonts?.horoscopePrimary
      }}
    >
      <div className='hs-onboarding-zs-carousel-container'>
        <div className='hs-onboarding-zs-carousel-title'>
          {t('horoscope.signSelection.title')}
        </div>
        <div className={`hs-onboarding-zs-carousel-wrapper align ${tenant}`}>
          <ZodiacSignCarousel onSlideChange={handleSlideChange} />
        </div>
      </div>
      <div className='hs-onboarding-submit-wrapper'>
        <button
          className={`hs-onboarding-submit-button ${tenant}`}
          onClick={handleSignSelectionPropagate}
        >
          {t('horoscope.signSelection.CTA')}
        </button>
      </div>
    </div>
  )
}

ZodiacSelectionPage.propTypes = {
  handleSignSelected: PropTypes.func,
  mvpAccessState: PropTypes.object
}

export default ZodiacSelectionPage
