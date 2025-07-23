import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { translatedJsonData } from '../../../../i18nextConfig'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const outfitOptionsData = [
  {
    key: 'top',
    type: 'upper_body',
    image: '/images/ai_stylist/tops.png',
    title: translatedJsonData.aiStylist.topsTitle,
    desc: translatedJsonData.aiStylist.topsDescription
  },
  {
    key: 'bottom',
    type: 'lower_body',
    image: '/images/ai_stylist/Bottom.png',
    title: translatedJsonData.aiStylist.bottomTitle,
    desc: translatedJsonData.aiStylist.bottomDescription
  },
  {
    key: 'fulldress',
    type: 'dresses',
    image: '/images/ai_stylist/full-dress.png',
    title: translatedJsonData.aiStylist.fullDressTitle,
    desc: translatedJsonData.aiStylist.bottomDescription
  }
]

const CaptureOutfitImage = ({ outfitImage, getOutfitImage }) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    outfitImage
      ? trackEvent('stylist_outfit_preview_impression', properties)
      : trackEvent('stylist_upload_dress_impression', properties)
  }, [outfitImage, authorizationId])

  return (
    <>
      {outfitImage ? (
        <img
          className='ai-stylist-outfit-image'
          src={outfitImage}
          alt={t('aiStylist.uploadedImgNotAvailableAltMsg')}
        />
      ) : (
        <div className='ai-stylist-outfit-options-container'>
          <div className='ai-stylist-outfit-options-title'>
            {t('aiStylist.uploadImageTitle')}
          </div>
          <div className='ai-stylist-outfit-options-list'>
            {outfitOptionsData?.map((outfitOption) => (
              <div key={outfitOption.key} className='ai-stylist-outfit-option'>
                <img src={outfitOption.image} alt={outfitOption?.type} />
                <div className='ai-stylist-outfit-option-text-container'>
                  <div className='ai-stylist-outfit-option-title'>
                    {outfitOption?.title}
                  </div>
                  <div className='ai-stylist-outfit-option-desc'>
                    {outfitOption?.desc}
                  </div>
                </div>
                <button
                  className='ai-stylist-outfit-option-cta'
                  onClick={() => {
                    getOutfitImage(outfitOption?.key, outfitOption?.type)
                  }}
                >
                  {t('upload')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

CaptureOutfitImage.propTypes = {
  outfitImage: PropTypes.string,
  getOutfitImage: PropTypes.func
}

export default CaptureOutfitImage
