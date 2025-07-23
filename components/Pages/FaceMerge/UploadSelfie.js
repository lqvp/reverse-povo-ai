import React, { useRef } from 'react'
import faceMergeTemplates from '../../../static/faceMergeTemplates'
import { useEffect } from 'react'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { getApplicationName } from '../../../helpers/appName'
import { imageUploadToUrl } from '../../../helpers/mediaHelper'
import common from '@kelchy/common'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const UploadSelfie = ({
  endpoint,
  selectedTemplate,
  handleChangeTemplateClick,
  uploadedSelfie,
  handleSelfieUpload
}) => {
  const { authorizationId } = useAppContext()
  const uploadSelfieRef = useRef(null)
  const { t } = useTranslation('common')

  let selectedTemplateData
  if (selectedTemplate?.url) {
    selectedTemplateData = { ...selectedTemplate }
  } else {
    selectedTemplateData = faceMergeTemplates.find(
      (image) => image.id === selectedTemplate
    )
  }

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('create_visit', properties)
  }, [authorizationId, endpoint])

  const handleFileInputClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('upload_click', properties)
  }

  const handleFileUpload = async (event) => {
    const { data: imageUrl } = await common.awaitWrap(imageUploadToUrl(event))
    handleSelfieUpload(imageUrl)
  }

  return (
    <div className='selfie-template-container'>
      <div className='product-title'>{getApplicationName(endpoint)}</div>
      <div className='selfie-template-wrapper'>
        <div className='template-image-container'>
          <img
            className='template-image'
            src={selectedTemplateData?.url}
            alt=' Template not available'
          />
          <button
            className='template-change-button'
            onClick={handleChangeTemplateClick}
          >
            {t('faceMerge.changeImage')}
          </button>
        </div>
        <div className='upload-selfie-container'>
          {uploadedSelfie ? (
            <img
              className='uploaded-selfie-image'
              src={uploadedSelfie}
              alt='not available'
            />
          ) : (
            <>
              <label htmlFor='upload-selfie-input'>
                <img
                  className='upload-selfie-icon'
                  src='images/add-a-photo.png'
                  alt='Upload selfie'
                />
              </label>
              <input
                id='upload-selfie-input'
                type='file'
                accept='image/png, image/jpeg, image/jpg, image/bmp, image/webp'
                ref={uploadSelfieRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                onClick={handleFileInputClick}
              />
              <div>{t('faceMerge.uploadYourSelfie')}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

UploadSelfie.propTypes = {
  endpoint: PropTypes.string.isRequired,
  selectedTemplate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]),
  handleChangeTemplateClick: PropTypes.func.isRequired,
  uploadedSelfie: PropTypes.string,
  handleSelfieUpload: PropTypes.func.isRequired
}

export default UploadSelfie
