import React, { useEffect, useState, useCallback, useMemo } from 'react'
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import CrossIcon from '../../../../static/CrossIcon'
import {
  zodiacSigns,
  zodiacMobicomSigns
} from '../../../../static/HoroscopeConstants'
import Loader from '../../../Loader/Loader'
import common from '@kelchy/common'
import { axiosPost } from '../../../../utils/axios'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import { tenantType } from '../../../../common/constants'
import { getTenantName } from '../../../../helpers/tenantHelper'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../useTenantConfig'

const tenant = getTenantName()
const zodiacSignTenant =
  tenant === tenantType.mobicom ? zodiacMobicomSigns : zodiacSigns

const TarotDetailCard = ({ cardDetail, authorizationId }) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const handleReadMoreClick = () => {
    const properties = {
      external_id: authorizationId,
      section_title: cardDetail?.key,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_compatibility_result_read_more_clicks', properties)
    setIsRevealed(true)
  }

  return (
    <div
      className='hs-cd-data-card-desc-wrapper'
      style={{
        background: tenantLayout?.horoscope?.contentBgColor
      }}
    >
      <div className='hs-cd-data-card-title-wrapper'>
        {cardDetail?.iconImage ? (
          <div className='hs-cd-data-card-title-icon-wrapper'>
            <img
              src={cardDetail?.iconImage}
              alt=''
              height='20px'
              width='20px'
            ></img>
          </div>
        ) : null}
        <div
          className='hs-cd-data-card-title-text'
          style={{
            color: tenantLayout?.horoscope?.textColor
          }}
        >
          {t(cardDetail?.name)}
        </div>
      </div>
      <div className={`hs-cd-data-card-desc ${isRevealed ? 'active' : ''}`}>
        <div>{cardDetail?.desc}</div>
        <div className={`hs-cd-data-card-btn ${tenant}`}>
          <button onClick={handleReadMoreClick}>
            {t('horoscope.tarotSection.readMore')}
          </button>
        </div>
      </div>
    </div>
  )
}

TarotDetailCard.propTypes = {
  cardDetail: PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    iconImage: PropTypes.string,
    desc: PropTypes.string
  }).isRequired,
  authorizationId: PropTypes.string
}

