import React, { useRef, useState, useEffect } from 'react'
import Loader from '../../Loader/Loader'
import { Button } from '@mui/material'
import common from '@kelchy/common'
import ShareModal from '../../Modal/ShareModal/ShareModal'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { useAppContext } from '../../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import faceMergeTemplates from '../../../static/faceMergeTemplates'
import { trackEvent } from '../../../helpers/analyticsHelper'
import {
  downloadMedia,
  imageUploadToUrl,
  shareMediaNativePopUp,
  shareMediaToUGC
} from '../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const MergeSelfieResult = ({
  endpoint,
  selectedTemplate,
  handleChangeTemplateClick,
  uploadedSelfie,
  handleSelfieUpload,
  mergedSelfieData
}) => {
  const { authorizationId } = useAppContext()
  const uploadNewSelfieRef = useRef(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const { t } = useTranslation('common')

  let selectedTemplateData
  if (selectedTemplate?.url) {
    selectedTemplateData = { ...selectedTemplate }
  } else {
    selectedTemplateData = faceMergeTemplates.find(
      (image) => image.id === selectedTemplate
    )
  }

  const mergedSelfieUrl = mergedSelfieData?.face_merge_image?.image_url

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('results_visit', properties)
  }, [authorizationId, endpoint])

  useEffect(() => {
    setIsLoading(!!mergedSelfieUrl)
  }, [mergedSelfieUrl])

  const handleFileInputClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('upload_new_click', properties)
  }

  const handleFileUpload = async (event) => {
    const { data: imageUrl } = await common.awaitWrap(imageUploadToUrl(event))
    handleSelfieUpload(imageUrl)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleDownload = async () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('download_click', properties)

    downloadMedia(mergedSelfieUrl)
  }

  const handleOpenShareModal = async () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('share_click', properties)

    setTimeout(() => {
      const properties = {
        external_id: authorizationId,
        app_name: endpoint
      }
      trackEvent('share_prompt_view', properties)
      setOpenShareModal(true)
    }, 1000)

    const { error: shareMediaError } = common.awaitWrap(
      shareMediaNativePopUp(mergedSelfieUrl)
    )
    if (shareMediaError) {
      setErrorModalData({ openModal: true })
    }
  }

  const handleShareModalClose = async (success) => {
    const shareMediaUGCUrl = `/media/${endpoint}/${mergedSelfieData?.id}`
    setOpenShareModal(false)

    const { error: shareMediaToUGCError } = await common.awaitWrap(
      shareMediaToUGC(
        success,
        authorizationId,
        endpoint,
        shareMediaUGCUrl,
        navigate
      )
    )
    if (shareMediaToUGCError) {
      console.error('Error in sharing UGC:', shareMediaToUGCError)
      setErrorModalData({ openModal: true })
    }
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className='selected-selfie-wrapper'>
        <div className='upload-selfie-button-wrapper'>
          <label
            htmlFor='upload-new-selfie-input'
            className='upload-selfie-label-wrapper'
          >
            <img
              src={'/images/image_upload_icon.png'}
              alt='Not available'
              height='16px'
              width='16px'
            />
            <div>{t('faceMerge.uploadNewImage')}</div>
          </label>
          <input
            id='upload-new-selfie-input'
            type='file'
            accept='image/png, image/jpeg, image/jpg, image/bmp, image/webp'
            ref={uploadNewSelfieRef}
            onChange={handleFileUpload}
            onClick={handleFileInputClick}
          />
        </div>
        <img
          src={mergedSelfieUrl || uploadedSelfie}
          alt='Not available'
          onLoad={handleImageLoad}
          className='selfie-preview'
        />
        <div className='template-select-preview-container'>
          <div className='template-select-preview-wrapper'>
            <img
              src={selectedTemplateData?.url}
              alt='Not available'
              className='template-select-preview'
            />
            <button
              className='template-change-button-preview'
              onClick={handleChangeTemplateClick}
            >
              {t('faceMerge.changeImage')}
            </button>
          </div>
        </div>
      </div>
      <div className='selfie-buttons-wrapper'>
        <Button
          disableElevation={true}
          variant='contained'
          sx={{
            textTransform: 'none',
            color: '#2A333D',
            fontSize: '12px',
            background: '#FFF',
            borderRadius: '4rem',
            width: '9rem',
            height: '2rem',
            border: '1px solid #2A333D',
            '&:hover': {
              backgroundColor: '#FFF',
              color: '#2A333D'
            }
          }}
          onClick={handleDownload}
        >
          {t('download')}
        </Button>
        <Button
          disableElevation={true}
          variant='contained'
          sx={{
            textTransform: 'none',
            color: '#FFF',
            fontSize: '12px',
            background: '#009EFF',
            borderRadius: '4rem',
            width: '9rem',
            height: '2rem'
          }}
          onClick={handleOpenShareModal}
        >
          {t('share')}
        </Button>
      </div>

      {openShareModal && (
        <ShareModal
          open={openShareModal}
          handleModalClose={handleShareModalClose}
        />
      )}
      {errorModalData.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}

MergeSelfieResult.propTypes = {
  endpoint: PropTypes.string.isRequired,
  selectedTemplate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleChangeTemplateClick: PropTypes.func.isRequired,
  uploadedSelfie: PropTypes.string,
  handleSelfieUpload: PropTypes.func.isRequired,
  mergedSelfieData: PropTypes.object
}

export default MergeSelfieResult
