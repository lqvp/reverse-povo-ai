import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import common from '@kelchy/common'
import ScannedFoodDetails from './ScannedFoodDetails'
import FoodScanLoader from './FoodScanLoader'
import { axiosPost } from '../../../utils/axios'
import BackButton from '../../../static/BackButton'
import { formatLogMealResponse } from '../../../helpers/foodscanner'
import './index.css'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'
import FoodScanError from './FoodScanError'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import TokenHeader from '../../TokenHeader/TokenHeader'

const FoodScanner = () => {
  const [foodDetails, setFoodDetails] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_food_scan_lp_impression`,
        app_name: `food_scan`,
        event: `user_engaged_food_scan`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  const handleFileChange = async (event) => {
    trackEvent('clicked food_scan_upload_click', {
      external_id: authorizationId
    })

    const uploadedFile = event.target.files[0]
    setPreviewUrl(URL.createObjectURL(uploadedFile))
    const formData = new FormData()
    formData.append('file', uploadedFile)
    setIsLoading(true)
    const { data: mealLogResponse, error: mealLogError } =
      await common.awaitWrap(axiosPost('/meal/get-nutritional-value', formData))
    if (mealLogError) {
      setIsLoading(false)
      setError(true)
    } else {
      const mealLogData = formatLogMealResponse(mealLogResponse.data)
      setFoodDetails(mealLogData)
      setIsLoading(false)
      const { name: food_name, calories } = mealLogData
      trackEvent('clicked food_scan_result_page', {
        external_id: authorizationId,
        food_name,
        kcal: calories
      })
    }
  }
  const rescanFood = () => {
    setFoodDetails(false)
    trackEvent('clicked food_scan_rescan_click', {
      external_id: authorizationId
    })
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleBackToHome = () => {
    setError(false)
    setFoodDetails(false)
  }

  if (isLoading) {
    return <FoodScanLoader />
  }

  if (error) {
    return <FoodScanError handleBackToHome={handleBackToHome} />
  }

  return (
    <>
      {isTokenisationEnabled && <TokenHeader background='#333333' />}
      {foodDetails ? (
        <ScannedFoodDetails
          foodDetails={foodDetails}
          previewUrl={previewUrl}
          handleBackClick={handleBackClick}
          rescanFood={rescanFood}
        />
      ) : (
        <div className='food-scan-upload-container main-body-wrapper'>
          <div className='food-scanner-back-btn'>
            <BackButton
              color='#000'
              fontSize='24px'
              textVisible={false}
              onClick={handleBackClick}
            />
          </div>
          <div className='food-scan-upload-content'>
            <h1 className='food-scanner-start-label'>
              Are you eating healthy?
            </h1>
            <input
              type='file'
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id='file-upload'
            />
            <label className='food-scan-upload-section' htmlFor='file-upload'>
              <div className='food-scan-upload-icon'>
                <img
                  className='food-scan-upload-image-icon'
                  src='images/food-scan-add-a-photo.png'
                  alt='Upload selfie'
                />
              </div>
              <p>Upload a clear picture of the food you want to scan</p>
            </label>
          </div>
        </div>
      )}
    </>
  )
}

export default FoodScanner
