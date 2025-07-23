import React, { useEffect, useRef } from 'react'
import ImageGallery from '../../../ImageGallery/ImageGallery'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import {
  getApplicationDesc,
  getApplicationName
} from '../../../../helpers/appName'
import { imageUploadToUrl } from '../../../../helpers/mediaHelper'
import common from '@kelchy/common'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const UploadImage = ({
  endpoint,
  selectedImage,
  uploadedImage,
  stockImagesData = [],
  handleImageSelect,
  handleImageUpload,
  tenantLayout
}) => {
  const { authorizationId } = useAppContext()
  const selectedImageData = stockImagesData?.find(
    (image) => image.id === selectedImage
  )
  const fileInputRef = useRef(null)
  const { t } = useTranslation('common')

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
    handleImageUpload(imageUrl)
  }

  return (
    <>
      <div
        className='product-title'
        style={{
          fontFamily: tenantLayout?.funWithSelfies?.productTile?.fontFamily,
          fontWeight: tenantLayout?.funWithSelfies?.productTile?.fontWeight,
          fontSize: tenantLayout?.funWithSelfies?.productTile?.fontSize,
          margin: tenantLayout?.funWithSelfies?.productTile?.spacing
        }}
      >
        {getApplicationName(endpoint)}
      </div>
      {tenantLayout?.funWithSelfies?.productTile?.showDesc && (
        <div
          className='product-title-desc'
          style={{
            fontFamily: tenantLayout?.funWithSelfies?.productTile?.fontFamily,
            fontWeight:
              tenantLayout?.funWithSelfies?.productTile?.descFontWeight,
            fontSize: tenantLayout?.funWithSelfies?.productTile?.fontSize
          }}
        >
          {getApplicationDesc(endpoint)}
        </div>
      )}
      <div
        className={`upload-image-frame ${tenant}`}
        style={{
          background:
            tenantLayout?.funWithSelfies?.uploadImageFrame?.background,
          margin: tenantLayout?.funWithSelfies?.uploadImageFrame?.spacing,
          width: tenantLayout?.funWithSelfies?.uploadImageFrame?.width
        }}
      >
        {selectedImage || uploadedImage ? (
          <img
            className='selected-image-upload-frame'
            src={selectedImageData?.url || uploadedImage}
            alt='not available'
          />
        ) : (
          <div className='upload-icon-wrapper'>
            <label htmlFor='file-input'>
              <img
                src={tenantLayout?.funWithSelfies?.cameraIconImage}
                alt='Upload Icon'
                className='upload-icon-image'
              />
            </label>
            <input
              id='file-input'
              type='file'
              accept='image/png, image/jpeg, image/jpg, image/bmp, image/webp'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              onClick={handleFileInputClick}
            />
            <div className='upload-image-title'>{t('avatar.uploadPhoto')}</div>
          </div>
        )}
      </div>
      {selectedImage || uploadedImage ? null : (
        <div
          className='image-upload-hint-text'
          style={{
            fontWeight:
              tenantLayout?.funWithSelfies?.imageUploadHintText?.fontWeight,
            padding:
              tenantLayout?.funWithSelfies?.imageUploadHintText
                ?.suggestTextSpacing,
            marginTop:
              tenantLayout?.funWithSelfies?.imageUploadHintText?.topSpacing
          }}
        >
          {t('avatar.uploadClearHumanFace')}
        </div>
      )}
      {stockImagesData.length ? (
        <>
          <div className='generate-button-wrapper'></div>
          <div className='static-images-wrapper'>
            <div
              className='static-images-title'
              style={{
                fontWeight:
                  tenantLayout?.funWithSelfies?.imageUploadHintText?.fontWeight
              }}
            >
              {t('avatar.orUseOneOfTemplates')}
            </div>
            <ImageGallery
              data={stockImagesData}
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
            />
          </div>
        </>
      ) : null}
    </>
  )
}

UploadImage.propTypes = {
  endpoint: PropTypes.string.isRequired,
  selectedImage: PropTypes.string,
  uploadedImage: PropTypes.string,
  stockImagesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  handleImageSelect: PropTypes.func,
  handleImageUpload: PropTypes.func.isRequired,
  tenantLayout: PropTypes.object
}

export default UploadImage
