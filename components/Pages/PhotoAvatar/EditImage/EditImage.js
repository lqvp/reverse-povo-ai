import React, { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import common from '@kelchy/common'
import { Button } from '@mui/material'
import Carousel from '../../../Carousel/Carousel'
import { useState } from 'react'
import ShareModal from '../../../Modal/ShareModal/ShareModal'
import Loader from '../../../Loader/Loader'
import { useAppContext } from '../../../../context/AppContext'
import ErrorModal from '../../../Modal/ErrorModal/ErrorModal'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import {
  getAppEffectsText,
  getApplicationDesc,
  getApplicationName,
  getAppName
} from '../../../../helpers/appName'
import {
  downloadMedia,
  imageUploadToUrl,
  shareMediaNativePopUp,
  shareMediaToUGC
} from '../../../../helpers/mediaHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { isAgentIOS } from '../../../../utils/converter'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const isIOS = isAgentIOS()
const devicePlatform = isIOS ? 'ios' : 'android'
const { tenant } = getConfigForHostname()

const EditImage = ({
  selectedImage,
  uploadedImage,
  handleImageUpload,
  stockImagesData = [],
  editEffects = [],
  onEffectSelected,
  effectSelected,
  editedImageData,
  tenantLayout
}) => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const endpoint = getAppName(pathname)
  const fileInputRef = useRef(null)

  const selectedImageData = stockImagesData?.find(
    (image) => image.id === selectedImage
  )
  const origionalImageUrl = selectedImageData?.url || uploadedImage
  const editedImageUrl =
    editedImageData?.avatar_image?.image_url ||
    editedImageData?.animate_image?.image_url ||
    editedImageData?.sticker_picker_image?.image_url ||
    editedImageData?.glow_me_up_image?.image_url
  const [showEditedImage, setShowEditedImage] = useState(!!editedImageUrl)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const [loaderMsg, setLoaderMsg] = useState('')
  const { t } = useTranslation('common')
  const tImageIsOnItsWay = t('avatar.ImageIsOnItsWay')

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('results_visit', properties)
  }, [authorizationId, endpoint])

  useEffect(() => {
    if (editedImageUrl) {
      setLoaderMsg(tImageIsOnItsWay)
      setShowEditedImage(true)
      setIsLoading(true)
    } else {
      setLoaderMsg('')
      setShowEditedImage(false)
      setIsLoading(false)
    }
  }, [editedImageUrl, tImageIsOnItsWay])

  const handleOpenShareModal = async () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('share_click', properties)
    // enabled community share based on tenant config
    if (
      !tenantLayout?.funWithSelfies?.restrictShareToCommunity?.includes(
        devicePlatform
      )
    ) {
      setTimeout(() => {
        const properties = {
          external_id: authorizationId,
          app_name: endpoint
        }
        trackEvent('share_prompt_view', properties)
        setOpenShareModal(true)
      }, 1000)
    }

    const { error: shareMediaError } = common.awaitWrap(
      shareMediaNativePopUp(editedImageUrl)
    )
    if (shareMediaError) {
      setErrorModalData({ openModal: true })
    }
  }

  const handleShareModalClose = async (success) => {
    const shareMediaUGCUrl = `/media/${endpoint}/${editedImageData?.id}`
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

  const handleDownload = async () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('download_click', properties)

    downloadMedia(editedImageUrl)
  }

  const handleFileInputClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('upload_new_click', properties)
  }

  const handleFileUpload = async (event) => {
    const { data: imageUrl } = await common.awaitWrap(imageUploadToUrl(event))
    handleImageUpload(imageUrl)
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? <Loader loaderMsg={loaderMsg} /> : null}
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
          className={`product-title-desc ${tenant}`}
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
        className='button-wrapper'
        style={{ visibility: editedImageUrl ? 'visible' : 'hidden' }}
      >
        {/* Not showing two tabs for now(original and edited image tabs) */}
        {/* <Button
          className={`custom-button ${
            !showEditedImage ? 'selected' : 'not-selected'
          }`}
          onClick={() => handleEffectShow(false)}
          style={{ display: 'inline-block' }}
        >
          Original
        </Button>
        <Button
          className={`custom-button ${
            showEditedImage ? 'selected' : 'not-selected'
          }`}
          onClick={() => handleEffectShow(true)}
          style={{ display: 'inline-block' }}
          disabled={!editedImageUrl}
        >
          Edited
        </Button> */}
      </div>
      <div className='selected-image-wrapper'>
        <div className='upload-image-button-wrapper'>
          <label
            htmlFor='file-input'
            className={`upload-image-label-wrapper ${tenant}`}
          >
            <img
              src={'/images/image_upload_icon.png'}
              alt='Not available'
              height='16px'
              width='16px'
            />
            <div
              style={{
                fontFamily:
                  tenantLayout?.funWithSelfies?.productTile?.fontFamily
              }}
              className={`upload-image-button-wrapper-title ${tenant}`}
            >
              {t('avatar.uploadNewPhoto')}
            </div>
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
        </div>
        {!showEditedImage ? (
          <img
            src={origionalImageUrl}
            alt='Not available'
            className={`image-preview ${tenant}`}
          />
        ) : (
          <img
            src={editedImageUrl}
            alt='Not available'
            onLoad={handleImageLoad}
            className={`image-preview ${tenant}`}
          />
        )}
      </div>
      {editEffects?.length ? (
        <div
          className='animation-options-wrapper'
          style={{
            gap: tenantLayout?.funWithSelfies?.animationOptionGap
          }}
        >
          <div className='animation-options-wrapper-title'>
            {getAppEffectsText(endpoint)}
          </div>
          <Carousel
            data={editEffects}
            onImageSelect={onEffectSelected}
            selectedImage={effectSelected}
          />
        </div>
      ) : (
        <div className='animation-options-wrapper'></div>
      )}
      {showEditedImage ? (
        <>
          <div className='buttons-wrapper'>
            {!tenantLayout?.funWithSelfies?.restrictDownload?.includes(
              devicePlatform
            ) && (
              <Button
                disableElevation={true}
                variant='contained'
                disabled={!showEditedImage}
                sx={{
                  textTransform: 'none',
                  color: tenantLayout?.funWithSelfies?.btnConfig?.outlineColor,
                  fontSize: `${tenantLayout?.funWithSelfies?.btnConfig?.fontSize}!important`,
                  fontFamily: `${tenantLayout?.funWithSelfies?.fontFamily}!important`,
                  fontWeight: `${tenantLayout?.funWithSelfies?.btnConfig?.fontWeight}!important`,
                  background: '#FFF',
                  borderRadius: '4rem',
                  width: '10rem',
                  height: '2.5rem',
                  border: `1px solid ${tenantLayout?.funWithSelfies?.btnConfig?.outlineColor}`,
                  '&:hover': {
                    backgroundColor: '#FFF',
                    color: tenantLayout?.funWithSelfies?.btnConfig?.outlineColor
                  }
                }}
                onClick={handleDownload}
              >
                {t('download')}
              </Button>
            )}
            {!tenantLayout?.funWithSelfies?.restrictShare?.includes(
              devicePlatform
            ) && (
              <Button
                disableElevation={true}
                variant='contained'
                disabled={!showEditedImage}
                sx={{
                  textTransform: 'none',
                  color:
                    tenantLayout?.funWithSelfies?.btnConfig?.color || '#FFF',
                  fontSize: `${tenantLayout?.funWithSelfies?.btnConfig?.fontSize}!important`,
                  fontFamily: `${tenantLayout?.funWithSelfies?.fontFamily}!important`,
                  fontWeight: `${tenantLayout?.funWithSelfies?.btnConfig?.fontWeight}!important`,
                  background:
                    tenantLayout?.funWithSelfies?.btnConfig?.background ||
                    '#009eff',
                  borderRadius: '4rem',
                  width: '10rem',
                  height: '2.5rem',
                  '&:hover': {
                    backgroundColor:
                      tenantLayout?.funWithSelfies?.btnConfig?.background ||
                      '#009eff',
                    color:
                      tenantLayout?.funWithSelfies?.btnConfig?.color || '#FFF'
                  }
                }}
                onClick={handleOpenShareModal}
              >
                {t('share')}
              </Button>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {openShareModal && (
        <ShareModal
          open={openShareModal}
          handleModalClose={handleShareModalClose}
          tenantLayout={tenantLayout}
        />
      )}
      {errorModalData.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
          tenantLayout={tenantLayout}
        />
      )}
    </>
  )
}

EditImage.propTypes = {
  selectedImage: PropTypes.number,
  uploadedImage: PropTypes.string,
  handleImageUpload: PropTypes.func.isRequired,
  stockImagesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  editEffects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  onEffectSelected: PropTypes.func,
  effectSelected: PropTypes.string,
  editedImageData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    avatar_image: PropTypes.shape({
      image_url: PropTypes.string
    }),
    animate_image: PropTypes.shape({
      image_url: PropTypes.string
    }),
    sticker_picker_image: PropTypes.shape({
      image_url: PropTypes.string
    }),
    glow_me_up_image: PropTypes.shape({
      image_url: PropTypes.string
    })
  }),
  tenantLayout: PropTypes.object
}

export default EditImage
