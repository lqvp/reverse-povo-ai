import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenisationContext } from '../../context/TokenisationContext'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import PropTypes from 'prop-types'

const NewAppEarnModal = ({ environment }) => {
  const { mvpTokenAmount } = useTokenisationContext()
  const { t } = useTranslation('common')

  return (
    <div className='new-earn-modal'>
      <div className='app-new-earn-modal-header'>
        <div className='app-exploration-title-new'>
          +{mvpTokenAmount} {t('tokenization.tokensNewModal')}
        </div>
        <div className='app-exploration-description-new'>
          <div>{t('tokenization.creditedToWallet')}</div>
        </div>
      </div>
      <div className='app-exploration-bg-new'>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/new-earn-sparkle.png`}
          alt='app-exploration-sparkle'
          className='new-earn-sparkle'
        />
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/tokenisation_earn_new.gif`}
          alt='app-exploration-sparkle-new'
        />
      </div>
    </div>
  )
}

NewAppEarnModal.propTypes = {
  environment: PropTypes.string.isRequired
}

export default NewAppEarnModal
