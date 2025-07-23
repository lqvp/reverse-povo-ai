import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTarotDetailsPath } from '../../../../common/paths'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useMvpAccessContext } from '../../../../context/MvpAccessContext'
import { useTokenisationContext } from '../../../../context/TokenisationContext'
import { useFeatureAllowed } from '../../../../helpers/tenantHelper'
import { TOKENISATION_USE_CASE_TYPE } from '../../../../helpers/constant'
import { findByTransactionTriggerEvent } from '../../../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import UnlockCTA from '../../../TokenisationModal/UnlockCTA'

const dailyTarotEvent = 'USER_DAILY_TAROT_UNLOCK'

const TarotCardSelection = ({ burnSpecDetails }) => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
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

  const tokenDetails = useMemo(
    () => findByTransactionTriggerEvent(burnSpecDetails, dailyTarotEvent),
    [burnSpecDetails]
  )

  const handleTarotCardSelectedChange = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'horoscope'
    }
    trackEvent('horoscope_tarot_card_click', properties)
    setMvpAccessState((prev) => {
      const updatedMvpAccess = { ...prev }
      updatedMvpAccess.horoscope.dailyTarot = true
      return updatedMvpAccess
    })
    window.history.replaceState(null, '', '/horoscope?scroll=tarotSelection')
    navigate(getTarotDetailsPath())
  }

  const tokenisedHandleTarotCardSelection = (args, tokenAmount) => {
    if (isTokenisationEnabled && !mvpAccessState?.horoscope?.dailyTarot) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.premiumContent)
      setTokenisationUseCaseData({
        previewImage: `/images/tokenisation/horoscope_unlock.png`,
        title: 'Daily Tarot',
        icon: `/images/tokenisation/horoscope_unlock_icon.png`
      })
      setWidgetComponentIds([])
      const unlockData = {
        unlockedMvpName: 'Daily Tarot',
        redirectAction: handleTarotCardSelectedChange,
        args: args
      }
      setUnlockedMvpMetaData(unlockData)
      const mvpMetaData = {
        user_event: `user_daily_tarot_unlock_click`,
        app_name: `daily_horoscope`,
        event: `user_daily_tarot_unlock_click`,
        swipe_depth: 0
      }
      setMvpMetaData(mvpMetaData)
      unlockPremiumContent(args, mvpMetaData, unlockData, tokenAmount)
    } else {
      handleTarotCardSelectedChange(args)
    }
  }

  return (
    <div
      className='hs-dp-tarot-card'
      onClick={() =>
        tokenisedHandleTarotCardSelection(
          'daily_tarot',
          tokenDetails?.token_amount
        )
      }
    >
      <img alt='Not available' src='images/horoscope/tarotcard-stack.png' />
      {isTokenisationEnabled && !mvpAccessState?.horoscope?.dailyTarot && (
        <div className='hs-comic-read-more-card-btn'>
          <UnlockCTA eventData={tokenDetails} />
        </div>
      )}
    </div>
  )
}

TarotCardSelection.propTypes = {
  burnSpecDetails: PropTypes.array
}

export default TarotCardSelection
