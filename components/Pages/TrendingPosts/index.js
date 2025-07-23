import common from '@kelchy/common'
import React, { useCallback, useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import './index.css'
import TrendingPostsCarousel from './TrendingPostsCarousel/TrendingPostsCarousel'
import { axiosGet } from '../../../utils/axios'
import { useNavigate } from 'react-router-dom'
import Loader from '../../Loader/Loader'
import { useTranslation } from 'react-i18next'
import TokenHeader from '../../TokenHeader/TokenHeader'
import { useTokenisationContext } from '../../../context/TokenisationContext'
import { TOKENISATION_USE_CASE_TYPE } from '../../../helpers/constant'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'

const TrendingPosts = () => {
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { createLogEvent, setTokenisationUseCaseType } =
    useTokenisationContext()
  const navigate = useNavigate()
  const [trendingPostsData, setTrendingPostsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation('common')

  const getActiveTrendingVideos = async () => {
    const { data: trendingPostsApiResponse } = await common.awaitWrap(
      axiosGet(`/trending-posts/active-posts`, {})
    )

    if (trendingPostsApiResponse?.data) {
      setTrendingPostsData(trendingPostsApiResponse?.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getActiveTrendingVideos()
  }, [])

  const triggerTokenLog = useCallback(() => {
    if (isTokenisationEnabled) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.newEarnModal)
      createLogEvent({
        user_event: `user_trending_video_lp_impression`,
        app_name: `trending_videos`,
        event: `user_engaged_trending_video`
      })
    }
    // eslint-disable-next-line
  }, [isTokenisationEnabled, setTokenisationUseCaseType])

  const handleClose = () => {
    navigate(-1)
  }

  // This useEffect to create log event
  useEffect(() => {
    triggerTokenLog()
  }, [triggerTokenLog])

  return (
    <>
      {isLoading ? <Loader /> : null}
      {isTokenisationEnabled && !isLoading && (
        <TokenHeader background='#333333' />
      )}
      <div className='tp-carousel-wrapper'>
        <div
          className={`tp-section-header ${
            !trendingPostsData?.length ? 'tp-no-data' : ''
          }`}
        >
          <div className='tp-section-title'>{t('trendingPosts.title')}</div>
          <IconButton aria-label='close' onClick={handleClose}>
            <CloseIcon className='tp-close-icon' />
          </IconButton>
        </div>
        {trendingPostsData?.length ? (
          <TrendingPostsCarousel trendingPosts={trendingPostsData} />
        ) : (
          <>
            {!isLoading && (
              <div className='tp-no-data-placeholder'>
                {t('trendingPosts.noPostsRightNowCheckBackLater')}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default TrendingPosts
