import {
  ALLOWED_CATEGORIES,
  MILESTONE_TEXT_DATA
} from '../../../../common/milestoneConstant'
import { formatDatetoVerbose } from '../../../../helpers/helperFunctions'
import BackButton from '../../../../static/BackButton'
import './MilestoneLandingPage.css'
import GeneralIcons from '../../../../static/GeneralIcons'
import MilestoneIcons from '../../../../static/MilestoneIcons'
import { getTenantName } from '../../../../helpers/tenantHelper'
import PropTypes from 'prop-types'
import MileStoneRewardPage from '../MileStoneRewardPage/MileStoneRewardPage'
import React, { useEffect, useState } from 'react'
import common from '@kelchy/common'
import { axiosGet } from '../../../../utils/axios'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import Loader from '../../../Loader/Loader'
import MilestoneQuestError from '../MilestoneQuestError'
import MilestoneCompletionDialog from './MilestoneCompletionDialog'

const constantText = MILESTONE_TEXT_DATA
const questTitle = (challengeQuestData) => {
  const { total_quests, completed_quests } = challengeQuestData
  const leftQuests = total_quests - completed_quests

  if (completed_quests === 0) {
    return `Complete daily quest for ${total_quests} days to unlock your reward!`
  } else if (leftQuests > 1) {
    return `Daily quest for ${leftQuests} days left. Complete to unlock your reward!`
  } else if (leftQuests === 1) {
    return `Only last quest left. Complete to unlock your reward!`
  } else if (leftQuests === 0) {
    return `All ${total_quests} quests completed, Reward ready to be claimed!`
  } else {
    return ``
  }
}

const dailyQuestsCompleted = (milestoneData) => {
  if (!milestoneData?.daily_quest?.tasks) return false
  return milestoneData.daily_quest.tasks.every((task) => task.completed)
}

const { tenant } = getTenantName()

const ChallengeCompletionPrompt = ({ redeemedMessage }) => {
  return (
    <div className='ai-store-milestone-lp-banner-challenge-list completed'>
      <div className='ai-store-milestone-lp-banner-milestone-complete'>
        <div className='ai-store-milestone-lp-banner-dq-complete-img'>
          <GeneralIcons kind='pass' color='#88D737' bgColor='#FFF' />
        </div>
        <p className='ai-store-milestone-lp-banner-dq-complete-title'>
          {redeemedMessage ?? constantText?.rewardClaimedTitle}
        </p>
      </div>
    </div>
  )
}

const Stepper = ({ currentStep = 0, totalSteps = 5 }) => {
  const fillWidth = `${(currentStep / totalSteps) * 100}%`

  return (
    <div className='ai-store-milestone-lp-progress-wrapper'>
      {/* Progress Bar Container */}
      <div
        className={`ai-store-milestone-lp-progress-bar ${currentStep === 0 ? 'start' : ''}`}
      >
        {/* Filled Background */}
        <div
          className='ai-store-milestone-lp-progress-fill'
          style={{ width: fillWidth }}
        >
          <div
            className={`ai-store-milestone-lp-progress-fill-bar ${currentStep === totalSteps ? 'completed' : ''}`}
          ></div>
          <div
            className={`ai-store-milestone-lp-progress-words ${currentStep === 0 ? 'start' : ''}`}
          >
            {currentStep}/{totalSteps}
          </div>
        </div>
        <div className='ai-store-milestone-lp-progress-badge'>
          {currentStep === totalSteps ? (
            <GeneralIcons kind='activeBadge' width={50} height={50} />
          ) : (
            <GeneralIcons kind='lightBadge' width={50} height={50} />
          )}
        </div>
      </div>
    </div>
  )
}

const ChallengeProgressStatus = ({
  total_coupon_count,
  available_coupon_count
}) => {
  const isAboveHalf = available_coupon_count > total_coupon_count / 2
  return (
    <div className='ai-store-milestone-lp-progress-status'>
      <div className='ai-store-milestone-lp-progress-status-left'>
        <p
          className={`ai-store-milestone-lp-progress-status-text ${isAboveHalf ? '' : 'less-remaining'}`}
        >
          {isAboveHalf
            ? `Offer limited to first ${total_coupon_count} customers Hurry, Play now!`
            : constantText.couponAvailableThresholdTitle}
        </p>
      </div>
    </div>
  )
}

