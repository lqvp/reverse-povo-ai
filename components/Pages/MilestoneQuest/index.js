import React, { useState, useEffect, useCallback } from 'react'
import './index.css'
import MilestoneLandingPage from './MilestoneLandingPage/MilestoneLandingPage'
import common from '@kelchy/common'
import { axiosGet } from '../../../utils/axios'
import Loader from '../../Loader/Loader'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'

const MilestoneQuest = () => {
  const { challengeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [milestoneQuestData, setMilestoneQuestData] = useState(null)
  const { authorizationId } = useAppContext()

  const navigate = useNavigate()

  const navigateToExplore = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'milestone_quest'
    }
    trackEvent('quest_back_click', properties)
    navigate(-1)
  }

  const getUserMilestoneDetails = useCallback(async () => {
    const { data: userMilestoneDetails, error } = await common.awaitWrap(
      axiosGet(`/challenges/get_challenge_for_user/${challengeId}`, {})
    )
    if (error) {
      setIsLoading(false)
      setError(true)
      const errorMessage =
        error?.response?.data?.error?.message ||
        'Something went wrong. Please try again!'
      setErrorMessage(errorMessage)
      return
    }
    if (userMilestoneDetails?.data) {
      setMilestoneQuestData(userMilestoneDetails?.data)
    }
    setIsLoading(false)
  }, [challengeId])

  useEffect(() => {
    getUserMilestoneDetails()
  }, [getUserMilestoneDetails])

  const returnHandler = () => {
    const properties = {
      external_id: authorizationId,
      app_name: 'milestone_quest'
    }
    trackEvent('quest_back_click', properties)
  }

  return (
    <div className='ai-store-milestone-quest-wrapper'>
      {isLoading ? (
        <Loader />
      ) : (
        <MilestoneLandingPage
          returnHandler={returnHandler}
          challengeId={challengeId}
          authorizationId={authorizationId}
          milestoneQuestData={milestoneQuestData || {}}
          errorStatus={error}
          errorMessage={errorMessage}
          navigateToExplore={navigateToExplore}
        />
      )}
    </div>
  )
}

export default MilestoneQuest
