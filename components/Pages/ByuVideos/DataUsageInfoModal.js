import { Checkbox, FormControlLabel, SwipeableDrawer } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './index.css'

const DataUsageInfoModal = ({ open, handleClose, handleConfirm }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const onConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem('ustreamDataConsumptionInfo', 'true')
    }
    handleConfirm()
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={handleClose}
      className='byu-section-toggle-swipeable-drawer-wrapper'
      onOpen={() => {}}
      PaperProps={{
        sx: {
          padding: '1.5rem 1.5rem 2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }}
    >
      <img
        src='/images/byu/videos/dataConsumptionWarning.png'
        alt='Kuota Info'
        style={{ width: 152, height: 'auto', marginBottom: 24 }}
      />

      <div className='byu-aistore-video-data-consumption-modal-info-title'>
        Untuk Nonton di uStream, Kuota Kamu Akan Terpakai Nih!
      </div>

      <div className='byu-aistore-video-data-consumption-modal-info-desc'>
        Saat kamu akses uStream, kuota internet kamu akan otomatis terpakai
        sesuai pemakaian. Pastikan kuotamu cukup, ya – biar nonton makin lancar
        tanpa hambatan!
      </div>

      <FormControlLabel
        control={
          <Checkbox
            checked={dontShowAgain}
            onChange={() => setDontShowAgain((prev) => !prev)}
            style={{ accentColor: '#B8C1CB' }}
          />
        }
        label='Jangan munculkan lagi'
        style={{ marginBottom: 24 }}
      />

      <div className='byu-video-reminder-cta-confirm' onClick={onConfirm}>
        OK, Lanjut
      </div>

      <div className='byu-video-reminder-cta-cancel' onClick={handleClose}>
        Kembali
      </div>
    </SwipeableDrawer>
  )
}

DataUsageInfoModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func
}

export default DataUsageInfoModal
