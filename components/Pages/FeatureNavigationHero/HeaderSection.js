import { SwipeableDrawer } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AIStylistIcon from '../../../static/AIStylistIcon'
import AIChatboxIcon from '../../../static/AIChatboxIcon'
import { useNavigate } from 'react-router-dom'
import './index.css'
import { getTenantName } from '../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../useTenantConfig'
import { useTranslation } from 'react-i18next'
import BackButton from '../../../static/BackButton'

const { tenant } = getTenantName()

const HeaderSectionDrawer = ({
  open,
  handleClose,
  handleSectionSelect,
  selectedSection,
  sectionLayout
}) => {
  const tenantLayout = useTenantConfig(tenant)
  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={handleClose}
      className='byu-section-toggle-swipeable-drawer-wrapper'
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          height: '32vh',
          width: '100%',
          overflowX: 'hidden',
          fontFamily: tenantLayout?.fonts?.primary
        }
      }}
    >
      <div className='aistore-navigation-feature-menu-wrapper'>
        <div className='aistore-navigation-feature-app-title'>uTainment</div>
        <div
          className='widget-navigation-drawer-close'
          onClick={() => handleClose()}
        >
          <AIStylistIcon
            kind='close-byu-icon'
            width={24}
            height={24}
            color='#1F2D3D'
          />
        </div>
      </div>
      {Object.keys(sectionLayout).map((section) => (
        <div
          key={section}
          className={`byu-section-toggle-button ${selectedSection === section ? 'selected' : ''}`}
          onClick={() => {
            handleSectionSelect(section)
            handleClose()
          }}
        >
          <div className='byu-section-toggle-menu-wrapper'>
            <div className='byu-section-toggle-icon'>
              <img
                src={sectionLayout[section]?.iconSrc}
                alt={sectionLayout[section].title}
                width={24}
                height={24}
              />
            </div>
            <div className='byu-section-toggle-text'>
              {sectionLayout[section]?.title}
            </div>
          </div>
          <div className='byu-section-toggle-indicator'>
            {selectedSection === section && (
              <div className='byu-section-toggle-indicator-icon-wrapper'>
                <AIStylistIcon
                  kind='selected-menu'
                  width={24}
                  height={24}
                  color='#1F2D3D'
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </SwipeableDrawer>
  )
}

HeaderSectionDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSectionSelect: PropTypes.func.isRequired,
  selectedSection: PropTypes.string.isRequired,
  sectionLayout: PropTypes.objectOf(
    PropTypes.shape({
      iconSrc: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired
}

const InfoDrawer = ({ open, handleClose }) => {
  const { tenant } = getTenantName()
  const tenantLayout = useTenantConfig(tenant)
  const { t } = useTranslation('common')

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onClose={handleClose}
      className='byu-section-toggle-swipeable-drawer-wrapper'
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          height: '26vh',
          width: '100%',
          overflowX: 'hidden',
          fontFamily: tenantLayout?.fonts?.primary
        }
      }}
    >
      <div className='aistore-navigation-feature-info-menu-wrapper'>
        <div className='aistore-navigation-feature-info-app-title'>
          {t('byu.featureProduct.modalCTAText')}
        </div>
        <div
          className='widget-navigation-drawer-close'
          onClick={() => handleClose()}
        >
          <AIStylistIcon
            kind='close-byu-icon'
            width={24}
            height={24}
            color='#1F2D3D'
          />
        </div>
      </div>
      <div className='byu-info-drawer-content'>
        <p>{t('byu.widget.infoModal.descriptionParaOne')}</p>
        <br />
        <p>{t('byu.widget.infoModal.descriptionParaTwo')}</p>
        <ul>
          <li>{t('byu.widget.infoModal.descriptionList')}</li>
        </ul>
      </div>
    </SwipeableDrawer>
  )
}

InfoDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

const HeaderSection = ({
  handleSectionSelect,
  selectedSection,
  sectionLayout
}) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev)
  }

  return (
    <div className='aistore-navigation-feature-app-header'>
      <div
        className='aistore-navigation-feature-app-back-icon'
        onClick={() => navigate(-1)}
      >
        <BackButton color='#FFF' textVisible={false} spacing='0' />
      </div>
      <div
        className='aistore-navigation-feature-app-title-deco'
        onClick={toggleDrawer}
        style={{ cursor: 'pointer' }}
      >
        <div className='aistore-navigation-feature-app-title-icon'>
          <img
            src={sectionLayout[selectedSection]?.iconSrcHeader}
            alt='chat-header-icon'
            width={24}
            height={24}
          />
        </div>
        <div
          className='aistore-navigation-feature-app-name'
          style={{
            color: sectionLayout[selectedSection]?.primaryFontColor
          }}
        >
          {sectionLayout[selectedSection]?.title || 'Select Section'}
        </div>
        <div className='chatbot-app-title-more-feature'>
          <AIChatboxIcon
            kind='byu-back-button'
            width={25}
            height={24}
            color={sectionLayout[selectedSection]?.primaryFontColor}
          />
        </div>
      </div>
      <div
        className='aistore-navigation-feature-app-info-modal'
        onClick={() => setOpenInfoDrawer(true)}
      >
        {t('byu.featureProduct.modalCTAText')}
      </div>
      <HeaderSectionDrawer
        open={openDrawer}
        handleClose={() => setOpenDrawer(false)}
        handleSectionSelect={handleSectionSelect}
        selectedSection={selectedSection}
        sectionLayout={sectionLayout}
      />
      <InfoDrawer
        open={openInfoDrawer}
        handleClose={() => setOpenInfoDrawer(false)}
      />
    </div>
  )
}

HeaderSection.propTypes = {
  handleSectionSelect: PropTypes.func.isRequired,
  selectedSection: PropTypes.string.isRequired,
  sectionLayout: PropTypes.objectOf(
    PropTypes.shape({
      iconSrc: PropTypes.string,
      iconSrcHeader: PropTypes.string,
      title: PropTypes.string,
      primaryFontColor: PropTypes.string
    })
  ).isRequired
}

export default HeaderSection
