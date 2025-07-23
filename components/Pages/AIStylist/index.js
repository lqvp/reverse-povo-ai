import React, { useState, useCallback, useRef, useEffect } from 'react'
import './index.css'
import AIStylistScanner from './AIStylistScanner'
import AIStylistHome from './AIStylistHome'
import AIStylistResult from './AIStylistResult'
import common from '@kelchy/common'
import { axiosPost } from '../../../utils/axios'
import LoaderWithPercentage from '../../LoaderWithPercentage'
import ErrorModel from './ErrorModel'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import TokenHeader from '../../TokenHeader/TokenHeader'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'

const AIStylist = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [outfitType, setOutfitType] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const intervalRef = useRef(null)
  const { t } = useTranslation('common')
  const { authorizationId } = useAppContext()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const startLoader = () => {
    setIsLoading(true)
    setPercentage(0)

    const updatePercentage = () => {
      setPercentage((prev) => {
        if (prev < 60) {
          return Math.min(prev + 3, 60)
        } else if (prev < 90) {
          return Math.min(prev + 2, 90)
        } else if (prev < 99) {
          return parseFloat(Math.min(prev + 0.25, 99).toFixed(1))
        } else {
          clearInterval(intervalRef.current)
          return prev
        }
      })
    }

    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(updatePercentage, 1000)

    return () => clearInterval(intervalRef.current)
  }

  const getAIStylistResult = async (images) => {
    trackEvent('stylist_image_processing_started', {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    })

    startLoader()
    const headers = {
      'Content-Type': 'multipart/form-data'
    }

    const formData = new FormData()
    formData.append('outfit_type', outfitType)
    formData.append('user_image', images?.userFile)
    formData.append('outfit_image', images?.outfitFile)

    const apiCallStartTime = new Date().getTime()
    const { data: aiStylistResponse, error: aiStylistError } =
      await common.awaitWrap(
        axiosPost('/ai-stylist/generate', formData, headers)
      )

    const apiCallEndTime = new Date().getTime()
    setIsLoading(false)
    trackEvent('stylist_image_processing_ended', {
      external_id: authorizationId,
      app_name: 'ai_stylist'
    })

    if (aiStylistError) {
      trackEvent('stylist_image_processing_timeout_error', {
        external_id: authorizationId,
        app_name: 'ai_stylist'
      })
      setIsError(true)
      if (
        aiStylistError?.response?.data?.error?.message?.includes(
          'Max retries reached'
        )
      ) {
        setErrorMsg(t('aiStylist.errorWithOutfitSelected'))
      }
      return
    }

    trackEvent('stylist_image_processing_time_difference', {
      external_id: authorizationId,
      swipe_depth: apiCallEndTime - apiCallStartTime,
      app_name: 'ai_stylist'
    })
    setResultUrl(aiStylistResponse?.data?.result_url)
  }

  const handlePageChange = useCallback(() => {
    setCurrentPage((prev) => prev + 1)
  }, [])

  const handleRetryAgain = useCallback(() => {
    setIsError(false)
    resetStylistApp()
  }, [])

  const resetStylistApp = () => {
    clearInterval(intervalRef.current)
    setIsError(false)
    setCurrentPage(1)
    setResultUrl('')
    setIsLoading(false)
    setPercentage(0)
  }

  return (
    <>
      {isTokenisationEnabled && (
        <TokenHeader background='#fdfbfc' textColor='#790052' />
      )}
      {isLoading ? (
        <LoaderWithPercentage
          percentage={percentage}
          loaderPrimaryColor={'#790052'}
          loaderSecondaryColor={'rgba(121, 0, 82, 0.15)'}
          backgroundColor={'#FFD3F1'}
          text={t('aiStylist.loaderMsg')}
        />
      ) : (
        <div className='ai-stylist-container'>
          {currentPage === 1 && (
            <AIStylistHome handlePageChange={handlePageChange} />
          )}
          {currentPage === 2 && (
            <AIStylistScanner
              handlePageChange={handlePageChange}
              setOutfitType={setOutfitType}
              getAIStylistResult={getAIStylistResult}
            />
          )}
          {currentPage === 3 && (
            <AIStylistResult
              resultUrl={resultUrl}
              resetStylistApp={resetStylistApp}
            />
          )}
        </div>
      )}
      {isError && (
        <ErrorModel handleRetryAgain={handleRetryAgain} errorMsg={errorMsg} />
      )}
    </>
  )
}

export default AIStylist
