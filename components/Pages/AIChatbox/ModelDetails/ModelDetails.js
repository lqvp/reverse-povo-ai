import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  DialogActions,
  Chip
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PropTypes from 'prop-types'
import './ModelDetails.css'
import { getConfigForHostname } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'
import * as StyledComponents from 'styled-components'
import { useAppContext } from '../../../../context/AppContext'
import { trackEvent } from '../../../../helpers/analyticsHelper'

const AIChatbotCSBannerDrawer = StyledComponents.styled(Dialog)`
  font-family: ${(props) => props.fontFamily || 'Inter, sans-serif'} !important;
`
const comingSoonModels = []

const ModelDetails = ({
  isDrawerOpen,
  handleBackClick,
  userResponse,
  setUserResponse
}) => {
  const models = userResponse.supported_ai_models
  const [selectedModel, setSelectedModel] = useState()
  const { authorizationId } = useAppContext()
  const { t } = useTranslation('common')
  const { tenant } = getConfigForHostname()
  const tenantLayout = useTenantConfig(tenant)
  const updateAIModel = (name) => {
    if (authorizationId) {
      const properties = {
        external_id: authorizationId,
        option_name: name,
        app_name: 'ai_app_new',
        tenant: tenant
      }
      trackEvent('ai_models_select_click', properties)
    }
    setUserResponse((prevResponse) => ({
      ...prevResponse,
      supported_ai_models: prevResponse.supported_ai_models.map((model) => ({
        ...model,
        is_default: model.name === name
      }))
    }))
    sessionStorage.setItem('selected_ai_model', name)
    handleBackClick()
    setSelectedModel()
  }

  const dialogCloseHandler = () => {
    handleBackClick()
    setSelectedModel()
  }

  return (
    <AIChatbotCSBannerDrawer
      className='ai-chatbox-cs-banner-drawer'
      open={isDrawerOpen}
      onClose={dialogCloseHandler}
      fullWidth
      maxWidth='xl'
      fontFamily={tenantLayout?.aiChatBox?.fontFamily}
    >
      <DialogTitle className='chatbox-modal-header'>
        {t('aiChatbox.chooseModelTitle')}
      </DialogTitle>

      <DialogContent className='ai-chatbox-cs-container'>
        <List>
          {comingSoonModels.map((model) => {
            return (
              <ListItem key={model.name} className='list-item'>
                <img src={model.icon_url} alt='model_icon' />
                <ListItemText primary={model.label} />

                <Chip
                  label={t('aiChatbox.comingSoonLabel')}
                  color='success'
                  className='model-coming-soon-label'
                />
              </ListItem>
            )
          })}

          {models.map((model) => {
            // Move variable definitions outside JSX
            const activeModel =
              selectedModel || models.find((m) => m.is_default)?.name
            const isActive = model.name === activeModel

            return (
              <ListItem
                key={model.name}
                className={`list-item ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedModel(model.name)}
              >
                <img src={model.icon_url} alt='model_icon' />

                <ListItemText primary={model.label} />

                {isActive && (
                  <IconButton disabled>
                    <CheckCircleIcon className='check-icon' />
                  </IconButton>
                )}
              </ListItem>
            )
          })}
        </List>
      </DialogContent>

      <DialogActions className='dialog-actions'>
        <Button
          onClick={dialogCloseHandler}
          variant='outlined'
          className='cancel-btn'
        >
          {t('aiChatbox.chooseModelCancelBtn')}
        </Button>
        <Button
          onClick={() => updateAIModel(selectedModel)}
          variant='contained'
          className='done-btn'
        >
          {t('aiChatbox.chooseModelDoneBtn')}
        </Button>
      </DialogActions>
    </AIChatbotCSBannerDrawer>
  )
}

ModelDetails.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  handleBackClick: PropTypes.func.isRequired,
  userResponse: PropTypes.object.isRequired,
  setUserResponse: PropTypes.func.isRequired
}

export default ModelDetails
