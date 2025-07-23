import React from 'react'
import './index.css'
import Headers from '../Header'
import Button from '../Button'
import CaptureUserImage from './CaptureUserImage'
import CaptureOutfitImage from './CaptureOutfitImage'
import { useTranslation } from 'react-i18next'
import { imageUploadToUrl } from '../../../../helpers/mediaHelper'
import common from '@kelchy/common'
import ErrorModel from '../ErrorModel'
import { useCallback, useRef, useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'
import PropTypes from 'prop-types'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const AIStylistScanner = ({
  handlePageChange,
  setOutfitType,
  getAIStylistResult
}) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [images, setImages] = useState({
    user: null,
    userFile: null,
    outfit: null,
    outfitFile: null
  })
  const [isError, setIsError] = useState(false)

  const handleSubmit = async () => {
    const isFirstStep = step === 1

    setIsCameraOpen(false)
    if (isFirstStep) {
      setStep(2)
      return
    } else {
      handlePageChange()
    }

    getAIStylistResult(images)
  }

  const handleFileUpload = async (event) => {
    const { data: imageUrl, error: imageUploadError } = await common.awaitWrap(
      imageUploadToUrl(event)
    )

    if (imageUploadError) {
      setIsError(true)
      return
    }

    setImages((prev) => ({
      ...prev,
      [step === 1 ? 'user' : 'outfit']: imageUrl,
      [step === 1 ? 'userFile' : 'outfitFile']: event.target.files[0]
    }))
    setIsCameraOpen(true)
  }

  const handleRetake = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    trackEvent('stylist_reupload_clicks', properties)

    setIsCameraOpen(false)
    setImages((prev) => ({
      ...prev,
      [step === 1 ? 'user' : 'outfit']: null,
      [step === 1 ? 'userFile' : 'outfitFile']: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  const handleRetryAgain = useCallback(() => {
    setIsError(false)
  }, [])

  const getOutfitImage = (outfitKey, outfitType) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    trackEvent(`stylist_upload_${outfitKey}_clicks`, properties)

    setOutfitType(outfitType)
    fileInputRef?.current?.click()
  }

  return (
    <div className='ai-stylist-scanner'>
      <Headers color='#333' title={t('aiStylist.headerTitle')} />
      <div className='ai-stylist-scanner-container'>
        <div className='ai-stylist-scanner-content'>
          {step === 1 && (
            <CaptureUserImage
              isCameraOpen={isCameraOpen}
              userImage={images?.user}
            />
          )}
          {step === 2 && (
            <CaptureOutfitImage
              isCameraOpen={isCameraOpen}
              outfitImage={images?.outfit}
              getOutfitImage={getOutfitImage}
            />
          )}
        </div>
        {!(step === 2 && !images?.outfit) && (
          <div className='ai-stylist-scanner-footer'>
            {isCameraOpen ? (
              <>
                <Button outline={true} onClick={handleRetake}>
                  {t('aiStylist.reUpload')}
                </Button>
                <Button filled={true} onClick={handleSubmit}>
                  {t('aiStylist.useThis')}
                </Button>
              </>
            ) : (
              <Button
                filled={true}
                icon='camera'
                onClick={() => fileInputRef?.current?.click()}
              >
                {t('aiStylist.capture')}
              </Button>
            )}
          </div>
        )}
        <input
          className='ai-stylist-image-input'
          id='file-input'
          type='file'
          accept='image/png, image/jpeg, image/jpg, image/bmp, image/webp'
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        {isError && <ErrorModel handleRetryAgain={handleRetryAgain} />}
      </div>
    </div>
  )
}

AIStylistScanner.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  setOutfitType: PropTypes.func.isRequired,
  getAIStylistResult: PropTypes.func.isRequired
}

export default AIStylistScanner
