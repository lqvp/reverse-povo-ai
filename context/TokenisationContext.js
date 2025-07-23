import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { axiosPost } from '../utils/axios'
import common from '@kelchy/common'
import { TOKENISATION_USE_CASE_TYPE } from '../helpers/constant'

const TokenisationContext = createContext()

export const useTokenisationContext = () => useContext(TokenisationContext)

export const TokenisationContextProvider = ({ children }) => {
  const [isTokenisationModelOpen, setIsTokenisationModelOpen] = useState(false)
  const [tokenisationUseCaseType, setTokenisationUseCaseType] = useState(null)
  const [tokenisationUseCaseData, setTokenisationUseCaseData] = useState(null)
  const [userTokenCount, setUserTokenCount] = useState(0)
  const [isRewardCollecting, setIsRewardCollecting] = useState(false)
  const [isRewardCollected, setIsRewardCollected] = useState(false)
  const [transactionId, setTransactionId] = useState(null)
  const [mvpTokenAmount, setMvpTokenAmount] = useState(0)
  const [widgetComponentIds, setWidgetComponentIds] = useState([])
  const [isLogEventCreating, setIsLogEventCreating] = useState(false)
  const [isLogEventCreated, setLogEventCreated] = useState(false)
  const [error, setError] = useState(null)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [unlockedMvpMetaData, setUnlockedMvpMetaData] = useState({
    redirectUrl: null,
    redirectAction: null,
    unlockedMvpName: null,
    args: []
  })
  const [unlockedMessageStatus, setUnlockedMessageStatus] = useState(false)
  const [isMvpUnlocked, setIsMvpUnlocked] = useState(false)
  const [dailyStreakTokenDetails, setDailyStreakTokenDetails] = useState(null)
  const [mvpMetaData, setMvpMetaData] = useState(null)
  const [burnSpecDetails, setBurnSpecDetails] = useState(null)
  const [isBurnSpecDetailsLoading, setIsBurnSpecDetailsLoading] =
    useState(false)
  const [isBurnSpecDetailsError, setIsBurnSpecDetailsError] = useState(false)
  const [burnRedirection, setIsBurnRedirection] = useState(false)

  // Set isTokenisationModelOpen in session storage
  useEffect(() => {
    sessionStorage.setItem('isTokenisationModalOpen', isTokenisationModelOpen)
  }, [isTokenisationModelOpen])

  //  Create log event
  const createLogEvent = async (mvpMetaData) => {
    setError(null)
    setIsLogEventCreating(true)
    const { data: logEvent, error: logEventError } = await common.awaitWrap(
      axiosPost(`/user/token-log-transaction/earn`, {
        user_event: mvpMetaData?.user_event,
        app_name: mvpMetaData?.app_name,
        metadata: {
          event: mvpMetaData?.event,
          swipe_depth: mvpMetaData?.swipe_depth || 0
        }
      })
    )

    if (!logEventError && logEvent?.data?.transaction) {
      setTransactionId(logEvent?.data?.transaction?.transaction_id)
      setMvpTokenAmount(logEvent?.data?.transaction?.token_config?.token_amount)
      if (!logEvent?.data?.transaction?.is_redeemed) {
        setLogEventCreated(true)
        rewardCollectHandler(logEvent?.data?.transaction?.transaction_id)
      }
    } else {
      setError('tokenization.logEventErrorMessage')
    }
    setIsLogEventCreating(false)
  }

  // Unlock and process transaction
  const unlockAndProcessTransaction = async () => {
    setError(null)
    setIsUnlocking(true)
    const { data: unlockedTransaction, error: unlockedTransactionError } =
      await common.awaitWrap(
        axiosPost(
          `/user/token-transaction/unlock-product-and-process-transaction`,
          {
            transaction_id: transactionId,
            widget_component_ids: [...widgetComponentIds]
          }
        )
      )

    if (!unlockedTransactionError && unlockedTransaction?.data) {
      setUnlockedMessageStatus(true)
      setUserTokenCount(unlockedTransaction?.data?.token_amount)
      setTimeout(() => {
        setUnlockedMessageStatus(false)
        setIsMvpUnlocked(true)
      }, 1000)
    } else {
      setError('tokenization.premiumContentUnlockError')
    }
    setIsUnlocking(false)
  }

  // Reward collect handler
  const rewardCollectHandler = async (transactionId) => {
    if (transactionId) {
      setIsRewardCollecting(true)
      const { data: rewardCollection, error: rewardCollectionError } =
        await common.awaitWrap(
          axiosPost(`/user/token-transaction/process`, {
            transaction_ids: [transactionId]
          })
        )

      if (!rewardCollectionError && rewardCollection?.data) {
        setUserTokenCount(rewardCollection?.data?.[0]?.tokenCount)
        setIsRewardCollected(true)
        setIsTokenisationModelOpen(true)
        setTimeout(() => {
          setIsTokenisationModelOpen(false)
          setTokenisationUseCaseData(null)
        }, 5000)
      }
      setIsRewardCollecting(false)
    }
  }

  //  Create log event
  const getTokenSpec = async (mvpMetaData, isUnlockComponent) => {
    if (isUnlockComponent) {
      setError(null)
      setIsLogEventCreating(true)
      setMvpMetaData(mvpMetaData)
      const { data: logEvent, error: logEventError } = await common.awaitWrap(
        axiosPost(`/user/token-config/config-by-event-and-app-name`, {
          user_event: mvpMetaData?.user_event,
          app_name: mvpMetaData?.app_name
        })
      )

      if (!logEventError && logEvent?.data) {
        setMvpTokenAmount(logEvent?.data?.token_amount)
        setIsTokenisationModelOpen(true)
        setLogEventCreated(true)
      } else {
        setError('tokenization.logEventErrorMessage')
      }
      setIsLogEventCreating(false)
    }
  }

  //  Create log event by app name
  const getTokenSpecByAppName = async (mvpMetaData) => {
    setIsBurnSpecDetailsLoading(true)
    const { data: logEvent, error: logEventError } = await common.awaitWrap(
      axiosPost(`/user/token-config/config-by-service`, {
        service_id: mvpMetaData?.app_name
      })
    )
    if (!logEventError && logEvent?.data) {
      setIsBurnSpecDetailsError(false)
      setBurnSpecDetails(logEvent?.data)
    } else {
      setIsBurnSpecDetailsError(true)
    }
    setIsBurnSpecDetailsLoading(false)
  }

  // Call for unlocking of the widget component through deliberated means of user action
  const unlockPremiumContent = async (
    args,
    metaData,
    redirectAction,
    tokenAmount,
    widgetComponentIdentifiers
  ) => {
    setError(null)
    setIsUnlocking(true)
    const mvpDataPoint = metaData ? metaData : mvpMetaData
    const widgetIdentifiers = widgetComponentIdentifiers
      ? widgetComponentIdentifiers
      : widgetComponentIds
    if (userTokenCount - tokenAmount < 0) {
      setTokenisationUseCaseType(TOKENISATION_USE_CASE_TYPE.lowBalance)
      setIsTokenisationModelOpen(true)
      setTimeout(() => {
        setIsTokenisationModelOpen(false)
        setTokenisationUseCaseData(null)
        setIsUnlocking(false)
      }, 2000)
    } else {
      const { data: unlockedTransaction, error: unlockedTransactionError } =
        await common.awaitWrap(
          axiosPost(`/user/token-log-transaction/burn`, {
            user_event: mvpDataPoint?.user_event,
            app_name: mvpDataPoint?.app_name,
            widget_component_ids: [...widgetIdentifiers],
            metadata: {
              event: mvpDataPoint?.event,
              swipe_depth: mvpDataPoint?.swipe_depth || 0
            }
          })
        )

      if (!unlockedTransactionError && unlockedTransaction?.data) {
        setUnlockedMessageStatus(true)
        setUserTokenCount(unlockedTransaction?.data?.updatedToken?.tokenCount)
        setUnlockedMessageStatus(false)
        setIsMvpUnlocked(true)
        handleRedirect(args, redirectAction)
      } else {
        setError('tokenization.premiumContentUnlockError')
      }
      setIsUnlocking(false)
    }
  }

  // Handle the redirect after burning of the token
  const handleRedirect = (args, unlockData) => {
    setIsBurnRedirection(true)
    const redirection = unlockData ? unlockData : unlockedMvpMetaData
    if (redirection?.redirectAction) {
      if (redirection?.args) {
        if (Array.isArray(redirection?.args)) {
          redirection.redirectAction(...redirection.args)
        } else if (typeof redirection?.args === 'string') {
          redirection.redirectAction(
            args === redirection?.args ? redirection?.args : args
          )
        }
      } else {
        redirection.redirectAction()
      }
      setIsTokenisationModelOpen(false)
      setIsMvpUnlocked(false)
    } else if (redirection?.redirectUrl) {
      setIsTokenisationModelOpen(false)
      setIsMvpUnlocked(false)
      window.location.assign(redirection?.redirectUrl)
    }
    setIsBurnRedirection(false)
  }

  return (
    <TokenisationContext.Provider
      value={{
        isTokenisationModelOpen,
        setIsTokenisationModelOpen,
        tokenisationUseCaseType,
        setTokenisationUseCaseType,
        tokenisationUseCaseData,
        setTokenisationUseCaseData,
        userTokenCount,
        setUserTokenCount,
        createLogEvent,
        unlockAndProcessTransaction,
        rewardCollectHandler,
        isRewardCollecting,
        isRewardCollected,
        transactionId,
        mvpTokenAmount,
        setWidgetComponentIds,
        isLogEventCreating,
        isLogEventCreated,
        error,
        isUnlocking,
        setUnlockedMvpMetaData,
        unlockedMvpMetaData,
        unlockedMessageStatus,
        isMvpUnlocked,
        setIsMvpUnlocked,
        dailyStreakTokenDetails,
        setDailyStreakTokenDetails,
        getTokenSpec,
        unlockPremiumContent,
        handleRedirect,
        getTokenSpecByAppName,
        burnSpecDetails,
        isBurnSpecDetailsLoading,
        isBurnSpecDetailsError,
        setMvpMetaData,
        burnRedirection
      }}
    >
      {children}
    </TokenisationContext.Provider>
  )
}

TokenisationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

TokenisationContextProvider.displayName = 'TokenisationContextProvider'