const HoroscopeCompatibilityPage = () => {
  const [firstSign, setFirstSign] = useState(null)
  const [secondSign, setSecondSign] = useState(null)
  const [compatibilityData, setCompatibilityData] = useState(null)
  const [compatibilityScore, setCompatibilityScore] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_compatibility_results_impression', properties)
  }, [authorizationId])

  const getCompabilityData = useCallback(
    async (sign1, sign2) => {
      const body = {
        sign1: sign1,
        sign2: sign2
      }
      setIsLoading(true)
      const { data: compatibilityApiResponse } = await common.awaitWrap(
        axiosPost('/horoscope/love_compatibility', body)
      )
      if (compatibilityApiResponse?.data?.data) {
        setCompatibilityData([
          {
            key: 'ideal_date',
            name: 'horoscope.loveCompatibility.idealDate',
            desc: compatibilityApiResponse?.data?.data?.ideal_date
          },
          {
            key: 'strengths',
            name: 'horoscope.loveCompatibility.strengths',
            iconImage: tenantLayout?.horoscope?.iconImageThumbsUp,
            desc: compatibilityApiResponse?.data?.data?.positive_aspects
          },
          {
            key: 'weaknesses',
            name: 'horoscope.loveCompatibility.weaknesses',
            iconImage: tenantLayout?.horoscope?.iconImageThumbsDown,
            desc: compatibilityApiResponse?.data?.data?.negative_aspects
          }
        ])
        setCompatibilityScore([
          {
            key: 'horoscope.loveCompatibility.love',
            score: compatibilityApiResponse?.data?.data?.score?.general,
            color: '#DD4948',
            gradient:
              'linear-gradient(230deg, rgba(34, 36, 42, 0.70) 25.76%, rgba(227, 82, 81, 0.70) 112.67%)'
          },
          {
            key: 'horoscope.loveCompatibility.connection',
            score: compatibilityApiResponse?.data?.data?.score?.communication,
            color: '#48BFD3',
            gradient:
              'linear-gradient(233deg, rgba(34, 36, 42, 0.70) 26.88%, rgba(72, 191, 211, 0.70) 114.97%)'
          },
          {
            key: 'horoscope.loveCompatibility.sex',
            score: compatibilityApiResponse?.data?.data?.score?.sex,
            color: '#CFA044',
            gradient:
              'linear-gradient(229deg, rgba(34, 36, 42, 0.70) 24.25%, rgba(206, 161, 70, 0.70) 119.82%)'
          }
        ])
      }
      setIsLoading(false)
    },
    [
      setCompatibilityData,
      setCompatibilityScore,
      setIsLoading,
      tenantLayout?.horoscope?.iconImageThumbsDown,
      tenantLayout?.horoscope?.iconImageThumbsUp
    ]
  )

  useEffect(() => {
    const userSign = queryParams.get('user_sign')
    const partnerSign = queryParams.get('partner_sign')
    if (!userSign || !partnerSign) {
      navigate(-1)
    }
    getCompabilityData(userSign, partnerSign)

    const userSignData = zodiacSignTenant.find(
      (sign) => sign?.sign === userSign
    )
    const partnerSignData = zodiacSignTenant.find(
      (sign) => sign?.sign === partnerSign
    )
    setFirstSign(userSignData)
    setSecondSign(partnerSignData)
  }, [queryParams, navigate, getCompabilityData])

  const handleCloseClick = () => {
    navigate(-1)
  }

  const handleCheckNewPairClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_check_new_pairing_click', properties)
    navigate(-1)
  }

  return (
    <div
      className='hs-comp-details-bg-wrapper'
      style={{
        background: tenantLayout?.horoscope?.bgColor
      }}
    >
      {isLoading && !tenantLayout?.horoscope && <Loader />}

      <div
        className='hs-comp-details-wrapper'
        style={{
          fontFamily: tenantLayout?.fonts?.horoscopePrimary
        }}
      >
        <div className='hs-cd-close-icon-wrapper'>
          <div className='hs-cd-close-icon' onClick={handleCloseClick}>
            <CrossIcon fill={'#FFFFFF'} />
          </div>
        </div>
        <div
          className='hs-cd-section-title'
          style={{
            color: tenantLayout?.horoscope?.textColorPrimary
          }}
        >
          {t('horoscope.loveCompatibility.title')}
        </div>
        <div className='hs-cd-sign-images-container'>
          <div className='hs-cd-sign-image-wrapper'>
            <img
              className={`hs-cd-sign-image ${tenant}`}
              src={firstSign?.sign_image}
              alt={firstSign?.sign}
            />
          </div>
          <div className='hs-cd-sign-plus-image-wrapper'>
            <img
              className='hs-cd-sign-plus-image'
              src='/images/horoscope/plus_icon.svg'
              alt='plus'
            />
          </div>
          <div className='hs-cd-sign-image-wrapper'>
            <img
              className={`hs-cd-sign-image ${tenant}`}
              src={secondSign?.sign_image}
              alt={secondSign?.sign}
            />
          </div>
        </div>
        <div className='hs-cd-score-wrapper'>
          {compatibilityScore?.map((data, index) => (
            <div
              key={`${index}-${data?.key}`}
              className='hs-cd-score-item-box'
              style={{ background: data?.gradient }}
            >
              <div className='hs-cd-score-name'>{t(data?.key)}</div>
              <div className='hs-cd-score-progress-bar-container'>
                <div
                  className='hs-cd-score-progress-bar-fill'
                  style={{
                    backgroundColor: data?.color,
                    width: `${data?.score * 10}%`
                  }}
                ></div>
              </div>
              <div className='hs-cd-score-perc-text'>{data?.score * 10}%</div>
            </div>
          ))}
        </div>
        {tenantLayout?.horoscope && (
          <div className='hs-cd-data-wrapper'>
            {compatibilityData?.map((data) => (
              <TarotDetailCard
                key={data?.key}
                cardDetail={data}
                authorizationId={authorizationId}
              />
            ))}
          </div>
        )}
        <div className='hs-cd-check-new-wrapper'>
          <button
            className={`hs-cd-check-new-button ${tenant}`}
            onClick={() => handleCheckNewPairClick()}
            style={{
              width: tenantLayout?.horoscope?.ctaWidth
            }}
          >
            {t('horoscope.loveCompatibility.checkNewPairing')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HoroscopeCompatibilityPage
