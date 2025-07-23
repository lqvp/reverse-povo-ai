import React from 'react'
import PropTypes from 'prop-types'
import {
  LUCKY_COLOR,
  LUCKY_NUMBER
} from '../../../../static/HoroscopeConstants'
import LuckyCharmColorIcon from '../../../../static/LuckyCharmColorIcon'
import { numberToWords } from '../../../../helpers/helperFunctions'
import { useTranslation } from 'react-i18next'
import { getTenantName } from '../../../../helpers/tenantHelper'
import { useTenantConfig } from '../../../../useTenantConfig'

const getFirstNumberFromText = (text) => {
  if (!text) return null
  // Split the string on the comma
  const parts = text.split(':')[1].split(',')
  if (parts.length > 0) {
    const firstNumber = parts[0].trim()
    return firstNumber
  }
  return null
}

const splitByColon = (input) => {
  return input.split(':').map((part) => part.trim())[1] || null
}

const tenant = getTenantName()

const LuckyCharmResult = ({ luck, special }) => {
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  return (
    <div className={`hp-dp-lucky-charm-card-container ${tenant}`}>
      {tenantLayout?.horoscope?.showBgImageOnLuckyCharm && (
        <img
          className='hp-dp-lucky-charm-card-image'
          src='images/horoscope/luck-charm-card.png'
          alt='Lucky Charm Card'
        />
      )}
      <div className={`hp-dp-lucky-charm-card-text ${tenant}`}>
        <div className={`hp-dp-lucky-charm-card-text-color ${tenant}`}>
          <div className='hp-dp-lucky-charm-card-text-color-wrapper'>
            {special[0] && (
              <div
                style={{ width: tenantLayout?.horoscope?.colorWidth }}
                className='hp-dp-lucky-charm-card-text-color-wrapper-colour-1'
              >
                {special ? <LuckyCharmColorIcon color={special[0]} /> : ''}
              </div>
            )}
            {special[1] && (
              <div
                style={{}}
                className='hp-dp-lucky-charm-card-text-color-wrapper-colour-2'
              >
                {special ? <LuckyCharmColorIcon color={special[1]} /> : ''}
              </div>
            )}
          </div>
          <p>{t(LUCKY_COLOR)}</p>
          <h3>{luck ? splitByColon(luck[0]) : ''}</h3>
        </div>
        <div className={`hp-dp-lucky-charm-card-text-number ${tenant}`}>
          <div className='hp-dp-lucky-charm-card-text-number-wrapper'>
            <div
              className='hp-dp-lucky-charm-card-text-number-inner'
              style={{
                background: tenantLayout?.horoscope?.ctaBgColor
              }}
            >
              {luck ? getFirstNumberFromText(luck[1]) : ''}
            </div>
          </div>
          <p>{t(LUCKY_NUMBER)}</p>
          <h3>
            {luck
              ? numberToWords(getFirstNumberFromText(luck[1]), t('appLanguage'))
              : ''}
          </h3>
        </div>
      </div>
    </div>
  )
}

LuckyCharmResult.propTypes = {
  luck: PropTypes.array,
  special: PropTypes.array
}

export default LuckyCharmResult
