import './index.css'
import React, { useEffect, useMemo, useState } from 'react'
import RiddleMeSection from './RiddleMeSection'
import PollingGameSection from './PollingGameSection'
import RiddlePollIcons from '../../../static/riddlePollIcons'
import { RIDDLE_POLL_LAYOUT } from '../../../common/constants'
import { getTenantName } from '../../../helpers/tenantHelper'
import { useAppContext } from '../../../context/AppContext'
import { trackEvent } from '../../../helpers/analyticsHelper'
import BackButton from '../../../static/BackButton'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { useTenantConfig } from '../../../useTenantConfig'
import { useLocation } from 'react-router-dom'

const tenantId = getTenantName()
const riddleLayout = RIDDLE_POLL_LAYOUT['riddles']
const pollLayout = RIDDLE_POLL_LAYOUT['poll']

const RiddlePollSectionTab = ({ tab, isActive, onClick }) => {
  const tenantLayout = useTenantConfig(tenantId)
  return (
    <div
      className={`ai-store-riddle-poll-tab-wrapper ${isActive ? 'active' : ''}`}
      style={{
        backgroundColor: isActive
          ? RIDDLE_POLL_LAYOUT[tab?.id]?.tabActiveColor
          : '#FFF',
        color: !isActive ? RIDDLE_POLL_LAYOUT[tab?.id]?.tabActiveColor : '#FFF',
        padding: tab?.id === 'riddles' && tenantLayout?.riddlePoll?.ctaPadding
      }}
    >
      <button
        className={`ai-store-riddle-poll-tab-button`}
        style={{
          backgroundColor: isActive
            ? RIDDLE_POLL_LAYOUT[tab?.id]?.tabActiveColor
            : '#FFF',
          color: !isActive
            ? RIDDLE_POLL_LAYOUT[tab?.id]?.tabActiveColor
            : '#FFF',
          flex: tenantLayout?.riddlePoll?.ctaFlexBase
        }}
        onClick={() => onClick(tab.id)}
      >
        <div className='ai-store-riddle-poll-tab-icon'>
          <RiddlePollIcons
            kind={tab?.id}
            width={20}
            height={20}
            bgColor={
              !isActive ? RIDDLE_POLL_LAYOUT[tab?.id]?.tabActiveColor : '#FFF'
            }
          />
        </div>
        {tab.label}
      </button>
    </div>
  )
}

RiddlePollSectionTab.propTypes = {
  tab: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

const RiddlePollingSection = () => {
  const { authorizationId } = useAppContext()
  const [activeTab, setActiveTab] = useState('riddles')
  const { t } = useTranslation('common')
  const location = useLocation()
  const sectionParam = useMemo(
    () => new URLSearchParams(location.search).get('section'),
    [location.search]
  )

  const tabIds = [
    { id: 'riddles', label: t('riddlePolls.riddle') },
    { id: 'poll', label: t('riddlePolls.poll') }
  ]

  const activeTabToggler = (activeTabId) => {
    if (activeTabId !== activeTab) {
      const properties = {
        external_id: authorizationId,
        tab_name: activeTabId,
        app_name: 'riddles_app'
      }
      trackEvent(`riddle_app_tab_click`, properties)
      setActiveTab(activeTabId)
    }
  }

  useEffect(() => {
    if (sectionParam) {
      setActiveTab(sectionParam)
    }
  }, [sectionParam])

  return (
    <div
      className='ai-store-riddle-poll-wrapper'
      style={{
        backgroundColor: tabIds?.find((tab) => tab.id === activeTab)
          ? RIDDLE_POLL_LAYOUT[activeTab]?.primaryColor
          : '#FFF'
      }}
    >
      <div
        className='ai-store-poll-home-header ai-store-riddle-poll-offset'
        style={{
          color: `${
            activeTab === 'riddles'
              ? riddleLayout?.tabActiveColor
              : pollLayout?.tabActiveColor
          }`
        }}
      >
        <BackButton
          color={
            activeTab === 'riddles'
              ? riddleLayout?.textColor
              : pollLayout?.textColor
          }
          textVisible={false}
          isTriviaBackBtn={true}
        />
        {activeTab === 'riddles' ? (
          <p style={{ color: riddleLayout?.secondaryColor }}>
            {t('riddlePolls.riddleMeThis')}
          </p>
        ) : (
          <p style={{ color: pollLayout?.secondaryColor }}>
            {t('riddlePolls.poll')}
          </p>
        )}
        <div className='ai-store-poll-home-back-button-wrapper'></div>
      </div>
      <div className='ai-store-riddle-poll-tab-content'>
        {activeTab === 'riddles' ? (
          <RiddleMeSection externalId={authorizationId} />
        ) : (
          <PollingGameSection externalId={authorizationId} tenant={tenantId} />
        )}
      </div>
      <div className='ai-store-riddle-poll-tab-position'>
        <div className='ai-store-riddle-poll-tab-container'>
          {tabIds?.map((tab) => (
            <RiddlePollSectionTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTab}
              onClick={activeTabToggler}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RiddlePollingSection
