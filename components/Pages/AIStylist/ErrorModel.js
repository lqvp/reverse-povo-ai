import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import AIStylistIcon from '../../../static/AIStylistIcon'
import Button from './Button'

const ErrorModel = ({ handleRetryAgain, errorMsg }) => {
  const { t } = useTranslation('common')
  return (
    <div className='ai-stylist-error-model'>
      <div className='ai-stylist-error-model-content'>
        <AIStylistIcon kind='alert' width={60} height={60} />
        <h3>{t('aiStylist.oops')}</h3>
        <p>{errorMsg || t('aiStylist.errorMessage')}</p>
        <Button onClick={handleRetryAgain} filled={true} full={true}>
          {t('aiStylist.tryAgain')}
        </Button>
      </div>
    </div>
  )
}

ErrorModel.propTypes = {
  handleRetryAgain: PropTypes.func,
  errorMsg: PropTypes.string
}

export default ErrorModel
