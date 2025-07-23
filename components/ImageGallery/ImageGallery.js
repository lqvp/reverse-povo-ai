import React from 'react'
import './imageGallery.css'
import { useRef } from 'react'
import { imageUploadToUrl } from '../../helpers/mediaHelper'
import common from '@kelchy/common'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const ImageGallery = ({
  data,
  onImageSelect,
  selectedImage,
  columnCount,
  showUploadImage,
  onImageUpload,
  onImageUploadClick,
  selectionRemove = true
}) => {
  const imageUploadRef = useRef(null)
  const { t } = useTranslation('common')

  const handleImageClick = (newSelectedImageId) => {
    if (onImageSelect) {
      if (selectionRemove && selectedImage === newSelectedImageId) {
        onImageSelect(null)
      } else {
        onImageSelect(newSelectedImageId)
      }
    }
  }

  const handleImageUpload = async (event) => {
    const { data: imageUrl } = await common.awaitWrap(imageUploadToUrl(event))
    onImageUpload(imageUrl)
  }

  const getGridColumns = () => {
    switch (columnCount) {
      case 2:
        return 'repeat(2, 1fr)'
      default:
        return 'repeat(3, 1fr)'
    }
  }

  return (
    <div
      className='image-gallery'
      style={{ gridTemplateColumns: getGridColumns() }}
    >
      {showUploadImage ? (
        <div key='image_upload' className='gallery-item'>
          <div className='upload-image-container'>
            <label htmlFor='image-input'>
              <img
                className='upload-image-icon'
                src='images/add-a-photo.png'
                alt='Upload selfie'
              />
            </label>
            <input
              id='image-input'
              type='file'
              accept='image/png, image/jpeg, image/jpg, image/bmp, image/webp'
              ref={imageUploadRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
              onClick={onImageUploadClick}
            />
            <div>{t('imageGallery.uploadPhoto')}</div>
          </div>
        </div>
      ) : null}
      {data?.map((d) => (
        <div key={d.id} className='gallery-item'>
          <div
            className={`image-container ${
              selectedImage === d.id ? 'selected-image' : ''
            }`}
            onClick={() => handleImageClick(d.id)}
          >
            <img src={d.url} alt={d.name} className='gallery-image' />
          </div>
          {d.name ? <div className='image-name'>{d.name}</div> : null}
        </div>
      ))}
    </div>
  )
}

ImageGallery.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string
    })
  ).isRequired,
  onImageSelect: PropTypes.func,
  selectedImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnCount: PropTypes.number,
  showUploadImage: PropTypes.bool,
  onImageUpload: PropTypes.func,
  onImageUploadClick: PropTypes.func,
  selectionRemove: PropTypes.bool
}

export default ImageGallery
