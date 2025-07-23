import React from 'react'
import LockedLoader from '../widgets/LockedLoader'

// function to get the locked status of the widget components
export const getWidgetComponentsLockedStatus = (
  data,
  widgetComponents,
  isBanner = false,
  isBannerReceived = false
) => {
  const widgetComponentsMap = new Map(
    widgetComponents?.map((item) => [item.widgetComponentId, item])
  )

  return data?.map((item) => {
    const currentItem = widgetComponentsMap.get(
      isBanner ? item.explore_banner_id : item.widgetComponentId
    )

    if (currentItem) {
      const isLocked =
        currentItem.lockedStatus === 'locked' ||
        (currentItem.lockedStatus === 'unlocked_with_validity' &&
          new Date().getTime() >
            new Date(currentItem.defaultValidityEndsAt).getTime())

      return {
        ...item,
        default: currentItem.default,
        enabled: currentItem.enabled,
        lockedStatus: isLocked,
        restrictToPlatform: {
          ios: {
            showOnPlatform: !currentItem.blockedPlatforms?.includes('ios')
          },
          android: {
            showOnPlatform: !currentItem.blockedPlatforms?.includes('android')
          }
        }
      }
    }

    return !isBannerReceived && { ...item, enabled: true }
  })
}

export const getLockedComponent = (
  isUnlockedLoading,
  isLocked,
  eventTokenSpecs,
  type,
  lockedIconWidth,
  lockedLoadingIconWidth,
  lockedIconPosition
) => {
  if (isUnlockedLoading) {
    return (
      <LockedLoader
        lockedIconWidth={lockedIconWidth}
        lockedLoadingIconWidth={lockedLoadingIconWidth}
        lockedIconPosition={lockedIconPosition}
      />
    )
  }
  if (isLocked) {
    return (
      <LockedLoader
        isLoading={false}
        lockedIconWidth={lockedIconWidth}
        lockedLoadingIconWidth={lockedLoadingIconWidth}
        lockedIconPosition={lockedIconPosition}
        eventTokenSpecs={eventTokenSpecs}
        type={type}
      />
    )
  }
  return ''
}
