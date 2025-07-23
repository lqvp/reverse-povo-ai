import React from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import TriviaBackIcon from '../static/TriviaBackIcon'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import AIChatboxIcon from './AIChatboxIcon'
import { useTenantConfig } from '../useTenantConfig'
import { getConfigForHostname } from '../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const getBackIcon = (key, color = '#000', fontSize) => {
  switch (key) {
    case 'trivia':
      return <TriviaBackIcon color={color} />
    case 'byu-back':
      return (
        <div className='chatbot-app-title-more-feature'>
          <AIChatboxIcon
            kind='byu-fws-back-button'
            width={24}
            height={24}
            color={color}
          />
        </div>
      )
    default:
      return <ArrowBackIosNewOutlinedIcon style={{ fontSize: fontSize }} />
  }
}

const BackButton = ({
  color,
  textVisible = true,
  isTriviaBackBtn = false,
  fontSize = '20px',
  spacing = '1.3rem 0 0'
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  const backBtnKey = tenantLayout?.funWithSelfies?.backBtnConfig
    ?.showTenantWiseBackBtn
    ? `${tenant}-back`
    : isTriviaBackBtn
      ? 'trivia'
      : 'default'

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <>
      <div className='back-button-wrapper' style={{ margin: spacing }}>
        <IconButton
          onClick={handleBack}
          aria-label='back'
          style={{ padding: 0, color: color || '#000000', fontSize: fontSize }}
        >
          {getBackIcon(backBtnKey, color, fontSize)}
          {textVisible ? <div color={color || '#000000'}>{t('back')}</div> : ''}
        </IconButton>
      </div>
    </>
  )
}

BackButton.propTypes = {
  color: PropTypes.string,
  textVisible: PropTypes.bool,
  isTriviaBackBtn: PropTypes.bool,
  fontSize: PropTypes.string,
  spacing: PropTypes.string
}

export default BackButton
