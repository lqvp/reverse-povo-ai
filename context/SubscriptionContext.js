import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { subscriptionOfferData } from '../components/SubscriptionDrawer/subscriptionOfferData'
import { SUBSCRIPTION_TYPE } from '../helpers/constant'

const SubscriptionContext = createContext()

export const useSubscriptionContext = () => useContext(SubscriptionContext)

export const SubscriptionContextProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState(
    SUBSCRIPTION_TYPE.bold
  )
  const [subscriptionData, setSubscriptionData] = useState(
    subscriptionOfferData[SUBSCRIPTION_TYPE.bold]
  )

  return (
    <SubscriptionContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        subscriptionType,
        setSubscriptionType,
        subscriptionData,
        setSubscriptionData
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

SubscriptionContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

SubscriptionContext.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  subscriptionType: PropTypes.string.isRequired,
  setSubscriptionType: PropTypes.func.isRequired,
  subscriptionData: PropTypes.object.isRequired,
  setSubscriptionData: PropTypes.func.isRequired
}

SubscriptionContext.displayName = 'SubscriptionContext'
