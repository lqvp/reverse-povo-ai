import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import common from '@kelchy/common'
import axios from 'axios'
import UploadImage from './UploadImage/UploadImage'
import EditImage from './EditImage/EditImage'
import stockImagesData from '../../../static/stockImagesData'
import avatarEffects from '../../../static/avatarEffects'
import animatorEffects from '../../../static/animatorEffects'
import { axiosPost } from '../../../utils/axios'
import './PhotoAvatar.css'
import Loader from '../../Loader/Loader'
import BackButton from '../../../static/BackButton'
import { useAppContext } from '../../../context/AppContext'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { getAppName } from '../../../helpers/appName'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../useTenantConfig'
import { getConfigForHostname } from '../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const PhotoAvatar = () => {
  // Get tenant layout
  const tenantLayout = useTenantConfig(tenant)
  const { authorizationId } = useAppContext()
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [effectSelected, setEffectSelected] = useState(null)
  const [editedImageData, setEditedImageData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const [loaderMsg, setLoaderMsg] = useState('')

  const location = useLocation()
  const { pathname } = location
  const endpoint = getAppName(pathname)
  const { t } = useTranslation('common')

  const getAppEffects = (pathname) => {
    switch (true) {
      case pathname.includes('photo-avatar'):
        return avatarEffects
      case pathname.includes('photo-animator'):
        return animatorEffects
      default:
        return []
    }
  }

  const handleImageSelect = (imageId) => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint,
      template_name: imageId
    }
    trackEvent('template_click', properties)
    setSelectedImage(imageId)
    setUploadedImage(null)
  }

  const handleImageUpload = (url) => {
    setUploadedImage(url)
    setSelectedImage(null)
    setEditedImageData(null)
    setEffectSelected(null)
  }

  const onEffectSelected = async (templateId) => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint,
      style_name: templateId
    }
    trackEvent('style_click', properties)
    const selectedImageData = stockImagesData.find(
      (image) => image.id === selectedImage
    )
    const origionalImageUrl = selectedImageData?.url || uploadedImage
    setEffectSelected(templateId)

    setIsLoading(true)
    const { data: imageResponse, error: imageFetchError } =
      await common.awaitWrap(
        axios.get(origionalImageUrl, {
          responseType: 'blob'
        })
      )
    if (imageFetchError) {
      console.error('Error:', imageFetchError)
      setEffectSelected(false)
      setErrorModalData({ openModal: true })
    } else {
      const formData = new FormData()
      formData.append('templateId', templateId)
      formData.append('file', imageResponse.data)

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: authorizationId
      }
      setLoaderMsg(t('avatar.imageIsBeingUploaded'))
      const timer = endpoint === 'avatar' ? 3000 : 5000
      setTimeout(() => {
        setLoaderMsg(t('avatar.imageIsProcessingPleaseWait'))
      }, timer)
      const { data: apiResponse, error: apiCallError } = await common.awaitWrap(
        axiosPost(`/media/${endpoint}`, formData, headers)
      )
      if (apiCallError) {
        console.error('Error:', apiCallError)
        let errorMessage
        if (apiCallError?.response?.data?.error?.code === 520) {
          errorMessage = apiCallError.response.data.error.message
        }
        setEffectSelected(false)
        setErrorModalData({ openModal: true, errorMessage })
      }
      setEditedImageData(apiResponse?.data)
    }
    setIsLoading(false)
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  return (
    <>
      {isLoading ? <Loader loaderMsg={loaderMsg} /> : null}
      <BackButton
        isTriviaBackBtn={
          tenantLayout?.funWithSelfies?.backBtnConfig?.isAlternateIcon
        }
        color={tenantLayout?.funWithSelfies?.backBtnConfig?.iconColor}
        textVisible={tenantLayout?.funWithSelfies?.backBtnConfig?.isBackText}
        spacing={tenantLayout?.funWithSelfies?.backBtnConfig?.spacing}
      />
      {(selectedImage || uploadedImage) && isGenerating ? (
        <EditImage
          app={endpoint}
          selectedImage={selectedImage}
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
          stockImagesData={stockImagesData}
          editEffects={getAppEffects(pathname)}
          onEffectSelected={onEffectSelected}
          effectSelected={effectSelected}
          editedImageData={editedImageData}
          tenantLayout={tenantLayout}
        />
      ) : (
        <UploadImage
          endpoint={endpoint}
          selectedImage={selectedImage}
          uploadedImage={uploadedImage}
          stockImagesData={stockImagesData}
          handleImageSelect={handleImageSelect}
          handleImageUpload={handleImageUpload}
          setIsGenerating={setIsGenerating}
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

export default PhotoAvatar
