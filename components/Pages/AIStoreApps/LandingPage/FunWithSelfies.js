import React, { useState } from 'react'
import { BASIC_UI_CONFIG } from '../../../../common/constants'
import { Box, Grid } from '@mui/material'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const appList = {
  avatar: {
    slug: 'photo-avatar'
  },
  animate: {
    slug: 'photo-animator'
  },
  sticker: {
    slug: 'sticker-picker'
  },
  glow_up: {
    slug: 'glow-me-up'
  }
}

const FunWithSelfies = ({
  header,
  title,
  groupResponse,
  navigate,
  externalId
}) => {
  const [selectedCard, setSelectedCard] = useState(0)
  const [selectedCardData, setSelectedCardData] = useState(
    groupResponse && groupResponse.length > 0 ? groupResponse[0] : null
  )
  const { t } = useTranslation('common')

  const handleCardClick = (id, appData) => {
    const properties = {
      external_id: externalId,
      product_name: appData?.feature_id,
      app_name: 'ai_chatbot'
    }
    trackEvent('ai_store_app_click', properties)
    setSelectedCard(id)
    setSelectedCardData(appData)
  }

  const cardClickHandler = () => {
    const properties = {
      external_id: externalId,
      app_name: 'ai_chatbot'
    }
    trackEvent(`clicked ${selectedCardData?.feature_id}`, properties)
    navigate(`/${appList[selectedCardData?.feature_id]?.slug}`)
  }

  return (
    <div className='ai-chatbot-lp-section-fun-item-wrapper' id={header}>
      <div
        className='ai-chatbot-lp-section-fun-item-header'
        style={{
          color: `${BASIC_UI_CONFIG[header]?.headerColor}`
        }}
      >
        {title}
      </div>
      <div className='ai-chatbot-lp-section-fun-item-card-wrapper'>
        {groupResponse &&
          groupResponse.length > 0 &&
          groupResponse.map((response, index) => {
            const appData = response
            return (
              <Grid item xs={12} sm={8} md={6} key={appData?.feature_id}>
                <Box
                  pl={0.375}
                  pt={0.375}
                  pb={1}
                  pr={0.375}
                  textAlign='center'
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedCard === index ? '#7281F2' : 'transparent',
                    transition: 'background-color 0.3s ease',
                    boxShadow:
                      selectedCard === index
                        ? '0px 2px 4px 0px rgba(0, 0, 0, 0.25) #7281F2'
                        : ''
                  }}
                  onClick={() => handleCardClick(index, appData)}
                >
                  <img
                    className='ai-chatbot-lp-section-fun-item-card-wrapper-tile-image'
                    src={appData?.icon_url}
                    alt='log_ai_apps'
                  />
                  <div
                    className='ai-chatbot-lp-section-fun-item-card-wrapper-tile-title'
                    style={{
                      color: selectedCard === index ? '#FFF' : 'inherit'
                    }}
                  >
                    {appData?.title}
                  </div>
                </Box>
              </Grid>
            )
          })}
      </div>
      {selectedCardData && selectedCardData?.thumbnail_url ? (
        <Box position='relative' textAlign='center' display='flex'>
          <img
            className='ai-chatbot-lp-section-fun-item-card-wrapper-tile-selected-image'
            src={selectedCardData?.thumbnail_url}
            alt={`Selected ${selectedCardData?.tileSpec?.title}`}
            style={{
              boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'
            }}
          />
          <button
            className='ai-chatbot-lp-section-fun-item-card-wrapper-tile-cta'
            onClick={cardClickHandler}
          >
            {t('aiApps.mediaApps.tryNow')}
          </button>
        </Box>
      ) : null}
    </div>
  )
}

FunWithSelfies.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  groupResponse: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigate: PropTypes.func.isRequired,
  externalId: PropTypes.string.isRequired
}

export default FunWithSelfies