const MilestoneLandingPage = ({
  returnHandler,
  challengeId,
  authorizationId,
  milestoneQuestData,
  errorStatus,
  errorMessage,
  navigateToExplore
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [claimReward, setClaimReward] = useState(false)
  const [milestoneCompleted, setMilestoneCompleted] = useState(false)
  const [challengeQuestData, setChallengeQuestData] =
    useState(milestoneQuestData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dailyQuestCompleted, setDailyQuestCompleted] = useState(
    dailyQuestsCompleted(milestoneQuestData)
  )
  const [openCompletionDialog, setOpenCompletionDialog] = useState(false)
  const {
    total_quests,
    completed_quests,
    end_date,
    total_coupon_added,
    available_coupon_count
  } = challengeQuestData

  useEffect(() => {
    if (challengeQuestData?.daily_quest?.tasks?.length > 0) {
      const properties = {
        external_id: authorizationId,
        challenge_id: challengeQuestData?._id,
        quest_id: challengeQuestData?.daily_quest?._id,
        app_name: 'milestone_quest'
      }
      trackEvent('quest_lp_impression', properties)
    }
  }, [authorizationId, challengeQuestData])

  useEffect(() => {
    if (available_coupon_count === 0) {
      setOpenCompletionDialog(true)
    }
    if (total_quests === completed_quests) {
      setMilestoneCompleted(true)
    }
  }, [
    completed_quests,
    total_quests,
    total_coupon_added,
    available_coupon_count
  ])

  const refreshMileStoneQuestData = async () => {
    setIsRefreshing(true)
    const { data: updatedMilestoneDetails, error } = await common.awaitWrap(
      axiosGet(`/challenges/refresh_challenge_for_user/${challengeId}`, {})
    )
    if (error) {
      setIsRefreshing(false)
      return
    }
    if (updatedMilestoneDetails?.data) {
      setChallengeQuestData(updatedMilestoneDetails?.data)
      if (dailyQuestsCompleted(updatedMilestoneDetails?.data))
        setDailyQuestCompleted(true)
    }
    setIsRefreshing(false)
  }

  const clickRedirectionHandler = async (questData) => {
    setIsLoading(true)
    if (challengeQuestData && questData) {
      let redirectingURL = questData?.url
      const properties = {
        external_id: authorizationId,
        challenge_id: challengeQuestData?._id,
        quest_id: challengeQuestData?.daily_quest?._id,
        task_id: questData?._id,
        app_name: 'milestone_quest'
      }
      trackEvent('quest_daily_task_click', properties)
      if (redirectingURL) {
        const delimiter = redirectingURL.includes('?') ? '&' : '?'
        redirectingURL += tenant ? `${delimiter}tenant=${tenant}` : ''
      }
      window.location.assign(redirectingURL)
      setIsLoading(false)
    }
  }

  const claimRewardHandler = () => {
    setClaimReward(true)
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {claimReward ? (
        <MileStoneRewardPage
          returnHandler={returnHandler}
          challengeId={challengeId}
          authorizationId={authorizationId}
          milestoneQuestData={challengeQuestData}
        />
      ) : !errorStatus ? (
        challengeQuestData ? (
          <div className='ai-store-milestone-lp-wrapper'>
            <div className='ai-store-milestone-lp-back-btn'>
              <div
                className='ai-store-milestone-home-header'
                onClick={() => returnHandler()}
              >
                <BackButton
                  color={'#FFF'}
                  textVisible={false}
                  isTriviaBackBtn={true}
                />
                <p>{challengeQuestData?.title}</p>
                <div className='ai-store-poll-home-back-button-wrapper'></div>
              </div>
            </div>
            <div className='ai-store-milestone-lp-banner-desc-wrap'>
              {!milestoneCompleted ? (
                <div className='ai-store-milestone-lp-banner-desc-wrap-header'>
                  <ChallengeProgressStatus
                    total_coupon_count={total_coupon_added}
                    available_coupon_count={available_coupon_count}
                  />
                  <div className='ai-store-milestone-lp-banner-desc'>
                    <div className='ai-store-milestone-lp-banner-txt'>
                      {questTitle(challengeQuestData)}
                    </div>
                    <Stepper
                      currentStep={completed_quests}
                      totalSteps={total_quests}
                    />
                    <div className='ai-store-milestone-lp-banner-wait-txt'>
                      {constantText?.questCompletionNotification +
                        formatDatetoVerbose(end_date, '-')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='ai-store-milestone-lp-banner-success-wrap'>
                  <img
                    src='/images/ai_milestone_quest/congrats-poppers.png'
                    className='ai-store-milestone-lp-banner-success'
                    alt='celebration_img'
                  />
                  <div className='ai-store-milestone-lp-banner-success-desc-wrap'>
                    <p className='ai-store-milestone-lp-banner-reward-title'>
                      Congratulations!
                    </p>
                    <p className='ai-store-milestone-lp-banner-reward-subtitle'>
                      Reward Unlocked
                    </p>
                    <div className='ai-store-milestone-reward-cta'>
                      <div
                        className='ai-store-milestone-reward-cta-text'
                        onClick={claimRewardHandler}
                      >
                        {constantText?.questCompleteCTA}
                      </div>
                      <div className='ai-store-milestone-reward-back-cta-bar'></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='ai-store-milestone-lp-banner-challenge-wrapper'>
              <div className='ai-store-milestone-lp-challenge-title-wrapper'>
                <div className='ai-store-milestone-lp-banner-challenge-title'>
                  Daily Quest
                </div>
                {!milestoneCompleted && (
                  <div
                    className={`ai-store-milestone-lp-banner-dq-complete-img ${isRefreshing ? 'refresh' : ''}`}
                    onClick={() => refreshMileStoneQuestData()}
                  >
                    <GeneralIcons kind='refresh' width={32} height={32} />
                  </div>
                )}
              </div>

              {milestoneCompleted ? (
                <div className='ai-store-milestone-lp-banner-challenge-list completed'>
                  <div className='ai-store-milestone-lp-banner-milestone-complete'>
                    <div className='ai-store-milestone-lp-banner-dq-complete-img'>
                      <GeneralIcons
                        kind='pass'
                        color='#88D737'
                        bgColor='#FFF'
                      />
                    </div>
                    <p className='ai-store-milestone-lp-banner-dq-complete-title'>
                      {`All ${total_quests} quests completed`}
                    </p>
                    <p className='ai-store-milestone-lp-banner-dq-complete-desc'>
                      {constantText?.milestoneCompletionDesc}
                    </p>
                  </div>
                </div>
              ) : !dailyQuestCompleted ? (
                <div className='ai-store-milestone-lp-banner-challenge-list'>
                  {challengeQuestData?.daily_quest?.tasks?.map(
                    (quest, index) => (
                      <div
                        key={index}
                        className='ai-store-milestone-lp-banner-challenge'
                      >
                        <div className='ai-store-milestone-lp-banner-quest-img'>
                          {quest?.completed ? (
                            <GeneralIcons
                              kind='pass'
                              color='#88D737'
                              bgColor='#FFF'
                            />
                          ) : ALLOWED_CATEGORIES.includes(quest?.category) ? (
                            <MilestoneIcons
                              kind={quest?.category}
                              color='#FFF'
                            />
                          ) : (
                            <MilestoneIcons kind={'default'} color='#6730FF' />
                          )}
                        </div>
                        <div
                          className={`ai-store-milestone-lp-banner-quest-title ${quest?.completed ? 'completed' : ''}`}
                        >
                          {quest?.title}
                        </div>
                        {!quest?.completed && (
                          <div
                            className='ai-store-milestone-lp-banner-quest-action'
                            onClick={() => clickRedirectionHandler(quest)}
                          >
                            <GeneralIcons
                              kind='play'
                              width={20}
                              height={24}
                              color='#6730FF'
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className='ai-store-milestone-lp-banner-challenge-list completed'>
                  <div className='ai-store-milestone-lp-banner-daily-quest-complete'>
                    <div className='ai-store-milestone-lp-banner-dq-complete-img'>
                      <GeneralIcons
                        kind='pass'
                        color='#88D737'
                        bgColor='#FFF'
                      />
                    </div>
                    <p className='ai-store-milestone-lp-banner-dq-complete-title'>
                      {constantText?.dailyQuestCompleteTitle}
                    </p>
                    <p className='ai-store-milestone-lp-banner-dq-complete-desc'>
                      {constantText?.dailyQuestCompleteSubtitle}
                    </p>
                  </div>
                  <div
                    className='ai-store-milestone-lp-banner-back-cta'
                    onClick={navigateToExplore}
                  >
                    <div className='ai-store-milestone-lp-banner-back-cta-text'>
                      {constantText?.dailyQuestCompleteCTA}
                    </div>
                    <div className='ai-store-milestone-lp-banner-back-cta-bar'></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ChallengeCompletionPrompt redeemedMessage={''} />
        )
      ) : (
        <div className='ai-store-milestone-lp-wrapper'>
          <div className='ai-store-milestone-lp-back-btn'>
            <div
              className='ai-store-milestone-home-header'
              onClick={() => returnHandler()}
            >
              <BackButton
                color={'#FFF'}
                textVisible={false}
                isTriviaBackBtn={true}
              />
              <p>{challengeQuestData?.title}</p>
              <div className='ai-store-poll-home-back-button-wrapper'></div>
            </div>
          </div>
          <div className='ai-store-milestone-reward-claimed'>
            <MilestoneQuestError errorMessage={errorMessage} />
          </div>
        </div>
      )}
      <MilestoneCompletionDialog
        openCompletionDialog={openCompletionDialog}
        navigateToExplore={navigateToExplore}
      />
    </>
  )
}

Stepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
}

MilestoneLandingPage.propTypes = {
  milestoneQuestData: PropTypes.object.isRequired
}

ChallengeCompletionPrompt.propTypes = {
  redeemedMessage: PropTypes.string.isRequired
}

ChallengeProgressStatus.propTypes = {
  total_coupon_count: PropTypes.number.isRequired,
  available_coupon_count: PropTypes.number.isRequired
}

MilestoneLandingPage.propTypes = {
  returnHandler: PropTypes.func.isRequired,
  challengeId: PropTypes.string.isRequired,
  authorizationId: PropTypes.string.isRequired,
  milestoneQuestData: PropTypes.object.isRequired,
  errorStatus: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  navigateToExplore: PropTypes.func.isRequired
}

export default MilestoneLandingPage
