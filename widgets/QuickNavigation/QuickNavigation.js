import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import {
  getLockedComponent,
  getWidgetComponentsLockedStatus
} from '../../helpers/getWidgetComponentsLockedStatus'
import { filterByDeviceCompatibility } from '../../utils/converter'
import GeneralIcons from '../../static/GeneralIcons'
import { useTranslation } from 'react-i18next'
import './QuickNavigation.css'

const FeaturedNavigationItem = ({
  productData,
  externalId,
  environment,
  setRedirectLoading,
  lockedComponent,
  tenant,
  isLocked,
  tenantLayout,
  children
}) => {
  // Feature Product Redirection
  const handleProductClick = (product) => {
    // Google Analytics
    window.dataLayer.push({
      event: 'gtm.click',
      'gtm.elementId': 'navigation-feature-product',
      external_id: externalId,
      explore_version: 'V4'
    })

    if (!isLocked) {
      // show loading spinner for all tenants
      setRedirectLoading(true)
      const delimiter = product?.url[environment]?.includes('?') ? '&' : '?'
      const redirectingURL = `${product?.url[environment]}${delimiter}tenant=${tenant}`
      window.location.assign(redirectingURL)
    }
  }

  return (
    <div data-cy={`explore-tile-${productData?.widgetComponentId}`}>
      <div
        className='widget-navigation-fp-item-container-new-explore'
        onClick={() => handleProductClick(productData)}
      >
        {lockedComponent}
        {children}
        <div className='widget-product-fp-nav-item-icon-new-explore'>
          <img
            className='widget-product-fp-nav-item-image-new-explore'
            src={`${getWidgetBaseUrl(environment)}${productData?.image}`}
            alt={productData?.widgetComponentId}
          />
          <div
            className='widget-product-fp-nav-item-title-new-explore'
            style={{
              color: tenantLayout?.navigationFeatureProduct?.primaryTextColor
            }}
          >
            {productData?.title}
          </div>
        </div>
      </div>
    </div>
  )
}

FeaturedNavigationItem.propTypes = {
  productData: PropTypes.object,
  externalId: PropTypes.string,
  environment: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  lockedComponent: PropTypes.node,
  tenant: PropTypes.string,
  isLocked: PropTypes.bool,
  tenantLayout: PropTypes.object,
  children: PropTypes.node
}

const QuickNavigation = ({
  navigationComponents,
  widgetComponents,
  userUnlockedComponents,
  externalId,
  environment,
  setRedirectLoading,
  tenant,
  tenantLayout,
  isUnlockedComponentsLoading,
  generalRedirectionHandler
}) => {
  const { t } = useTranslation('common')

  // Filter components based on device compatibility and locked status
  const allowedNavigationComponents = useMemo(() => {
    if (!navigationComponents?.length) {
      return []
    }
    const filteredAIAssistantProducts = getWidgetComponentsLockedStatus(
      navigationComponents,
      widgetComponents
    )

    return filterByDeviceCompatibility(filteredAIAssistantProducts).filter(
      (component) => component?.type === 'navigation'
    )
  }, [widgetComponents, navigationComponents])

  return (
    <div className={`widget-product-navigation-container-new-explore`}>
      {allowedNavigationComponents.map((product, index) => {
        const isLocked =
          product?.lockedStatus &&
          !userUnlockedComponents?.includes(product?.widgetComponentId)
        return (
          <div
            className='widget-product-ai-assistant-navigation-fp-content-new-explore'
            key={index}
          >
            <FeaturedNavigationItem
              productData={product}
              externalId={externalId}
              environment={environment}
              setRedirectLoading={setRedirectLoading}
              lockedComponent={getLockedComponent(
                isUnlockedComponentsLoading,
                isLocked
              )}
              tenant={tenant}
              isLocked={isLocked}
              tenantLayout={tenantLayout}
            />
          </div>
        )
      })}
      <div
        className='widget-product-ai-assistant-navigation-fp-content-new-explore'
        data-cy={`explore-tile-viewMore`}
        onClick={generalRedirectionHandler}
      >
        <div className='widget-product-view-more-item-container-new-explore'>
          <div className='widget-product-fp-view-more-item-icon-new-explore'>
            <GeneralIcons
              kind='forward-byu-lg'
              width={33}
              height={32}
              color='#6A7481'
            />
          </div>
          <div
            className='widget-product-fp-nav-item-title-new-explore'
            style={{
              color: tenantLayout?.navigationFeatureProduct?.primaryTextColor
            }}
          >
            {t('byu.widget.viewMore')}
          </div>
        </div>
      </div>
    </div>
  )
}

QuickNavigation.propTypes = {
  navigationComponents: PropTypes.array,
  widgetComponents: PropTypes.array,
  userUnlockedComponents: PropTypes.array,
  externalId: PropTypes.string,
  environment: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  lockedComponent: PropTypes.node,
  tenant: PropTypes.string,
  isLocked: PropTypes.bool,
  tenantLayout: PropTypes.object,
  isUnlockedComponentsLoading: PropTypes.bool,
  generalRedirectionHandler: PropTypes.func
}

export default QuickNavigation
