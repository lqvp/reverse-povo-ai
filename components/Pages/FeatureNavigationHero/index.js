import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './index.css'
import HeaderSection from './HeaderSection'
import PlayPage from './PlayPage/PlayPage'
import FunPage from './FunPage/FunPage'
import AIAssistant from './AIAssistant/AIAssistant'
import Loader from '../../Loader/Loader'

const sectionLayout = {
  play: {
    pageId: 'play',
    iconSrc: '/images/featuredNavHero/playIcon.png',
    iconSrcHeader: '/images/featuredNavHero/playIconHeader.png',
    title: 'Play',
    description: 'Create engaging pages for your business',
    bgBackgroundImage: true,
    bgBackgroundImageSrc: '/images/featuredNavHero/commonBackground.png',
    primaryFontColor: '#FFF',
    component: PlayPage
  },
  fun: {
    pageId: 'fun',
    iconSrc: '/images/featuredNavHero/funIcon.png',
    iconSrcHeader: '/images/featuredNavHero/funIconHeader.png',
    title: 'Fun',
    description: 'Create interactive and engaging content for your business',
    bgBackgroundImage: true,
    bgBackgroundImageSrc: '/images/featuredNavHero/commonBackground.png',
    primaryFontColor: '#FFF',
    component: FunPage
  },
  aiAssistant: {
    pageId: 'ai-assistant',
    iconSrc: '/images/featuredNavHero/aiAssistantIcon.png',
    iconSrcHeader: '/images/featuredNavHero/aiAssistantIconHeader.png',
    title: 'AI Assistant',
    description: 'Unlock AI capabilities for your business',
    bgBackgroundImage: true,
    bgBackgroundImageSrc: '/images/featuredNavHero/commonBackground.png',
    primaryFontColor: '#FFF',
    component: AIAssistant
  }
}

const FeatureNavigationHero = () => {
  const [selectedSection, setSelectedSection] = useState(null)
  const [redirectLoading, setRedirectLoading] = useState(true)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const sectionParam = searchParams.get('section')
    const initialSection =
      sectionParam && Object.keys(sectionLayout).includes(sectionParam)
        ? sectionParam
        : 'play'
    setRedirectLoading(true)
    const timer = setTimeout(() => {
      setSelectedSection(initialSection)
      setRedirectLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchParams])

  const handleSectionSelect = (section) => {
    setRedirectLoading(true)
    setTimeout(() => {
      setSelectedSection(section)
      setRedirectLoading(false)
    }, 300)
  }

  const SelectedComponent = sectionLayout[selectedSection]?.component

  return redirectLoading || !SelectedComponent ? (
    <Loader />
  ) : (
    <div className='aistore-navigation-feature-container'>
      <div
        className='aistore-image-bg-tile-wrapper'
        style={{
          backgroundImage: sectionLayout[selectedSection]?.bgBackgroundImage
            ? `url(${sectionLayout[selectedSection]?.bgBackgroundImageSrc})`
            : 'none',
          minHeight: '100%'
        }}
      >
        <div className='aistore-navigation-feature-header'>
          <div className='aistore-navigation-feature-header-title'>
            <div className='aistore-navigation-feature-header-title-text'>
              <HeaderSection
                handleSectionSelect={handleSectionSelect}
                selectedSection={selectedSection}
                sectionLayout={sectionLayout}
              />
            </div>
          </div>
        </div>
        <div className='aistore-navigation-feature-content-page'>
          <SelectedComponent
            setRedirectLoading={setRedirectLoading}
            isSublayout={true}
          />
        </div>
      </div>
    </div>
  )
}

export default FeatureNavigationHero
