import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTokenisationContext } from '../../context/TokenisationContext'
import Button from './Button'
import { getWidgetBaseUrl } from '../../helpers/helperFunctions'
import RewardCoinBg from './RewardCoinBg'
import CrownIcon from '../../static/CrownIcon'
import PropTypes from 'prop-types'

const CategoryMastery = ({ environment }) => {
  const { tokenisationUseCaseData, mvpTokenAmount } = useTokenisationContext()
  const { t } = useTranslation('common')

  return (
    <div className='category-mastery token-use-case-container'>
      <div className='app-exploration-bg'>
        <img
          src={`${getWidgetBaseUrl(environment)}/images/tokenisation/sparkle.png`}
          alt='app-exploration-sparkle'
        />
      </div>
      <div className='app-exploration-title'>
        {t('tokenization.congratulations')}
      </div>
      <div className='app-exploration-description'>
        <div>{t('tokenization.masteryUnlocked')}</div>
        <div>
          {t('tokenization.scored')} {tokenisationUseCaseData?.masteryScore}
        </div>
      </div>
      <div className='app-exploration-icon'>
        <RewardCoinBg containerSize={100} />
        <CrownIcon />
      </div>
      <div className='app-exploration-token-reward'>
        +{mvpTokenAmount} {t('tokenization.tokens')}
      </div>
      <Button onClick={() => {}}>{t('tokenization.collectReward')}</Button>
    </div>
  )
}

CategoryMastery.propTypes = {
  environment: PropTypes.string.isRequired
}

export default CategoryMastery
