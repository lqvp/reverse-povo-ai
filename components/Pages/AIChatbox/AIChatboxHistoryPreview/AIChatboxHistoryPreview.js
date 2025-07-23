import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SwipeableDrawer } from '@mui/material'
import './AIChatboxHistoryPreview.css'
import AIChatboxIcon from '../../../../static/AIChatboxIcon'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import common from '@kelchy/common'
import { axiosGet } from '../../../../utils/axios'
import { groupAndSortHistory } from '../historyContextStackHelper'
import Loader from '../../../Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../../../../helpers/analyticsHelper'
import { useAppContext } from '../../../../context/AppContext'

const { tenant } = getConfigForHostname()

const historySectionConfig = {
  todayHistory: {
    title: 'Today',
    limit: 5
  },
  yesterdayHistory: {
    title: 'Yesterday',
    limit: 5
  },
  previous7DaysHistory: {
    title: 'Previous 7 days',
    limit: 10
  },
  previous30DaysHistory: {
    title: 'Previous 30 days',
    limit: 10
  }
}

const AIChatboxHistoryPreview = ({
  isDrawerOpen,
  setIsDrawerOpen,
  fetchAndSetHistoryMessages,
  isSublayout = false,
  activeContextId
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)
  const [historyData, setHistoryData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const navigate = useNavigate()
  const { authorizationId } = useAppContext()

  const fetchHistoryData = async () => {
    setIsLoading(true)
    setShowDrawer(true)
    const { data: historyData } = await common.awaitWrap(
      axiosGet('/chatbox/history-preview', {})
    )
    if (Array.isArray(historyData?.data)) {
      setHistoryData(historyData.data)
    } else {
      setHistoryData([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isDrawerOpen) {
      fetchHistoryData()
    } else {
      setShowDrawer(false)
    }
    // eslint-disable-next-line
  }, [isDrawerOpen])

  const handleFeatureNavigation = () => {
    const navigationUrl = '/ai-chatbox-features'
    navigate(navigationUrl, {
      state: { from: isSublayout ? 'feature-page' : '' }
    })
  }

  const getFilteredHistory = () => {
    const grouped = groupAndSortHistory(historyData) || {}

    if (!searchTerm || searchTerm.length < 3) {
      return grouped
    }

    const lowerSearch = searchTerm.toLowerCase()
    const filtered = {}

    Object.entries(grouped).forEach(([section, entries]) => {
      const matchingEntries = entries.filter((entry) =>
        entry?.title?.toLowerCase().includes(lowerSearch)
      )
      if (matchingEntries.length > 0) {
        filtered[section] = matchingEntries
      }
    })

    return filtered
  }

  const handleHistoryPopulationChange = (contextId) => {
    fetchAndSetHistoryMessages(contextId)
  }

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setIsDrawerOpen(isOpen)
  }

  const renderHistorySection = (
    key,
    entries,
    handleHistoryPopulationChange,
    activeContextId
  ) => {
    if (!entries || entries.length === 0) return null

    const config = historySectionConfig[key] || {
      title: key,
      limit: entries.length
    }
    const limitedEntries = entries.slice(0, config.limit)

    return (
      <div key={key} className='aichatbox-history-prev-section'>
        <div className='aichatbox-history-prev-section-title'>
          {config.title}
        </div>
        {limitedEntries.map((entry, index) => (
          <div
            className={`aichatbox-history-prev-entry ${activeContextId === entry._id ? 'active' : ''}`}
            key={index}
            onClick={() => handleHistoryPopulationChange(entry._id)}
          >
            {entry?.title || 'Untitled'}
          </div>
        ))}
      </div>
    )
  }

  const filteredHistory = getFilteredHistory()

  return (
    <SwipeableDrawer
      anchor='left'
      open={showDrawer}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      className='aichatbox-history-prev-drawer'
      PaperProps={{
        style: {
          width: '340px',
          maxWidth: '100%',
          height: '100%',
          borderRadius: 0,
          padding: '1.125rem 1.25rem 3rem',
          backgroundColor: '#F2F7FF'
        }
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className='aichatbox-history-prev-container'>
          <div className='aichatbox-history-prev-header'>
            <div className='aichatbox-history-prev-title'>
              {t('aiChatbox.circlesAITitle')}
            </div>
            <div
              className='aichatbox-history-prev-back-button'
              onClick={() => setIsDrawerOpen(false)}
            >
              <AIChatboxIcon
                kind='history-preview-close'
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className='aichatbox-history-prev-search-container'>
            <input
              type='text'
              className='aichatbox-history-prev-search-input'
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className='aichatbox-history-prev-search-icon'>
              <div className='aichatbox-history-prev-search-icon-wrapper'>
                <AIChatboxIcon
                  kind='history-search-icon'
                  width={20}
                  height={20}
                />
              </div>
            </span>
          </div>

          {tenantLayout?.aiChatBox?.showHistoryExploreApps && (
            <div
              className='aichatbox-history-prev-explore-apps'
              onClick={() => {
                // Google Analytics
                if (authorizationId) {
                  const properties = {
                    external_id: authorizationId,
                    app_name: 'ai_app_new',
                    tenant: tenant,
                    explore_version: tenantLayout?.exploreVersion || 'V4'
                  }
                  trackEvent('ai_view_more_click', properties)
                }
                handleFeatureNavigation()
              }}
            >
              <div className='aichatbox-history-prev-explore-apps-icon-wrapper'>
                <AIChatboxIcon
                  kind='history-all-apps-icon'
                  width={24}
                  height={24}
                />
              </div>
              <div className='aichatbox-history-prev-explore-apps-title'>
                {t('aiChatbox.allAppsHeaderTitle')}
              </div>
            </div>
          )}

          {tenantLayout?.aiChatBox?.showHistoryImageLibrary && (
            <div className='aichatbox-history-prev-explore-apps'>
              <div className='aichatbox-history-prev-explore-apps-icon-wrapper'>
                <AIChatboxIcon
                  kind='history-image-library-icon'
                  width={24}
                  height={24}
                />
              </div>
              <div className='aichatbox-history-prev-explore-apps-title'>
                {t('aiChatbox.allAppsHeaderTitle')}
              </div>
            </div>
          )}

          <div className='aichatbox-history-prev-list'>
            {filteredHistory &&
              Object.entries(filteredHistory).map(([key, value]) =>
                renderHistorySection(
                  key,
                  value,
                  handleHistoryPopulationChange,
                  activeContextId
                )
              )}
          </div>
        </div>
      )}
    </SwipeableDrawer>
  )
}

AIChatboxHistoryPreview.propTypes = {
  isDrawerOpen: PropTypes.bool,
  setIsDrawerOpen: PropTypes.func,
  fetchAndSetHistoryMessages: PropTypes.func,
  isSublayout: PropTypes.bool,
  activeContextId: PropTypes.string
}

export default AIChatboxHistoryPreview
