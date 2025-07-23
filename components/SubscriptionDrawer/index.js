import React from 'react'
import { SwipeableDrawer } from '@mui/material'
import './index.css'
import { useSubscriptionContext } from '../../context/SubscriptionContext'
import { useAppContext } from '../../context/AppContext'
import SmallCrossIcon from '../../static/SmallCrossIcon'
import PlanCard from './PlanCard'
import OfferCard from './OfferCard'
import { useTranslation } from 'react-i18next'
import PropType from 'prop-types'
import { getTenantName } from '../../helpers/tenantHelper'
import { tenantType } from '../../common/constants'

const drawerBGColor = {
  bold: 'linear-gradient(101.94deg, #09408B  0%, #053069 100%)',
  supreme: 'linear-gradient(172.9deg, #7F7250 8.01%, #BCB091 96.32%)'
}

const tenant = getTenantName()

const SubscriptionDrawer = ({ environment }) => {
  const { authorizationId } = useAppContext()
  const { isDrawerOpen, setIsDrawerOpen, subscriptionType, subscriptionData } =
    useSubscriptionContext()
  const { t } = useTranslation('common')

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    if (tenant === tenantType.tselhalo) {
      setIsDrawerOpen(isOpen)
    } else {
      setIsDrawerOpen(false)
    }
  }

  const handleSubscription = () => {
    window.dataLayer.push({
      event: `clicked haloUpgradeConfirm`,
      external_id: authorizationId || 'NA',
      app_name: 'haloUpgradeConfirm',
      explore_version: 'V4',
      event_source: 'halo_upgrade_drawer'
    })
    window.location.assign(subscriptionData?.subscriptionUrl)
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      className='subscription-drawer'
    >
      <div
        className='subscription-drawer-container'
        style={{
          background: drawerBGColor[subscriptionType]
        }}
      >
        <div className='subscription-header'>
          <div className='header-description'>
            <div className='header-main-text'>
              {t(subscriptionData.header.mainText)}
            </div>
            <div className='header-plan-text'>
              <span>{t(subscriptionData.header.planSubText)}</span>{' '}
              {t(subscriptionData.header.planType)}
            </div>
            {subscriptionData.header.subText && (
              <div className='header-sub-text'>
                {t(subscriptionData.header.subText)}
              </div>
            )}
          </div>
          <div onClick={toggleDrawer(false)}>
            <SmallCrossIcon />
          </div>
        </div>
        <div className='subscription-body'>
          <PlanCard planInfo={subscriptionData?.planInfo} />
          {subscriptionData?.offers?.map((item, index) => (
            <OfferCard
              offerImageUrl={item?.offerImageUrl}
              size={item?.size}
              key={`subscription-offer-${index}`}
              environment={environment}
            />
          ))}
        </div>
        <div className='subscription-footer'>
          <div className='plan-amount'>
            {t('tselHaloSubscription.currencyLocale')}
            {subscriptionData?.planAmount} / {t('tselHaloSubscription.month')}
          </div>
          <button className='subscription-btn' onClick={handleSubscription}>
            {t('tselHaloSubscription.upgrade')}
          </button>
        </div>
      </div>
    </SwipeableDrawer>
  )
}

export default SubscriptionDrawer

SubscriptionDrawer.propTypes = {
  environment: PropType.string
}
