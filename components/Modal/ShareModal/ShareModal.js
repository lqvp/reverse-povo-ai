import React from 'react'
import { Box, Button, Modal } from '@mui/material'
import './ShareModal.css'
import CloseIcon from '../../../static/CloseIcon'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const ShareModal = ({ open, handleModalClose, tenantLayout }) => {
  const { t } = useTranslation('common')

  return (
    <Modal
      open={open}
      onClose={() => handleModalClose(false)}
      aria-labelledby='child-modal-title'
      aria-describedby='child-modal-description'
      className='share-modal'
    >
      <Box
        className='share-modal-content'
        sx={{
          fontFamily: tenantLayout?.funWithSelfies?.fontFamily,
          color: tenantLayout?.funWithSelfies?.fontColor
        }}
      >
        <Box className='share-modal-header'>
          <h3 className='share-title'>{t('shareModal.shareWithCommunity')}</h3>
          <Button
            variant='text'
            disableElevation={true}
            className='close-icon-btn'
            onClick={() => handleModalClose(false)}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Button
          disableElevation={true}
          variant='contained'
          className='share-continue-btn'
          onClick={() => handleModalClose(true)}
          sx={{
            color: tenantLayout?.funWithSelfies?.btnConfig?.color,
            background: tenantLayout?.funWithSelfies?.btnConfig?.background,
            fontFamily: `${tenantLayout?.funWithSelfies?.fontFamily}!important`
          }}
        >
          {t('shareModal.continue')}
        </Button>
        <Button
          disableElevation={true}
          className='share-discard-btn'
          variant='text'
          onClick={() => handleModalClose(false)}
          sx={{
            fontFamily: `${tenantLayout?.funWithSelfies?.fontFamily}!important`
          }}
        >
          {t('shareModal.noThankYou')}
        </Button>
      </Box>
    </Modal>
  )
}

ShareModal.propTypes = {
  open: PropTypes.bool,
  handleModalClose: PropTypes.func,
  tenantLayout: PropTypes.object
}

export default ShareModal
