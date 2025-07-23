import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
import {
  API_ERROR_RESPONSE,
  BASIC_UI_CONFIG,
  camelToSnake,
  toCamelCase
} from '../../../../common/constants'
import BackButton from '../../../../static/BackButton'
import { axiosGet } from '../../../../utils/axios'
import Loader from '../../../Loader/Loader'
import common from '@kelchy/common'
import { getGroupedByCategory } from '../../../../helpers/helperFunctions'
import FunWithSelfies from './FunWithSelfies'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const CardSectionWrapper = ({
  header,
  title,
  groupResponse,
  navigate,
  externalId
}) => {
  const handleClick = (appData) => {
    const properties = {
      external_id: externalId,
      app_name: 'ai_chatbot'
    }
    trackEvent(`clicked ${appData?.feature_id}`, properties)
    if (appData?.feature_id === 'meme') {
      navigate('/meme-generator')
    } else {
      navigate('/ai-chatbox', { state: appData })
    }
  }

  return (
    <div
      className='ai-chatbot-lp-section-card-wrapper-item'
      id={toCamelCase(header)}
    >
      <div
        className='ai-chatbot-lp-section-card-item-header'
        style={{
          color: `${BASIC_UI_CONFIG[header]?.headerColor}`
        }}
      >
        {title}
      </div>
      <div className='ai-chatbot-lp-section-card-item-cards'>
        {groupResponse &&
          groupResponse?.map((response, index) => {
            const isLastOdd =
              groupResponse.length % 2 !== 0 &&
              index === groupResponse.length - 1
            return (
              <div
                key={index}
                className='ai-chatbot-lp-section-card-item-card'
                style={{
                  background: `${
                    BASIC_UI_CONFIG[toCamelCase(header)]?.iconCardBgColor
                  }`,
                  width: isLastOdd ? '100%' : 'calc(50% - 0.625rem)'
                }}
                onClick={() => handleClick(response)}
              >
                <div className='ai-chatbot-lp-section-item-cards-header-details'>
                  <img
                    height='30'
                    width='30'
                    src={response?.icon_url}
                    alt='card_image'
                    className='ai-chatbot-lp-section-item-cards-image'
                  />
                  <div className='ai-chatbot-lp-section-item-cards-header'>
                    {response?.title}
                  </div>
                </div>
                <div className='ai-chatbot-lp-section-item-cards-description'>
                  {response?.description}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

CardSectionWrapper.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  groupResponse: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigate: PropTypes.func.isRequired,
  externalId: PropTypes.string.isRequired
}

const ListSectionWrapper = ({
  header,
  title,
  groupResponse,
  navigate,
  externalId
}) => {
  const handleClick = (appData) => {
    const properties = {
      external_id: externalId,
      app_name: 'ai_chatbot'
    }
    trackEvent(`clicked ${appData?.feature_id}`, properties)
    navigate('/ai-chatbox', { state: appData })
  }

  return (
    <div className='ai-chatbot-lp-section-list-wrapper' id={header}>
      <div
        className='ai-chatbot-lp-section-list-item-header'
        style={{
          color: `${BASIC_UI_CONFIG[header]?.headerColor}`
        }}
      >
        {title}
      </div>
      <div className='ai-chatbot-lp-section-list-item-cards'>
        {groupResponse &&
          groupResponse?.map((response, index) => {
            return (
              <div
                key={index}
                className='ai-chatbot-lp-section-list-item-card'
                onClick={() => handleClick(response)}
              >
                <img
                  width='38'
                  height='38'
                  src={
                    header !== 'featured'
                      ? response?.icon_url
                      : response?.highlighted_card?.icon_url
                  }
                  alt='card_image'
                  style={{
                    background: `${BASIC_UI_CONFIG[header]?.iconCardBgColor}`
                  }}
                />
                <div className='ai-chatbot-lp-section-list-item-cards-details'>
                  <div className='ai-chatbot-lp-section-list-item-cards-header'>
                    {response?.title}
                  </div>
                  <div className='ai-chatbot-lp-section-list-item-cards-description'>
                    {response?.description}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

ListSectionWrapper.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  groupResponse: PropTypes.arrayOf(PropTypes.object).isRequired,
  navigate: PropTypes.func.isRequired,
  externalId: PropTypes.string.isRequired
}

const CommonSearchBanner = ({ externalId, navigate }) => {
  const [userInput, setUserInput] = useState('')
  const { t } = useTranslation('common')

  const handlePromptSubmit = (e) => {
    e?.preventDefault()
    if (!userInput) {
      return
    }
    const properties = {
      external_id: externalId,
      app_name: 'ai_chatbot'
    }
    trackEvent(`clicked search_ai`, properties)
    navigate('/ai-chatbox', {
      state: { title: t('aiApps.aiSearch'), initialPrompt: userInput }
    })
  }
  return (
    <div className='ai-chatbot-search-banner-wrapper'>
      <div className='ai-chatbot-search-banner-title'>
        {t('aiApps.landingPage.searchBanner.header')}
      </div>
      <div className='ai-chatbot-search-banner-desc'>
        {t('aiApps.landingPage.searchBanner.subHeader')}
      </div>
      <form
        className='ai-chatbot-search-chatbox-input'
        onSubmit={handlePromptSubmit}
      >
        <input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t('aiApps.landingPage.searchBanner.inputPlaceholder')}
        />
        <button type='submit'>
          <ArrowForwardIcon fontSize='medium' style={{ fill: '#fff' }} />
        </button>
      </form>
    </div>
  )
}

CommonSearchBanner.propTypes = {
  externalId: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired
}

const LandingPage = () => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const [activeChatbotFeature, setActiveChatbotFeature] = useState([])
  const [selectedPill, setSelectedPill] = useState('')
  const [groupedActiveChatbotFeature, setGroupedActiveChatbotFeature] =
    useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getAllActiveFeatures = useCallback(async () => {
    setIsLoading(true)
    const { data: allActiveChatbotFeature } = await common.awaitWrap(
      axiosGet('/chatbot/feature/active', {})
    )
    if (allActiveChatbotFeature?.data) {
      setActiveChatbotFeature(allActiveChatbotFeature?.data)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllActiveFeatures()
  }, [getAllActiveFeatures])

  const pillSelection = (pillItemCategory) => {
    const properties = {
      external_id: authorizationId,
      tab_name: camelToSnake(pillItemCategory),
      app_name: 'ai_chatbot'
    }
    trackEvent('ai_app_tab_click', properties)
    setSelectedPill(pillItemCategory)
    document
      .getElementById(pillItemCategory)
      .scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (activeChatbotFeature && activeChatbotFeature?.length > 0) {
      const groupedData = getGroupedByCategory(activeChatbotFeature)
      setGroupedActiveChatbotFeature(groupedData)
      setIsLoading(false)
    }
  }, [activeChatbotFeature])

  useEffect(() => {
    if (groupedActiveChatbotFeature?.groupedFeature) {
      setSelectedPill(
        Object.keys(groupedActiveChatbotFeature?.groupedFeature)[0]
      )
    }
  }, [groupedActiveChatbotFeature?.groupedFeature])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='ai-chatbot-lp-backdrop'>
          <div className='ai-chatbot-lp-wrapper'>
            <div className='ai-chatbot-lp-common-content-wrapper'>
              <BackButton color={'#BFBFBF'} textVisible={false} />
              <div className='ai-chatbot-lp-header-title'>
                {t('aiApps.landingPage.header')}
              </div>
              <div className='ai-chatbot-lp-header-subtitle'>
                {t('aiApps.landingPage.subHeader')}
              </div>
            </div>
            {typeof groupedActiveChatbotFeature?.groupedFeature === 'object' ? (
              <>
                <div className='ai-chatbot-lp-category-pill-wrapper'>
                  {Object.keys(groupedActiveChatbotFeature?.groupedFeature)
                    ?.length > 0 &&
                    Object.keys(
                      groupedActiveChatbotFeature?.groupedFeature
                    )?.map((pillItem, index) => (
                      <div
                        className={`ai-chatbot-lp-category-pill ${tenant} ${
                          selectedPill === pillItem ? 'active' : ''
                        }`}
                        key={`pill-key-${index}`}
                        onClick={() => pillSelection(pillItem)}
                      >
                        {pillItem.toLowerCase() === 'funwithselfies'
                          ? t('aiApps.fun')
                          : groupedActiveChatbotFeature?.categoryTitle[
                              pillItem
                            ]}
                      </div>
                    ))}
                </div>
                <CommonSearchBanner
                  externalId={authorizationId}
                  navigate={navigate}
                />
                <div className='ai-chatbot-lp-common-content-wrapper'>
                  <div className='ai-chatbot-lp-section-wrapper'>
                    {Object.keys(
                      groupedActiveChatbotFeature?.groupedFeature
                    )?.map((category, index) =>
                      BASIC_UI_CONFIG[category]?.section === 'list' ? (
                        <ListSectionWrapper
                          key={`app-section-${index}`}
                          title={
                            groupedActiveChatbotFeature?.categoryTitle[category]
                          }
                          header={category}
                          navigate={navigate}
                          groupResponse={
                            groupedActiveChatbotFeature?.groupedFeature[
                              category
                            ]
                          }
                          externalId={authorizationId}
                        />
                      ) : BASIC_UI_CONFIG[category]?.section === 'card' ? (
                        <CardSectionWrapper
                          key={`app-section-${index}`}
                          title={
                            groupedActiveChatbotFeature?.categoryTitle[category]
                          }
                          header={category}
                          navigate={navigate}
                          groupResponse={
                            groupedActiveChatbotFeature?.groupedFeature[
                              category
                            ]
                          }
                          externalId={authorizationId}
                        />
                      ) : (
                        <FunWithSelfies
                          key={`app-section-${index}`}
                          title={
                            groupedActiveChatbotFeature?.categoryTitle[category]
                          }
                          header={category}
                          navigate={navigate}
                          groupResponse={
                            groupedActiveChatbotFeature?.groupedFeature[
                              category
                            ]
                          }
                          externalId={authorizationId}
                        />
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className='ai-chatbot-lp-common-content-wrapper ai-chatbot-lp-category-dynamic-content-wrapper'>
                {API_ERROR_RESPONSE.generic_error}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default LandingPage
