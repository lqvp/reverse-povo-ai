import React from 'react'
import { useTranslation } from 'react-i18next'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import PropTypes from 'prop-types'
import './LowBalanceModal.css'

const LowBalanceModal = ({ environment }) => {
  const { t } = useTranslation('common')
  return (
    <div className='low-balance'>
      <div className='low-balance-bg-new'>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/low-wallet-balance.png`}
          alt='low-balance-wallet'
        />
      </div>
      <div className='low-balance-earn-modal-text'>
        <div className='low-balance-earn-modal-highlight'>
          <div className='low-balance-earn-modal-header'>
            {t('tokenization.lowBalance')}
          </div>
          <div className='low-balance-earn-modal-subheader'>
            {t('tokenization.lowBalanceTitle')}
          </div>
        </div>
        <div className='low-balance-earn-modal-desc'>
          {t('tokenization.lowBalanceDesc')}
        </div>
      </div>
      {/* To be used later in milestone feature */}
      {/* <div className='low-balance-earn-modal-btn'>
        <div className='low-balance-earn-btn-txt'>{t('tokenization.lowBalanceCTA')}</div>
        <div className='low-balance-earn-btn-icon'>
          <AIStylistIcon
            kind='right_arrow'
            width={24}
            height={20}
            color='#734001'
          />
        </div>
      </div> */}
    </div>
  )
}

LowBalanceModal.propTypes = {
  environment: PropTypes.string.isRequired
}

export default LowBalanceModal
