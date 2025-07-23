import React from 'react'
import './index.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CrossIcon from '../../../../static/CrossIcon'
import { axiosPost } from '../../../../utils/axios'
import common from '@kelchy/common'
import { useAppContext } from '../../../../context/AppContext'
import { useEffect } from 'react'
import Loader from '../../../Loader/Loader'
import { useCallback } from 'react'
import { transformTitleCase } from '../../../../helpers/helperFunctions'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'
import { getTenantName } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'
import { useTranslation } from 'react-i18next'

const tenant = getTenantName()

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
    trackEvent('horoscope_tarot_result_read_more_clicks', properties)
    setIsRevealed(true)
  }

  return (
    <div
      className='hp-tarot-dp-card-desc-wrapper'
      style={{
        background: tenantLayout?.horoscope?.contentBgColor
      }}
    >
      <div className='hp-tarot-dp-card-title'>
        <div className='hp-tarot-dp-card-title-icon-wrapper'>
          <img
            src={cardDetail?.iconImage}
            alt=''
            height='20px'
            width='20px'
          ></img>
        </div>
        <div
          className='hp-tarot-dp-card-title-text'
          style={{
            color: tenantLayout?.horoscope?.textColor
          }}
        >
          {t(cardDetail?.key)}
        </div>
      </div>
      <div className={`hp-tarot-dp-card-desc ${isRevealed ? 'active' : ''}`}>
        <div>{cardDetail?.desc}</div>
        <div className={`hp-tarot-dp-card-btn ${tenant}`}>
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
    desc: PropTypes.string,
    iconImage: PropTypes.string
  }),
  authorizationId: PropTypes.string
}

const TarotDetailsPage = () => {
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [dailyTarotResult, setDailyTarotResult] = useState(null)
  const [dailyTarotCardDesc, setDailyTarotCardDesc] = useState(null)
  const tenantLayout = useTenantConfig(tenant)
  const { t } = useTranslation('common')

  useEffect(() => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        app_name: 'horoscope'
      }
      trackEvent('horoscope_tarot_results_impression', properties)
    }
  }, [authorizationId])

  const getDailyTarotResult = useCallback(async () => {
    setIsLoading(true)
    const body = {}
    const headers = {}
    const { data: dailyTarotResult, error: dailyTarotError } =
      await common.awaitWrap(axiosPost(`/horoscope/daily_tarot`, body, headers))

    if (dailyTarotError) {
      console.error('Error in getting daily tarot result:', dailyTarotError)
      setIsLoading(false)
      return
    }
    if (dailyTarotResult?.data?.data) {
      setDailyTarotResult(dailyTarotResult?.data?.data)
      setDailyTarotCardDesc([
        {
          key: 'horoscope.tarotSection.love',
          desc: dailyTarotResult?.data?.data?.love,
          iconImage: tenantLayout?.horoscope?.iconImageLove
        },
        {
          key: 'horoscope.tarotSection.career',
          desc: dailyTarotResult?.data?.data?.career,
          iconImage: tenantLayout?.horoscope?.iconImageCareer
        },
        {
          key: 'horoscope.tarotSection.finance',
          desc: dailyTarotResult?.data?.data?.finance,
          iconImage: tenantLayout?.horoscope?.iconImageFinance
        },
        {
          key: 'horoscope.tarotSection.health',
          desc: dailyTarotResult?.data?.data?.health,
          iconImage: '/images/horoscope/health_icon.svg'
        }
      ])
    }
    setIsLoading(false)
  }, [
    tenantLayout?.horoscope?.iconImageLove,
    tenantLayout?.horoscope?.iconImageCareer,
    tenantLayout?.horoscope?.iconImageFinance
  ])

  useEffect(() => {
    getDailyTarotResult()
  }, [getDailyTarotResult])

  const handleCloseClick = () => {
    navigate(-1)
  }

  const returnToHoroscopePage = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_pick_new_card_click', properties)
    navigate(-1)
  }

  return (
    <div
      className='hs-tarot-dp-bg-wrapper'
      style={{
        background: tenantLayout?.horoscope?.bgColor
      }}
    >
      {isLoading && <Loader />}
      <div
        className='hs-tarot-dp-wrapper'
        style={{
          fontFamily: tenantLayout?.fonts?.horoscopePrimary
        }}
      >
        <div className='hs-tarot-dp-close-btn' onClick={handleCloseClick}>
          <CrossIcon fill={'#FFFFFF'} />
        </div>
        <div className='hs-tarot-dp-card-header'>
          <h1>{transformTitleCase(dailyTarotResult?.card)}</h1>
          <div>
            {t('horoscope.tarotSection.category')}: {dailyTarotResult?.category}
          </div>
          <img alt='Not available' src={dailyTarotResult?.image} />
        </div>
        {tenantLayout?.horoscope && (
          <div className='hs-tarot-dp-card-desc'>
            {dailyTarotCardDesc?.map(
              (card) =>
                card?.desc && (
                  <TarotDetailCard
                    key={card?.key}
                    cardDetail={card}
                    authorizationId={authorizationId}
                  />
                )
            )}
          </div>
        )}
        <div className={`hs-tarot-dp-pick-new-btn ${tenant}`}>
          <button onClick={returnToHoroscopePage}>
            {t('horoscope.tarotSection.pickANewCard')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TarotDetailsPage
