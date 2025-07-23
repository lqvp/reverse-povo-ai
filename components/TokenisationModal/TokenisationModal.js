import React from 'react'
import './tokenisationModal.css'
import { TOKENISATION_USE_CASE_TYPE } from '../../helpers/constant'
import { useTokenisationContext } from '../../context/TokenisationContext'
import CategoryMastery from './CategoryMastery'
import AppExploration from './AppExploration'
import PremiumContent from './PremiumContent'
import DeeperEngagement from './DeeperEngagement'
import { Modal } from '@mui/material'
import NewAppEarnModal from './NewAppEarnModal'
import LowBalanceModal from './LowBalanceModal'

const getUseCaseModalContent = (useCase) => {
  switch (useCase) {
    case TOKENISATION_USE_CASE_TYPE.categoryMastery:
      return <CategoryMastery />
    case TOKENISATION_USE_CASE_TYPE.appExploration:
      return <AppExploration />
    case TOKENISATION_USE_CASE_TYPE.premiumContent:
      return <PremiumContent />
    case TOKENISATION_USE_CASE_TYPE.deeperEngagement:
      return <DeeperEngagement />
    case TOKENISATION_USE_CASE_TYPE.newEarnModal:
      return <NewAppEarnModal />
    case TOKENISATION_USE_CASE_TYPE.lowBalance:
      return <LowBalanceModal />
    default:
      return null
  }
}

const TokenisationModal = () => {
  const { isTokenisationModelOpen, tokenisationUseCaseType } =
    useTokenisationContext()

  return (
    <Modal
      open={isTokenisationModelOpen}
      aria-labelledby='tokenisation-modal-title'
      aria-describedby='tokenisation-modal-description'
      className={`tokenisation-modal ${tokenisationUseCaseType === TOKENISATION_USE_CASE_TYPE.newEarnModal ? 'new' : ''}`}
    >
      <div
        className={`tokenisation-modal-container ${tokenisationUseCaseType === TOKENISATION_USE_CASE_TYPE.newEarnModal ? 'new' : ''}`}
      >
        {getUseCaseModalContent(tokenisationUseCaseType)}
      </div>
    </Modal>
  )
}

export default TokenisationModal
