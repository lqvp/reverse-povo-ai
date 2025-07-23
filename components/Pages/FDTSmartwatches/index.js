import React, { useEffect, useState } from 'react'
import './index.css'
import AccordianFooter from './AccordianFooter'
import SmartWatchesCard from './SmartWatchesCard'
import { smartwatchesData } from '../../../static/smartwatchesData'
import EOIDialog from './EOIDialog/EOIDialog'
import LimitedTimeText from './LimitedTimeText'
import BackButton from '../../../static/BackButton'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useAppContext } from '../../../context/AppContext'

const Smartwatches = () => {
  const { authorizationId } = useAppContext()
  const [openEOIDialog, setOpenEOIDialog] = useState(false)
  const [EOIWatchId, setEOIWatchId] = useState('')

  useEffect(() => {
    const properties = {
      external_id: authorizationId,
      app_name: 'smartwatches_fdt'
    }
    trackEvent('smartwatch_lp_visit', properties)
  }, [authorizationId])

  const buyWatchHandler = (watchId) => {
    const properties = {
      external_id: authorizationId,
      app_name: 'smartwatches_fdt'
    }
    trackEvent('register_interest_popup_visit', properties)

    setOpenEOIDialog(true)
    setEOIWatchId(watchId.toString())
  }
  const handleEOIDialogClose = () => {
    setOpenEOIDialog(false)
    setEOIWatchId('')
  }

  return (
    <div className='sw-main-wrapper'>
      <div className='sw-back-button-wrapper'>
        <BackButton color={'#FFF'} />
      </div>
      <div className='sw-background-image'></div>
      <img
        className='sw-main-image'
        src='/images/smartwatches/watches_landing_image_new.png'
        alt=''
      />
      <LimitedTimeText />
      <div className='sw-cards-container'>
        {smartwatchesData?.map((smartwatchData, index) =>
          smartwatchData?.isActive ? (
            <SmartWatchesCard
              key={index}
              smartwatchData={smartwatchData}
              buyWatchHandler={buyWatchHandler}
            />
          ) : null
        )}
      </div>
      <div className='sw-accordian-footer'>
        <div className='sw-accordian-title'>Frequently Asked Questions</div>
        <AccordianFooter />
      </div>
      <EOIDialog
        openEOIDialog={openEOIDialog}
        EOIWatchId={EOIWatchId}
        handleEOIDialogClose={handleEOIDialogClose}
      />
    </div>
  )
}

export default Smartwatches
