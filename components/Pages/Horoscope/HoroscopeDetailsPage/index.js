import React, { useEffect, useRef, useMemo } from 'react'
import './index.css'
import CompatibilitySelection from './CompatibilitySelectionComponent'
import HoroscopeTodayCarousel from './HoroscopeTodayCarousel/HoroscopeTodayCarousel'
import {
  LUCKY_CHARM_TITLE,
  TAROT_DESCRIPTION,
  TAROT_TITLE,
  zodiacMnSignMap,
  zodiacMnToEnSignMap
} from '../../../../static/HoroscopeConstants'
import TarotCardSelection from './TarotCardSelection'
import LuckyCharmResult from './LuckyCharmResult'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  getTenantName,
  useFeatureAllowed
} from '../../../../helpers/tenantHelper'
import { tenantType } from '../../../../common/constants'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../useTenantConfig'

const tenant = getTenantName()

const transformSignName = (word) => {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

const getFormattedDate = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = today.toLocaleString('default', { month: 'long' })

  return { day: day, month: 'horoscope.monthNames.full.' + month.toLowerCase() }
}

const HoroscopeDetailsPage = ({ signData, handleSignChangeClick }) => {
  const { authorizationId } = useAppContext()
  const formattedDate = getFormattedDate()
  const transformedSignName = transformSignName(signData?.sign)
  const imageSignName = zodiacMnToEnSignMap[transformedSignName]
  const location = useLocation()
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )
  const loveCompatibilityRef = useRef(null)
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const tarotSelectionRef = useRef(null)
  const { getTokenSpecByAppName, burnSpecDetails } = useTokenisationContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const horoscopeTodayList = useMemo(
    () => [
      {
        key: 'Personal',
        value: 'personal',
        iconImage: tenantLayout?.horoscope?.iconImagePersonal,
        tokenEvent: 'USER_READ_MORE_PERSONAL_COSMIC_TIP'
      },
      {
        key: 'Health',
        value: 'health',
        iconImage: tenantLayout?.horoscope?.iconImageHealth,
        tokenEvent: 'USER_READ_MORE_HEALTH_COSMIC_TIP'
      },
      {
        key: 'Career',
        value: 'profession',
        iconImage: tenantLayout?.horoscope?.iconImageCareer,
        tokenEvent: 'USER_READ_MORE_PROFESSION_COSMIC_TIP'
      },
      {
        key: 'Emotions',
        value: 'emotions',
        iconImage: tenantLayout?.horoscope?.iconImageEmotion,
        tokenEvent: 'USER_READ_MORE_EMOTIONS_COSMIC_TIP'
      }
    ],
    [
      tenantLayout?.horoscope?.iconImagePersonal,
      tenantLayout?.horoscope?.iconImageHealth,
      tenantLayout?.horoscope?.iconImageCareer,
      tenantLayout?.horoscope?.iconImageEmotion
    ]
  )

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_lp_impression', properties)
    if (isTokenisationEnabled && authorizationId) {
      getTokenSpecByAppName({
        app_name: 'daily_horoscope'
      })
    }
    // eslint-disable-next-line
  }, [authorizationId])

  useEffect(() => {
    const scrollValue = queryParams.get('scroll')
    const scrollToRef = (ref) => {
      if (ref?.current) {
        setTimeout(() => {
          ref.current.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
    if (scrollValue === 'loveCompatibility') {
      scrollToRef(loveCompatibilityRef)
    } else if (scrollValue === 'tarotSelection') {
      scrollToRef(tarotSelectionRef)
    } else {
      window.scrollTo(0, 0)
    }
  }, [queryParams])

  let horoscopeTodayData = []

  if (signData?.prediction) {
    const predictions = signData?.prediction
    horoscopeTodayData = horoscopeTodayList.map((hs) => ({
      ...hs,
      prediction: predictions[hs?.value]
    }))
  }

  const cosmicTip = signData?.prediction?.luck?.find((text) =>
    text?.toLowerCase().includes('cosmic tip')
  )
  const cosmicTipText = cosmicTip?.replace('Cosmic Tip : ', '')

  const onSignChangeClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_edit_sign_click', properties)
    const handleSignChangeFlag =
      !isTokenisationEnabled || (isTokenisationEnabled && burnSpecDetails)
    if (handleSignChangeFlag) {
      handleSignChangeClick()
    }
  }

  return (
    <div
      className='hs-details-wrapper'
      style={{
        fontFamily: tenantLayout?.fonts?.horoscopePrimary
      }}
    >
      <div className={`hs-details-sign-bg-image-wrapper ${tenant}`}>
        <img
          src={`/images/horoscope/sign_bg_image/${tenant === tenantType.mobicom ? imageSignName : transformedSignName}.png`}
          alt=''
        />
      </div>
      <div className={`hs-daily-top-text-wrapper ${tenant}`}>
        <div className='hs-daily-date-text'>
          {tenantLayout?.horoscope?.dayDisplayFormatDDMM
            ? `${formattedDate?.day} ${t(formattedDate?.month)}, `
            : `${t(formattedDate?.month)} ${formattedDate?.day}, `}
          {tenant === tenantType.mobicom
            ? zodiacMnSignMap[transformedSignName]
            : transformedSignName}
          <img
            height='20px'
            width='20px'
            src='/images/horoscope/edit_icon.svg'
            alt='change'
            onClick={onSignChangeClick}
          />
        </div>
        <div
          className='hs-daily-main-text'
          style={{
            color: tenantLayout?.horoscope?.textColorPrimary
          }}
        >
          {cosmicTipText}
        </div>
      </div>

      <div
        className='hs-details-today-section'
        style={{
          color: tenantLayout?.horoscope?.textColorPrimary
        }}
      >
        {t('horoscope.today')}
      </div>
      <div className='hs-today-prediction-carousel-wrapper'>
        <HoroscopeTodayCarousel
          horoscopeTodayData={horoscopeTodayData}
          burnSpecDetails={burnSpecDetails || []}
        />
      </div>

      <div
        className='hs-compatibility-section-title'
        style={{
          color: tenantLayout?.horoscope?.textColorPrimary
        }}
        ref={loveCompatibilityRef}
        id='loveCompatibility'
      >
        {t('horoscope.loveCompatibility.title')}
      </div>
      <CompatibilitySelection
        initialUserSign={transformedSignName}
        burnSpecDetails={burnSpecDetails || []}
      />
      <div
        className='hp-dp-lucky-charm-wrapper'
        style={{
          background: tenantLayout?.horoscope?.tertiaryBgColor
        }}
      >
        <div
          className='hp-dp-lucky-charm-title'
          style={{
            color: tenantLayout?.horoscope?.textColorPrimary
          }}
        >
          {t(LUCKY_CHARM_TITLE)}
        </div>
        <div className='hp-dp-lucky-charm-card-wrapper'>
          <LuckyCharmResult
            luck={signData?.prediction?.luck}
            special={signData?.special?.lucky_color_codes}
            burnSpecDetails={burnSpecDetails || []}
          />
        </div>
      </div>

      <div
        className='hs-dp-section-wrapper'
        style={{
          background: tenantLayout?.horoscope?.tertiaryBgColor
        }}
      >
        <div className='hs-dp-tarot-card-section'>
          <div
            className='hs-dp-tarot-card-section-header'
            style={{
              color: tenantLayout?.horoscope?.textColorPrimary
            }}
            ref={tarotSelectionRef}
          >
            {t(TAROT_TITLE)}
          </div>
          <div
            className='hs-dp-tarot-card-section-selection'
            style={{
              background: tenantLayout?.horoscope?.secondaryBgColor
            }}
          >
            <div className='hs-dp-tarot-card-body'>
              <div className='hs-dp-tarot-card-section-desc'>
                {t(TAROT_DESCRIPTION)}
              </div>
              <TarotCardSelection burnSpecDetails={burnSpecDetails || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

HoroscopeDetailsPage.propTypes = {
  signData: PropTypes.shape({
    sign: PropTypes.string,
    prediction: PropTypes.shape({
      luck: PropTypes.array,
      find: PropTypes.func
    }),
    special: PropTypes.shape({
      lucky_color_codes: PropTypes.array
    })
  }),
  handleSignChangeClick: PropTypes.func
}

export default HoroscopeDetailsPage
