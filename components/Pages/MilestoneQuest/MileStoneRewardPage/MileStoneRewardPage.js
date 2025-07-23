import React, { useEffect, useState } from 'react'
import { copyTextToClipboard } from '../../../../helpers/mediaHelper'
import BackButton from '../../../../static/BackButton'
import './MileStoneRewardPage.css'
import Loader from '../../../Loader/Loader'
import { axiosPatch } from '../../../../utils/axios'
import common from '@kelchy/common'
import { MILESTONE_TEXT_DATA } from '../../../../common/milestoneConstant'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import PropTypes from 'prop-types'

const constantText = MILESTONE_TEXT_DATA

const MilestoneRewardClaimed = ({ redeemedMessage }) => {
  return (
    <div className='ai-store-milestone-lp-banner-challenge-list completed'>
      <div className='ai-store-milestone-lp-banner-milestone-complete'>
        <p className='ai-store-milestone-lp-banner-dq-complete-title'>
          {redeemedMessage ?? constantText?.rewardClaimedTitle}
        </p>
      </div>
    </div>
  )
}

MilestoneRewardClaimed.propTypes = {
  redeemedMessage: PropTypes.string
}

const MileStoneRewardPage = ({
  returnHandler,
  challengeId,
  authorizationId,
  milestoneQuestData
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRedeemedCouponDetail, setUserRedeemedCouponDetails] =
    useState(null)
  const [redeemedMessage, setRedeemedMessage] = useState(null)

  useEffect(() => {
    const redeemCouponForUser = async () => {
      const body = {
        challenge_id: milestoneQuestData?.challenge_id || challengeId
      }
      const { data: userRedeemedCouponDetail, error } = await common.awaitWrap(
        axiosPatch('/challenges/claim_coupon', body)
      )

      if (!error && userRedeemedCouponDetail?.data) {
        const properties = {
          external_id: authorizationId,
          challenge_id: userRedeemedCouponDetail?.data?.challenge_id,
          coupon_id: userRedeemedCouponDetail?.data?._id,
          app_name: 'milestone_quest'
        }
        trackEvent('quest_claim_reward_click', properties)

        setUserRedeemedCouponDetails(userRedeemedCouponDetail.data)
      } else {
        const errorMessage =
          error?.response?.data?.error?.message ||
          'Something went wrong. Please try again!'
        setRedeemedMessage(errorMessage)
      }
      setIsLoading(false)
    }
    redeemCouponForUser()
  }, [milestoneQuestData?.challenge_id, challengeId, authorizationId])

  const copyCodeHandler = (couponCode) => {
    if (!couponCode) return
    setIsCopied(false)
    setIsCopying(true)
    copyTextToClipboard(couponCode, setIsCopied, setIsCopying)
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div
      className={`ai-store-milestone-reward-wrapper ${userRedeemedCouponDetail ? '' : 'claimed'}`}
    >
      <div className='ai-store-milestone-rp-header'>
        {userRedeemedCouponDetail && (
          <img
            className='ai-store-milestone-rp-completion'
            src='/images/ai_milestone_quest/milestone_completion.gif'
            alt='quest_completed_img'
          />
        )}
        <div
          className='ai-store-milestone-rp-back-btn'
          onClick={() => returnHandler()}
        >
          <BackButton
            color={'#FFF'}
            textVisible={false}
            isTriviaBackBtn={true}
          />
        </div>
      </div>
      {userRedeemedCouponDetail ? (
        <div className='ai-store-milestone-rp-detail-wrapper'>
          <div className='ai-store-milestone-rp-detail-title'>
            <div className='ai-store-milestone-rp-detail-header'>
              {milestoneQuestData?.title}
            </div>
            {/*  Commented for now for non data - coupons
          <div className='ai-store-milestone-rp-detail-sub-header'>on data top ups</div> */}
          </div>
          <div className='ai-store-milestone-rp-detail-code-desc'>
            <div className='ai-store-milestone-rp-detail-code'>
              {userRedeemedCouponDetail?.code}
            </div>
            <button
              className={`ai-store-milestone-rp-detail-copy ${isCopied ? 'copied' : ''}`}
              onClick={() => copyCodeHandler(userRedeemedCouponDetail?.code)}
            >
              {isCopying ? (
                <div className='dot-flashing-wrapper'>
                  <div className='dot-flashing'></div>
                </div>
              ) : isCopied ? (
                'Copied'
              ) : (
                'Copy'
              )}
            </button>
          </div>
          <div className='ai-store-milestone-rp-detail-tnc'>
            <div className='ai-store-milestone-rp-detail-tnc-title'>
              Details
            </div>
            <ul>
              <li>This code is only valid for one month. Use Now!</li>
            </ul>
          </div>
          <div className='ai-store-milestone-rp-detail-htr'>
            <div className='ai-store-milestone-rp-detail-htr-title'>
              How to Redeem
            </div>
            <ol>
              <li>Copy the reward code</li>
              <li>
                Open the Foodpanda app and go to the &apos;Subscriptions&apos;
                page
              </li>
              <li>Select the monthly subscriptions</li>
              <li>
                Upon checkout, apply the copied code to get your free PandaPro
                subscription
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className='ai-store-milestone-reward-claimed'>
          <MilestoneRewardClaimed redeemedMessage={redeemedMessage} />
        </div>
      )}
    </div>
  )
}

MileStoneRewardPage.propTypes = {
  returnHandler: PropTypes.func.isRequired,
  challengeId: PropTypes.string,
  authorizationId: PropTypes.string,
  milestoneQuestData: PropTypes.object
}

export default MileStoneRewardPage
