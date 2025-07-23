import React, { useState } from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import './NewsSummaryDialogView.css'
import NewsSummaryCarouselView from './NewsSummaryCarouselView/NewsSummaryCarouselView'
import NewsSummaryCarouselView2 from './NewsSummaryCarouselView2/NewsSummaryCarouselView2'
import { newsCategoryMapper } from '../../../../common/constants'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import TokenHeader from '../../../TokenHeader/TokenHeader'
import { useFeatureAllowed } from '../../../../helpers/tenantHelper'

const NewsSummaryDialogView = ({
  open,
  newsCategory,
  newsCarouselData,
  initialCarouselIndex,
  handleNewsViewDialogClose,
  sourceOfReference,
  isWidget,
  environment,
  tenant,
  setRedirectLoading
}) => {
  const isTokenisationEnabled = useFeatureAllowed('tokenisation')
  const { t } = useTranslation('common')

  const [currentNews, setCurrentNews] = useState(
    newsCarouselData[initialCarouselIndex || 0]
  )

  const handleClose = () => {
    handleNewsViewDialogClose()
  }

  return (
    <>
      {isWidget ? (
        <NewsSummaryCarouselView2
          newsCarouselData={newsCarouselData}
          newsCategory={newsCategory}
          setCurrentNews={setCurrentNews}
          environment={environment}
          tenant={tenant}
          setRedirectLoading={setRedirectLoading}
        />
      ) : (
        <Dialog
          fullScreen
          open={open}
          onClose={null}
          className={`tt-nsdv-dialog ${sourceOfReference ? 'explore' : ''}`}
        >
          {sourceOfReference === 'explore' ? (
            <NewsSummaryCarouselView2
              newsCarouselData={newsCarouselData}
              newsCategory={newsCategory}
              setCurrentNews={setCurrentNews}
            />
          ) : (
            <>
              {isTokenisationEnabled && <TokenHeader background='#333333' />}
              <div className='tt-nscv-news-section-header'>
                <div className='tt-nscv-news-section-title'>
                  {newsCategoryMapper(newsCategory, false)}
                </div>
                <IconButton
                  aria-label='close'
                  onClick={handleClose}
                  sx={{ p: 0 }}
                >
                  <CloseIcon className='tt-nsdv-close-icon' />
                </IconButton>
              </div>
              <DialogContent sx={{ overflow: 'hidden' }}>
                <div className='tt-nsdv-carousel-wrapper'>
                  {newsCarouselData?.length ? (
                    <NewsSummaryCarouselView
                      newsCarouselData={newsCarouselData}
                      initialCarouselIndex={initialCarouselIndex}
                      newsCategory={newsCategory}
                      setCurrentNews={setCurrentNews}
                      handleNewsViewDialogClose={handleNewsViewDialogClose}
                      currentNews={currentNews}
                    />
                  ) : (
                    <div className='tt-no-news-placeholder'>
                      {t('news.noNewsRightNow')}
                    </div>
                  )}
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
    </>
  )
}

NewsSummaryDialogView.propTypes = {
  open: PropTypes.bool.isRequired,
  newsCategory: PropTypes.string.isRequired,
  newsCarouselData: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialCarouselIndex: PropTypes.number,
  handleNewsViewDialogClose: PropTypes.func.isRequired,
  sourceOfReference: PropTypes.string,
  isWidget: PropTypes.bool,
  environment: PropTypes.string,
  tenant: PropTypes.string,
  setRedirectLoading: PropTypes.func
}

export default NewsSummaryDialogView
