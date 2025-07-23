import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const CaptureUserImage = ({ userImage }) => {
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    }
    userImage
      ? trackEvent('stylist_upload_file_impression', properties)
      : trackEvent('stylist_upload_user_impression', properties)
  }, [userImage, authorizationId])

  return (
    <>
      {userImage ? (
        <img
          className='ai-stylist-user-image'
          src={userImage}
          alt={t('aiStylist.uploadedImgNotAvailableAltMsg')}
        />
      ) : (
        <>
          <div className='ai-stylist-user-image-ph-right-top-circle'></div>
          <div className='ai-stylist-user-image-ph-bottom-left-circle'></div>
          <div className='ai-stylist-user-image-ph-text'>
            <div className='ai-stylist-user-image-ph-title'>
              {t('aiStylist.step1Message')}
            </div>
            <div className='ai-stylist-user-image-ph-description'>
              {t('aiStylist.step1Description')}
            </div>
          </div>
          <img
            className='ai-stylist-user-image-ph-model-image'
            src='/images/ai_stylist/upload-image-model.png'
            alt=''
          />
          <div className='ai-stylist-user-image-ph-bottom-blur'></div>
        </>
      )}
    </>
  )
}

CaptureUserImage.propTypes = {
  userImage: PropTypes.string
}

export default CaptureUserImage
