import React, { useCallback, useEffect, useState } from 'react'
import './index.css'
import Headers from '../Header'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import Button from '../Button'
import {
  downloadMedia,
  shareMediaNativePopUp
} from '../../../../helpers/mediaHelper'
import common from '@kelchy/common'
import ErrorModel from '../ErrorModel'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const AIStylistResult = ({ resultUrl, resetStylistApp }) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    trackEvent('stylist_results_impression', properties)
  }, [authorizationId])

  const handleDownload = async () => {
    downloadMedia(resultUrl)
  }

  const handleOpenShareModal = async () => {
    const { error: shareMediaError } = common.awaitWrap(
      shareMediaNativePopUp(resultUrl)
    )
    if (shareMediaError) {
      setIsError(true)
    }
  }

  const handleRetryAgain = useCallback(() => {
    setIsError(false)
    resetStylistApp()
  }, [resetStylistApp])

  return (
    <>
      <div className='ai-stylist-result-container'>
        <Headers color='#333' title={t('aiStylist.headerTitle')} />
        {resultUrl && (
          <div className='ai-stylist-result-body'>
            <img
              className='ai-stylist-result-image'
              src={resultUrl}
              alt='Result not available currently'
            />
            <div className='ai-stylist-result-footer'>
              <Button
                filled={true}
                padding={'0.875rem 1rem'}
                onClick={resetStylistApp}
              >
                {t('aiStylist.createMore')}
              </Button>
              <Button
                outline={true}
                minWidth={'3.25rem'}
                padding={'0'}
                borderRadius={'50%'}
                icon='share'
                onClick={handleOpenShareModal}
              ></Button>
              <Button
                outline={true}
                minWidth={'3.25rem'}
                padding={'0'}
                borderRadius={'50%'}
                icon='download'
                onClick={handleDownload}
              ></Button>
            </div>
          </div>
        )}
      </div>
      {isError && <ErrorModel handleRetryAgain={handleRetryAgain} />}
    </>
  )
}

AIStylistResult.propTypes = {
  resultUrl: PropTypes.string,
  resetStylistApp: PropTypes.func
}

export default AIStylistResult
