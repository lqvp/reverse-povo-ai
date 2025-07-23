import React from 'react'
import { useTokenisationContext } from '../../context/TokenisationContext'
import { useTranslation } from 'react-i18next'
import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import Icon from '../../static/Icon'
import './tokenisationModal.css'

const tokenisationTextMapper = {
  check: 'tokenization.checkFor',
  read: 'tokenization.readMoreFor',
  play: 'tokenization.playFor',
  ready: 'tokenization.ready'
}

const UnlockCTA = ({ type = 'check', eventData }) => {
  const {
    isLogEventCreating,
    isUnlocking,
    unlockedMessageStatus,
    burnRedirection
  } = useTokenisationContext()
  const { t } = useTranslation('common')

  return (
    <div className='horoscope-unlock-cta-button'>
      <button
        disabled={(isLogEventCreating || isUnlocking) && !unlockedMessageStatus}
        className='horoscope-unlock-cta-button-wrapper'
      >
        {isLogEventCreating || isUnlocking || burnRedirection ? (
          <CircularProgress color='inherit' size={14} />
        ) : (
          <>
            {t(tokenisationTextMapper[type])}
            <div className='horoscope-unlock-button-icon'>
              <Icon kind='TokenIcon' width={20} height={20} />
            </div>
            {eventData?.token_amount}
          </>
        )}
      </button>
    </div>
  )
}

UnlockCTA.propTypes = {
  type: PropTypes.string,
  eventData: PropTypes.object
}

export default UnlockCTA
