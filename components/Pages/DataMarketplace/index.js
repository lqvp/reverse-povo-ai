import React, { useEffect, useState } from 'react'
import common from '@kelchy/common'
import './dataMarketplace.css'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { axiosPost } from '../../../utils/axios'
import Loader from '../../Loader/Loader'
import CoinIcon from '../../../static/CoinIcon'
import TokenHeader from '../../TokenHeader/TokenHeader'
import { useFeatureAllowed } from '../../../helpers/tenantHelper'
import { useTranslation } from 'react-i18next'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { useNavigate } from 'react-router-dom'
import { getDataMarketplacePath } from '../../../common/paths'
import AIChatboxIcon from '../../../static/AIChatboxIcon'
import { Modal } from '@mui/material'
import { getWidgetBaseUrl } from '../../../helpers/helperFunctions'

const DataMarketplace = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [couponConfigData, setCouponConfigData] = useState(null)
  const [couponsData, setCouponsData] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCouponConfig, setSelectedCouponConfig] = useState(null)
  const [isPurchasing, setIsPurchasing] = useState(false) // For purchase loading state
  const [purchaseSuccessData, setPurchaseSuccessData] = useState(null) // Holds data for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false) // Controls success modal visibiliy
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [copyingIndex, setCopyingIndex] = useState(null)
  const [totalDataValue, setTotalDataValue] = useState(null)

  const navigate = useNavigate()
  const { authorizationId } = useAppContext()
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { t } = useTranslation('common')

  useEffect(() => {
    const fetchCouponConfigData = async () => {
      setIsLoading(true)
      if (authorizationId) {
        trackEvent('data_marketplace_loaded', {
          external_id: authorizationId,
          app_name: 'data_marketplace'
        })
      }

      const { data: response, error } = await common.awaitWrap(
        axiosPost(`/user/coupon-config`, {
          earned_via: 'token',
          coupon_type: 'data_packs'
        })
      )

      if (error) {
        console.error('Error fetching coupon config data:', error)
        setCouponConfigData([])
      } else if (response?.data) {
        setCouponConfigData(response.data)
      } else {
        setCouponConfigData([])
        console.warn('No coupon config data received from API.')
      }

      setIsLoading(false)
    }
    fetchCouponConfigData()
    const fetchCouponsData = async () => {
      setIsLoading(true)
      const { data: response, error } = await common.awaitWrap(
        axiosPost(`/user/coupon-config/redeemed-coupons`, {
          earned_via: 'token',
          coupon_type: 'data_packs'
        })
      )

      if (error) {
        console.error('Error fetching coupons data:', error)
        setCouponsData([])
      } else if (response?.data) {
        setCouponsData(response.data)
        if (response?.totalDataValue) {
          setTotalDataValue(response.totalDataValue)
        }
      } else {
        setCouponsData([])
        console.warn('No coupon config data received from API.')
      }
      setIsLoading(false)
    }
    fetchCouponsData()
  }, [authorizationId])

  const openDrawer = (couponConfig) => {
    setSelectedCouponConfig(couponConfig)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedCouponConfig(null)
  }

  const copyCodeHandler = (code, index) => {
    setCopyingIndex(index)

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedIndex(index)
        setTimeout(() => {
          setCopiedIndex(null)
        }, 2000)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
      .finally(() => {
        setCopyingIndex(null)
      })
  }

  const handlePurchase = async () => {
    if (!selectedCouponConfig || isPurchasing) return

    setIsPurchasing(true)
    setPurchaseSuccessData(null)
    setShowSuccessModal(false)

    trackEvent('data_purchase_confirmed', {
      external_id: authorizationId,
      coupon_id: selectedCouponConfig.id,
      coupon_title: selectedCouponConfig.title,
      price: selectedCouponConfig.price
    })

    const { error } = await common.awaitWrap(
      axiosPost(`/user/coupon-config/claim-coupon`, {
        couponConfigID: selectedCouponConfig._id
      })
    )
    setIsPurchasing(false)
    if (error) {
      closeDrawer()
      trackEvent('data_purchase_error', {
        external_id: authorizationId,
        coupon_id: selectedCouponConfig?.id,
        error: error.message || 'Request failed'
      })
      navigate(getDataMarketplacePath())
      return
    } else {
      closeDrawer()
      trackEvent('data_purchase_success', {
        external_id: authorizationId,
        coupon_id: selectedCouponConfig.id,
        coupon_title: selectedCouponConfig.title
      })

      setPurchaseSuccessData({
        title: selectedCouponConfig.title,
        description: selectedCouponConfig.description
      })

      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
        setPurchaseSuccessData(null)
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className='dm-loading-container'>
        <Loader />
      </div>
    )
  }

  return (
    <div
      className={`data-marketplace-container ${isDrawerOpen ? 'drawer-open' : ''}`}
    >
      {isDrawerOpen && (
        <div className='dm-drawer-overlay' onClick={closeDrawer} />
      )}

      {isTokenisationEnabled && (
        <TokenHeader
          textColor='#000000'
          background='#fff'
          heading={t('dataMarketplace.header')}
          showBackButton={true}
        />
      )}

      <div className='dm-banner-container'>
        {totalDataValue ? (
          <>
            <img
              src='/images/data_marketplace/DataMarketplaceEarned.png'
              alt='Get free data with your tokens banner'
              className='dm-banner-image'
            />
            <div className='dm-banner-content'>{totalDataValue}</div>
          </>
        ) : (
          <img
            src='/images/data_marketplace/DataMarketplaceBanner.png'
            alt='Get free data with your tokens banner'
            className='dm-banner-image'
          />
        )}
      </div>

      <div className='dm-data-container'>
        <h2 className='dm-title'>
          {t('dataMarketplace.couponConfigsContainerHeader')}
        </h2>
        {couponConfigData && couponConfigData.length > 0 ? (
          couponConfigData.map((couponConfig, index) => (
            <div className='dm-card' key={index}>
              <div>
                <div className='dm-card-title'>
                  {couponConfig.title || 'N/A'}
                </div>
                <div className='dm-card-description'>
                  {couponConfig.description || 'Details unavailable'}
                </div>
              </div>
              <button
                className='dm-card-buy-button'
                onClick={() => openDrawer(couponConfig)}
              >
                {t('dataMarketplace.couponConfigBuyButtonText')}{' '}
                <CoinIcon width={16} height={16} />{' '}
                {typeof couponConfig?.token_config?.token_amount === 'number'
                  ? couponConfig.token_config.token_amount
                  : '--'}
              </button>
            </div>
          ))
        ) : (
          <div className='dm-missing-data-container'>
            {t('dataMarketplace.couponConfigsMissing')}
          </div>
        )}
      </div>
      <div className='dm-data-container'>
        <h2 className='dm-title'>
          {t('dataMarketplace.couponsContainerHeader')}
        </h2>
        {couponsData && couponsData.length > 0 ? (
          couponsData.map((coupon, index) => (
            <div className='dm-card' key={index}>
              <div className='dm-card-details'>
                <h3 className='dm-card-title'>
                  {coupon?.coupon_config?.title}
                </h3>
                <p className='dm-card-description'>
                  {coupon?.coupon_config?.description}
                </p>
              </div>
              <div className='dm-card-code'>
                <p className='dm-card-code-label'>Promo Code: {coupon?.code}</p>
                <button
                  className='dm-copy-button'
                  onClick={() => copyCodeHandler(coupon?.code, index)}
                  disabled={copyingIndex === index}
                >
                  {copyingIndex === index ? (
                    <div className='dot-flashing-wrapper'>
                      <div className='dot-flashing'></div>
                    </div>
                  ) : (
                    <>
                      {copiedIndex === index ? 'Copied' : 'Copy Code'}
                      <AIChatboxIcon
                        kind='copy'
                        width={20}
                        height={20}
                        className={`ai-chatbox-message-lsm-copy-icon ${copiedIndex === index ? 'copied' : ''}`}
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='dm-missing-data-container'>
            {t(
              'noDataPacksAvailable',
              'No previous purchases available at the moment.'
            )}
          </div>
        )}
      </div>

      <SwipeableDrawer
        anchor='bottom'
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsDrawerOpen(true)}
      >
        {selectedCouponConfig && (
          <div className='confirm-claim_coupon-container'>
            <div className='confirm-claim-coupon-details-container'>
              <h2 className='confirm-claim-coupon-container-title'>
                {t('dataMarketplace.confirmClaimCoupon')}
              </h2>

              <div className='confirm-claim-coupon-row'>
                <div className='confirm-claim-coupon-info'>
                  <div className='confirm-claim-coupon-title'>
                    {selectedCouponConfig.title || t('dataPack', 'Data Pack')}
                  </div>
                  <p className='confirm-claim-coupon-description'>
                    {selectedCouponConfig.description ||
                      t('noDetails', 'Details unavailable')}
                  </p>
                </div>

                <div className='confirm-claim-coupon-amount-container'>
                  <div className='confirm-claim-coupon-coin-icon'>
                    <CoinIcon width={30} height={30} />
                  </div>
                  <div className='confirm-claim-coupon-amount'>
                    {typeof selectedCouponConfig?.token_config?.token_amount ===
                    'number'
                      ? selectedCouponConfig.token_config.token_amount
                      : '--'}
                  </div>
                </div>
              </div>
            </div>

            <div className='confirm-claim-coupon-actions-container'>
              <button className='dm-cancel-button' onClick={closeDrawer}>
                {t('cancel', 'Cancel')}
              </button>
              <button className='dm-buy-button' onClick={handlePurchase}>
                {t('buyNow', 'Buy now')}
              </button>
            </div>
          </div>
        )}
      </SwipeableDrawer>
      {showSuccessModal && purchaseSuccessData && (
        <Modal
          open={showSuccessModal && purchaseSuccessData}
          aria-labelledby='tokenisation-modal-title'
          aria-describedby='tokenisation-modal-description'
          className={`tokenisation-modal`}
        >
          <div className='new-earn-modal'>
            <div className='app-new-earn-modal-header data-marketplace'>
              <div
                className={`modal-overlay ${showSuccessModal ? 'open' : ''}`}
                onClick={() => setShowSuccessModal(false)}
              >
                <div
                  className='dm-success-modal-content'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='success-purchase-container'>
                    <h2 className='success-purchase-container-title'>
                      {t('congratulations', 'Congratulations Data Unlocked')}
                    </h2>
                    <div className='success-purchase-container-item-amount'>
                      {purchaseSuccessData.title}
                    </div>
                    <p className='success-purchase-container-item-validity'>
                      {purchaseSuccessData.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='app-exploration-bg-new data-marketplace'>
              <img
                src={`${getWidgetBaseUrl()}/images/data_marketplace/DataMarketplaceSuccess.png`}
                alt='app-exploration-sparkle'
                className='new-earn-sparkle'
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default DataMarketplace
