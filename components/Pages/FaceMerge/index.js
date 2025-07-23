import React, { useEffect, useState } from 'react'
import './index.css'
import BackButton from '../../../static/BackButton'
import UploadSelfie from './UploadSelfie'
import FaceTemplatesOptions from './FaceTemplatesOptions'
import faceMergeTemplates from '../../../static/faceMergeTemplates'
import MergeSelfieResult from './MergeSelfieResult'
import Loader from '../../Loader/Loader'
import common from '@kelchy/common'
import { axiosPost, getImageBlob } from '../../../utils/axios'
import { useLocation } from 'react-router-dom'
import { getAppName } from '../../../helpers/appName'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'

const FaceMerge = () => {
  const { authorizationId } = useAppContext()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showTemplatesOptions, setShowTemplatesOptions] = useState(false)
  const [uploadedSelfie, setUploadedSelfie] = useState(null)
  const [mergedSelfieData, setMergedSelfieData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })

  const location = useLocation()
  const { pathname } = location
  const endpoint = getAppName(pathname)

  useEffect(() => {
    setSelectedTemplate(0)
  }, [])

  const handleChangeTemplateClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('change_template_click', properties)
    setShowTemplatesOptions(true)
  }

  const getMergedSelfie = async (template, selfieUrl) => {
    let selectedTemplateData
    if (template?.url) {
      selectedTemplateData = { ...template }
    } else {
      selectedTemplateData = faceMergeTemplates.find(
        (image) => image.id === template
      )
    }
    if (!selectedTemplateData?.url || !selfieUrl) {
      return
    }

    setMergedSelfieData(null)
    setIsLoading(true)
    const { data: mediaTemplateBlob, error: mediaTemplateBlobError } =
      await common.awaitWrap(getImageBlob(selectedTemplateData?.url))
    const { data: mediaSelfieBlob, error: mediaSelfieBlobError } =
      await common.awaitWrap(getImageBlob(selfieUrl))

    if (mediaTemplateBlobError || mediaSelfieBlobError) {
      console.error('Error:', mediaTemplateBlobError, mediaSelfieBlobError)
      setErrorModalData({ openModal: true })
    } else {
      const formData = new FormData()
      formData.append('file', mediaSelfieBlob)
      formData.append('second_file', mediaTemplateBlob)

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
      setMergedSelfieData(apiResponse?.data)
    }
    setIsLoading(false)
  }

  const handleTemplateSelect = (templateId) => {
    const properties = {
      external_id: authorizationId,
      template_name: templateId,
      app_name: endpoint
    }
    trackEvent('template_click', properties)
    setShowTemplatesOptions(false)
    setSelectedTemplate(templateId)
    getMergedSelfie(templateId, uploadedSelfie)
  }

  const handleImageUploadClick = () => {
    const properties = {
      external_id: authorizationId,
      app_name: endpoint
    }
    trackEvent('upload_template_click', properties)
  }

  const handleTemplateUpload = (templateUrl) => {
    setShowTemplatesOptions(false)
    setSelectedTemplate({ url: templateUrl })
    getMergedSelfie({ url: templateUrl }, uploadedSelfie)
  }

  const handleSelfieUpload = (selfieUrl) => {
    setUploadedSelfie(selfieUrl)
    getMergedSelfie(selectedTemplate, selfieUrl)
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  return (
    <>
      {isLoading && <Loader />}
      <BackButton />
      {uploadedSelfie ? (
        <MergeSelfieResult
          endpoint={endpoint}
          selectedTemplate={selectedTemplate}
          handleChangeTemplateClick={handleChangeTemplateClick}
          uploadedSelfie={uploadedSelfie}
          handleSelfieUpload={handleSelfieUpload}
          mergedSelfieData={mergedSelfieData}
        />
      ) : (
        <UploadSelfie
          endpoint={endpoint}
          selectedTemplate={selectedTemplate}
          handleChangeTemplateClick={handleChangeTemplateClick}
          uploadedSelfie={uploadedSelfie}
          handleSelfieUpload={handleSelfieUpload}
        />
      )}
      <FaceTemplatesOptions
        showTemplatesOptions={showTemplatesOptions}
        faceMergeTemplates={faceMergeTemplates}
        handleTemplateSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
        handleTemplateUpload={handleTemplateUpload}
        handleImageUploadClick={handleImageUploadClick}
      />
      {errorModalData.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}

export default FaceMerge
