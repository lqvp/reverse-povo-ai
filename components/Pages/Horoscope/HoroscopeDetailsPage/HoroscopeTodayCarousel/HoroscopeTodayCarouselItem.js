import React, { useState } from 'react'
import UnlockCTA from '../../../../TokenisationModal/UnlockCTA'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import GeneralIcons from '../../../../../static/GeneralIcons'
import { getTenantName } from '../../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../../useTenantConfig'
import { useEffect } from 'react'

const keyToTextMapper = {
  personal: 'horoscope.dailyHoroscope.personal',
  health: 'horoscope.dailyHoroscope.health',
  profession: 'horoscope.dailyHoroscope.career',
  emotions: 'horoscope.dailyHoroscope.emotions'
}

const tenant = getTenantName()

const HoroscopeTodayCarouselItem = ({
  accessState,
  data,
  isTokenisationEnabled,
  tokenDetails,
  index,
  tokenisedReadMoreUnlock
}) => {
  const { t } = useTranslation('common')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tenantLayout = useTenantConfig(tenant)

  useEffect(() => {
    const carouselHeight = `202px`
    document
      .querySelectorAll('.hs-today-prediction-outer-wrapper')
      .forEach((ele) => {
        ele.style.height = carouselHeight
      })
  }, [index])

  return (
    <div className='hs-today-cosmic-tip-outer-wrapper' key={index}>
      <div
        className={`hs-today-prediction-outer-wrapper ${tenant} ${!accessState[data?.value] && isTokenisationEnabled && 'restricted'}`}
        style={{
          background: tenantLayout?.horoscope?.contentBgColor
        }}
      >
        <div
          className={`hs-today-prediction-carousel-item ${!accessState[data?.value] && isTokenisationEnabled && 'restricted'}`}
          style={{
            background: tenantLayout?.horoscope?.contentBgColor
          }}
        >
          <div
            className='hs-today-prediction-wrapper'
            style={{
              background: tenantLayout?.horoscope?.contentBgColor
            }}
          >
            <div className='hs-today-prediction-title-wrapper'>
              <div className='hs-today-prediction-title-icon-wrapper'>
                <img src={data?.iconImage} alt='' height='20px' width='20px' />
              </div>
              <div
                className='hs-today-prediction-title-icon-text'
                style={{
                  color: tenantLayout?.horoscope?.textColor
                }}
              >
                {t(keyToTextMapper[data?.value])}
              </div>
            </div>
            <div className='hs-today-prediction-text-container open'>
              {!isModalOpen ? <>{data?.prediction}</> : data?.prediction}
            </div>
          </div>
        </div>
        {!isModalOpen && (
          <div
            className={`hs-read-more ${tenant}`}
            onClick={() => setIsModalOpen(true)}
          >
            {t('horoscope.tarotSection.readMore')}
          </div>
        )}
        {!accessState[data?.value] && isTokenisationEnabled && (
          <div
            onClick={() =>
              tokenisedReadMoreUnlock(data?.value, tokenDetails?.token_amount)
            }
            className='hs-comic-read-more-card-btn'
          >
            <UnlockCTA type='read' eventData={tokenDetails} />
          </div>
        )}
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          className='hs-modal-content'
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            p: 2,
            borderRadius: 4,
            fontFamily: tenantLayout?.fonts?.horoscopePrimary
          }}
        >
          <div
            className={`hs-today-prediction-outer-wrapper ${tenant} ${!accessState[data?.value] && isTokenisationEnabled && 'restricted'}`}
          >
            <div
              className={`hs-today-prediction-carousel-item ${!accessState[data?.value] && isTokenisationEnabled && 'restricted'}`}
            >
              <div className={`hs-today-prediction-wrapper ${tenant}`}>
                <div className='hs-today-prediction-modal-wrap'>
                  <div className='hs-today-prediction-title-wrapper'>
                    <div className='hs-today-prediction-title-icon-wrapper'>
                      <img
                        src={data?.iconImage}
                        alt=''
                        height='20px'
                        width='20px'
                      />
                    </div>
                    <div
                      className='hs-today-prediction-title-icon-text'
                      style={{
                        color: tenantLayout?.horoscope?.textColor
                      }}
                    >
                      {t(keyToTextMapper[data?.value])}
                    </div>
                  </div>
                  <div
                    className='hs-today-prediction-modal-close-btn'
                    onClick={() => setIsModalOpen(false)}
                  >
                    <GeneralIcons kind={'cross-icon'} width={20} height={20} />
                  </div>
                </div>

                <div className='hs-today-prediction-text-container modal'>
                  {data?.prediction}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

HoroscopeTodayCarouselItem.propTypes = {
  accessState: PropTypes.object,
  data: PropTypes.shape({
    value: PropTypes.string,
    iconImage: PropTypes.string,
    key: PropTypes.string,
    prediction: PropTypes.string
  }).isRequired,
  isTokenisationEnabled: PropTypes.bool,
  tokenDetails: PropTypes.shape({
    token_amount: PropTypes.number
  }),
  index: PropTypes.number,
  tokenisedReadMoreUnlock: PropTypes.func
}

export default HoroscopeTodayCarouselItem
