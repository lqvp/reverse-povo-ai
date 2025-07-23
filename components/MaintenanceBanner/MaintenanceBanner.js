import React from 'react'
import './MaintenanceBanner.css'
import { useTranslation } from 'react-i18next'
import { Box, Dialog } from '@mui/material'
import PropTypes from 'prop-types'
import { TENANTS } from '../../common/constants'
import { getConfigForHostname } from '../../helpers/tenantHelper'

const imageSrcMap = {
  [TENANTS.POVO]: '/images/povo-maintenance.png',
  default: '/images/AI_store_error_image.png'
}
const { tenant } = getConfigForHostname()

const MaintenanceBanner = ({ open }) => {
  const { t } = useTranslation('common')
  return (
    <Dialog fullScreen open={open} className='maintenance-modal'>
      <Box className={`maintenance-content`}>
        <div className='maintenance-title'>{t('maintenanceBanner.title')}</div>
        <div className='maintenance-message'>
          {t('maintenanceBanner.message')}
        </div>
        <Box
          component={'img'}
          className='maintenance-image'
          src={imageSrcMap[tenant] ?? imageSrcMap.default}
          alt='maintenance image'
        />
      </Box>
    </Dialog>
  )
}

MaintenanceBanner.propTypes = {
  open: PropTypes.bool
}

export default MaintenanceBanner
