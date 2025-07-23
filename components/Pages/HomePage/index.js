import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import common from '@kelchy/common'
import Button from '@mui/material/Button'
import './index.css'
import productsData from '../../../static/productsData'
import ImageGallery from '../../ImageGallery/ImageGallery'
import { axiosGet } from '../../../utils/axios'
import Loader from '../../Loader/Loader'
import Discover from './Discover/Discover'
import BackButton from '../../../static/BackButton'
import { useAppContext } from '../../../context/AppContext'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { trackEvent } from '../../../helpers/analyticsHelper'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../../useTenantConfig'
import { getConfigForHostname } from '../../../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const HomePage = () => {
  const { authorizationId } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const aiTabEnabled = tenantLayout?.funWithSelfies?.showAllAppsAIStoreTab
  const selectedTab = aiTabEnabled
    ? params.get('aistore_tab') || 'ai_apps'
    : 'discover'

  const [isLoading, setIsLoading] = useState(false)
  const [publicPosts, setPublicPosts] = useState([])
  const [errorModalData, setErrorModalData] = useState({ openModal: false })

  useEffect(() => {
    const eventName =
      selectedTab === 'discover' ? 'discover_visit' : 'ai_landing_visit'
    const properties = { external_id: authorizationId }
    trackEvent(eventName, properties)
  }, [authorizationId, selectedTab])

  const getPublicPost = useCallback(async () => {
    setIsLoading(true)
    const headers = {
      Authorization: authorizationId
    }
    const { data: apiResponse, error: apiError } = await common.awaitWrap(
      axiosGet('/media/ugc_list', { headers })
    )
    if (apiError) {
      setErrorModalData({ openModal: true })
    } else if (apiResponse) {
      setPublicPosts(apiResponse?.data)
    }
    setIsLoading(false)
  }, [authorizationId])

  useEffect(() => {
    if (selectedTab === 'discover') {
      getPublicPost()
    }
  }, [selectedTab, getPublicPost])

  const handleButtonClick = (buttonIndex) => {
    if (buttonIndex === 1) {
      navigate('/?aistore_tab=ai_apps')
    } else {
      navigate('/?aistore_tab=discover')
    }
  }

  const handleProductSelect = (productIndex) => {
    const routeToNavigate = productsData?.find((p) => p.id === productIndex)
    if (routeToNavigate?.route) {
      navigate(routeToNavigate.route)
    }
  }

  const onAppSelect = (app) => {
    switch (app) {
      case 'avatar':
        navigate('/photo-avatar')
        break
      case 'animate':
        navigate('/photo-animator')
        break
      case 'meme':
        navigate('/meme-generator')
        break
      case 'sticker_picker':
        navigate('/sticker-picker')
        break
      case 'glow_me_up':
        navigate('/glow-me-up')
        break
      case 'face_merge':
        navigate('/face-merge')
        break
      default:
        return ''
    }
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  const firstProduct = productsData[1]

  return (
    <>
      {isLoading && <Loader />}
      <BackButton />
      <div className='home-page-container'>
        <div className='title-container'>{t('homePage.aiStore')}</div>
        <div className='main-wrapper'>
          <div className='button-wrapper'>
            {aiTabEnabled && (
              <Button
                className={`custom-button ${
                  selectedTab !== 'discover' ? 'selected' : 'not-selected'
                }`}
                onClick={() => handleButtonClick(1)}
              >
                {t('homePage.aiApps')}
              </Button>
            )}
            <Button
              className={`custom-button ${
                selectedTab === 'discover' ? 'selected' : 'not-selected'
              }`}
              onClick={() => handleButtonClick(2)}
            >
              {t('homePage.discover')}
            </Button>
          </div>
        </div>
      </div>

      {selectedTab === 'discover' ? (
        <div style={{ padding: '0.5rem' }}>
          <Discover data={publicPosts} onImageSelect={onAppSelect} />
        </div>
      ) : (
        <div className='product-feedback-container'>
          <div>
            <div className='static-first-product'>
              <img
                src={firstProduct.hero_url}
                alt={firstProduct.name}
                onClick={() => handleProductSelect(firstProduct.id)}
              />
              <div style={{ fontWeight: '700', marginTop: '0.3rem' }}>
                {firstProduct.name}
              </div>
            </div>
            <div className='products-title'>{t('homePage.allProducts')}</div>
            <ImageGallery
              data={productsData}
              onImageSelect={handleProductSelect}
            />
          </div>
          <div className='feedback-text-wrapper'>
            {t('homePage.aiStoreShareFeedback')}{' '}
            <a
              href='https://www.surveymonkey.com/r/TW9XX7M'
              target='_blank'
              rel='noopener noreferrer'
            >
              {t('homePage.here')}
            </a>
            .
          </div>
        </div>
      )}

      {errorModalData.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}

export default HomePage
