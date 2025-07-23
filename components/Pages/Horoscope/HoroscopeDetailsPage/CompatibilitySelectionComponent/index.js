import React, { useState, useMemo } from 'react'
import './index.css'
import ZodiacSignCarousel from '../../ZodiacSignCarousel/ZodiacSignCarousel'
import {
  zodiacSigns,
  zodiacMobicomSigns
} from '../../../../../static/HoroscopeConstants'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../../context/AppContext'
import { trackEvent } from '../../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import {
  getTenantName,
  useFeatureAllowed
} from '../../../../../helpers/tenantHelper'
import { useTokenisationContext } from '../../../../../context/TokenisationContext'
import { useMvpAccessContext } from '../../../../../context/MvpAccessContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../../helpers/constant'
import { tenantType } from '../../../../../common/constants'
import { findByTransactionTriggerEvent } from '../../../../../helpers/helperFunctions'
import UnlockCTA from '../../../../TokenisationModal/UnlockCTA'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../../useTenantConfig'

const tenant = getTenantName()
const zodiacSignTenant =
  tenant === tenantType.mobicom ? zodiacMobicomSigns : zodiacSigns

const compatibilityEvent = 'USER_LOVE_COMPATIBILITY_UNLOCK'

const CompatibilitySelection = ({ initialUserSign, burnSpecDetails }) => {
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const {
    setTokenisationUseCaseType,
    setTokenisationUseCaseData,
    setWidgetComponentIds,
    setUnlockedMvpMetaData,
    setMvpMetaData,
    unlockPremiumContent
  } = useTokenisationContext()
  const { mvpAccessState, setMvpAccessState } = useMvpAccessContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const tokenDetails = useMemo(
    () => findByTransactionTriggerEvent(burnSpecDetails, compatibilityEvent),
    [burnSpecDetails]
  )

  const initialUserSignIndex = zodiacSignTenant.findIndex(
    (sign) => sign?.sign === initialUserSign
  )

  const [selectedFirstZodiacSign, setSelectedFirstZodiacSign] = useState(
    initialUserSign || zodiacSignTenant[0]?.sign
  )
  const [selectedSecondZodiacSign, setSelectedSecondZodiacSign] = useState(
    zodiacSignTenant[0]?.sign
  )

  const handleFirstSlideChange = (index) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_compatibility_top_swipe', properties)
    setSelectedFirstZodiacSign(zodiacSignTenant[index]?.sign)
  }

  const handleSecondSlideChange = (index) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_compatibility_bottom_swipe', properties)
    setSelectedSecondZodiacSign(zodiacSignTenant[index]?.sign)
  }

  const handleCompatibilitySignsSelected = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_check_compatibility_click', properties)
    setMvpAccessState((prev) => {
      const updatedMvpAccess = { ...prev }
      updatedMvpAccess.horoscope.loveCompatibility = true
      return updatedMvpAccess
    })
    window.history.replaceState(null, '', '/horoscope?scroll=loveCompatibility')
    navigate(
      `/horoscope/compatibility?user_sign=${selectedFirstZodiacSign}&partner_sign=${selectedSecondZodiacSign}`
    )
  }

  const tokenisedHandleCompatibilitySignSelection = (args, tokenAmount) => {
    if (
      isTokenisationEnabled &&
      !mvpAccessState?.horoscope?.loveCompatibility
    ) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
      setTokenisationUseCaseData({
        previewImage: `/images/tokenisation/horoscope_unlock.png`,
        title: 'Love Compatibility',
        icon: `/images/tokenisation/horoscope_unlock_icon.png`
      })
      setWidgetComponentIds([])
      const unlockData = {
        unlockedMvpName: 'Love Compatibility',
        redirectAction: handleCompatibilitySignsSelected,
        args: args
      }
      setUnlockedMvpMetaData(unlockData)
      const mvpMetaData = {
        user_event: `user_love_compatibility_unlock_click`,
        app_name: `daily_horoscope`,
        event: `user_love_compatibility_unlock_click`,
        swipe_depth: 0
      }
      setMvpMetaData(mvpMetaData)
      unlockPremiumContent(args, mvpMetaData, unlockData, tokenAmount)
    } else {
      handleCompatibilitySignsSelected(args)
    }
  }

  return (
    <div
      className='hs-compatibility-wrapper'
      style={{
        background: tenantLayout?.horoscope?.secondaryBgColor
      }}
    >
      <div className={`hs-comp-zs-first-carousel-wrapper align ${tenant}`}>
        <ZodiacSignCarousel
          initialSlide={initialUserSignIndex}
          textFirst={true}
          onSlideChange={handleFirstSlideChange}
        />
      </div>
      <div className='hs-comp-plus-icon-wrapper'>
        <img src='/images/horoscope/plus_icon.svg' alt='plus' />
      </div>
      <div className={`hs-comp-zs-second-carousel-wrapper align ${tenant}`}>
        <ZodiacSignCarousel onSlideChange={handleSecondSlideChange} />
      </div>
      <div
        className='hs-comp-submit-wrapper'
        onClick={() =>
          tokenisedHandleCompatibilitySignSelection(
            [selectedFirstZodiacSign, selectedSecondZodiacSign],
            tokenDetails?.token_amount
          )
        }
      >
        {!isTokenisationEnabled ||
        mvpAccessState?.horoscope?.loveCompatibility ? (
          <button className={`hs-comp-submit-button ${tenant}`}>
            {t('horoscope.loveCompatibility.check')}
          </button>
        ) : (
          <div className='hs-comic-read-more-card-btn'>
            <UnlockCTA eventData={tokenDetails} />
          </div>
        )}
      </div>
    </div>
  )
}

CompatibilitySelection.propTypes = {
  initialUserSign: PropTypes.string,
  burnSpecDetails: PropTypes.array
}

export default CompatibilitySelection
