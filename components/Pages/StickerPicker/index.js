import React, { useCallback, useEffect, useState } from 'react'
import BackButton from '../../../static/BackButton'
import UploadImage from '../PhotoAvatar/UploadImage/UploadImage'
import { useLocation } from 'react-router-dom'
import { getAppName } from '../../../helpers/appName'
import EditImage from '../PhotoAvatar/EditImage/EditImage'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import Loader from '../../Loader/Loader'
import common from '@kelchy/common'
import { axiosPost, getImageBlob } from '../../../utils/axios'
import { useTranslation } from 'react-i18next'
import {
  getConfigForHostname,
  useFeatureAllowed
} from '../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../useTenantConfig'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import TokenHeader from '../../TokenHeader/TokenHeader'

const { tenant } = getConfigForHostname()

const StickerPicker = () => {
  // Get tenant layout
  const tenantLayout = useTenantConfig(tenant)
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [editedImageData, setEditedImageData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })
  const [loaderMsg, setLoaderMsg] = useState('')

  const location = useLocation()
  const { pathname } = location
  const endpoint = getAppName(pathname)
  const { t } = useTranslation('common')
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_ai_stylist_lp_impression`,
        app_name: endpoint,
        event: `user_engaged_${endpoint}`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType, endpoint])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  const handleImageUpload = async (url) => {
    setEditedImageData(null)
    setSelectedImage(null)
    setUploadedImage(url)
    setIsLoading(true)

    setLoaderMsg(t('avatar.imageIsBeingUploaded'))
    setTimeout(() => {
      setLoaderMsg(t('avatar.imageIsProcessingPleaseWait'))
    }, 3000)
    const { data: mediaBlob, error: mediaBlobError } = await common.awaitWrap(
      getImageBlob(url)
    )
    if (mediaBlobError) {
      console.error('Error:', mediaBlobError)
      setErrorModalData({ openModal: true })
    } else {
      const formData = new FormData()
      formData.append('file', mediaBlob)

      const headers = {
        'Content-Type': 'multipart/form-data'
      }
      const { data: apiResponse, error: apiCallError } = await common.awaitWrap(
        axiosPost(`/media/${endpoint}`, formData, headers)
      )
      if (apiCallError) {
        console.error('Error:', apiCallError)
        let errorMessage
        if (apiCallError?.response?.data?.error?.code === 520) {
          errorMessage = apiCallError.response.data.error.message
        }
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
      {isTokenisationEnabled && !isLoading && (
        <TokenHeader
          background={tenantLayout?.funWithSelfies?.headerBackgroundColor}
          textColor='#333'
        />
      )}
      <BackButton
        isTriviaBackBtn={
          tenantLayout?.funWithSelfies?.backBtnConfig?.isAlternateIcon
        }
        color={tenantLayout?.funWithSelfies?.backBtnConfig?.iconColor}
        textVisible={tenantLayout?.funWithSelfies?.backBtnConfig?.isBackText}
        spacing={tenantLayout?.funWithSelfies?.backBtnConfig?.spacing}
      />
      {selectedImage || uploadedImage ? (
        <EditImage
          endpoint={endpoint}
          selectedImage={selectedImage}
          uploadedImage={uploadedImage}
          handleImageUpload={handleImageUpload}
          stockImagesData={[]}
          editEffects={[]}
          editedImageData={editedImageData}
          tenantLayout={tenantLayout}
        />
      ) : (
        <UploadImage
          endpoint={endpoint}
          selectedImage={selectedImage}
          uploadedImage={uploadedImage}
          stockImagesData={[]}
          handleImageUpload={handleImageUpload}
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

export default StickerPicker
