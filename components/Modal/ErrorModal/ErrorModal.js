import React from 'react'
import { Box, Button, Modal } from '@mui/material'
import '../ShareModal/ShareModal.css'
import CloseIcon from '../../../static/CloseIcon'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const ErrorModal = ({ errorModalData, handleModalClose, tenantLayout }) => {
  const { t } = useTranslation('common')

  return (
    <Modal
      open={errorModalData.openModal}
      onClose={() => handleModalClose(true)}
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
          <h3 className='share-title'>{t('errorModal.somethingWentWrong')}</h3>
          <Button
            variant='text'
            disableElevation={true}
            className='close-icon-btn'
            onClick={() => handleModalClose(true)}
          >
            <CloseIcon />
          </Button>
        </Box>
        {errorModalData?.errorMessage && (
          <div className='share-modal-body'>{errorModalData.errorMessage}</div>
        )}
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
          {t('errorModal.close')}
        </Button>
      </Box>
    </Modal>
  )
}

ErrorModal.propTypes = {
  errorModalData: PropTypes.shape({
    openModal: PropTypes.bool,
    errorMessage: PropTypes.string
  }).isRequired,
  handleModalClose: PropTypes.func,
  tenantLayout: PropTypes.object
}

export default ErrorModal
