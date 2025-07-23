import { styled } from '@mui/material'
import React from 'react'
import { getWidgetBaseUrl } from '../helpers/helperFunctions'
import PropTypes from 'prop-types'
import UnlockCTA from '../components/TokenisationModal/UnlockCTA'
import { useTenantConfig } from '../useTenantConfig'
import { getTenantName } from '../helpers/tenantHelper'

const tenant = getTenantName()

const LockedLoaderOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 90,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '14px'
})

const LockedImage = styled('img')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '&.right': {
    top: '20px',
    left: 'unset',
    right: '20px',
    transform: 'unset'
  }
})

const EventTokenSpec = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '&.right': {
    top: '20px',
    left: 'unset',
    right: '20px',
    transform: 'unset'
  }
})

const LockedLoader = ({
  environment,
  isLoading = true,
  lockedIconWidth = '55px',
  lockedLoadingIconWidth = '90px',
  lockedIconPosition = 'center',
  eventTokenSpecs = false,
  type = 'check'
}) => {
  const tenantLayout = useTenantConfig(tenant)
  return (
    <LockedLoaderOverlay
      style={{
        borderRadius: tenantLayout?.navigationFeatureProduct?.lockBorderRadius
      }}
    >
      {eventTokenSpecs ? (
        <EventTokenSpec>
          <UnlockCTA type={type} eventData={eventTokenSpecs} />
        </EventTokenSpec>
      ) : (
        <LockedImage
          src={`${getWidgetBaseUrl(environment)}/images/${isLoading ? 'locked_loader.gif' : 'Locked_icon.png'}`}
          style={{
            width: isLoading ? lockedLoadingIconWidth : lockedIconWidth
          }}
          alt='locked_loader'
          className={`locked-icon ${lockedIconPosition}`}
        />
      )}
    </LockedLoaderOverlay>
  )
}

LockedLoader.propTypes = {
  environment: PropTypes.string,
  isLoading: PropTypes.bool,
  lockedIconPosition: 'center' | 'right',
  lockedIconWidth: PropTypes.string,
  lockedLoadingIconWidth: PropTypes.string,
  eventTokenSpecs: PropTypes.object,
  type: PropTypes.string
}

export default LockedLoader
