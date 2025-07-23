import React, { useEffect, useState } from 'react'
import TriviaBackIcon from '../../static/TriviaBackIcon'
import CoinIcon from '../../static/CoinIcon'
import DownArrowIcon from '../../static/DownArrowIcon'
import './tokenHistory.css'
import { CircularProgress, SwipeableDrawer } from '@mui/material'
import PropsType from 'prop-types'
import { useTranslation } from 'react-i18next'
import common from '@kelchy/common'
import { FEATURE_NAME_MAPPER } from '../../helpers/constant'
import { formatDateToDDMMMYYYY } from '../../helpers/helperFunctions'
import { axiosGet } from '../../utils/axios'

const TokenHistory = ({
  isDrawerOpen,
  setIsDrawerOpen,
  userTokenCount = 0
}) => {
  const [userTokenHistory, setUserTokenHistory] = useState(null)
  const [isHistoryFetching, setIsHistoryFetching] = useState(true)
  const { t } = useTranslation('common')

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

  // retrieve user streak data
  const getUserTokenHistory = async () => {
    const { data: userTokenHistory, error: userTokenHistoryErr } =
      await common.awaitWrap(
        axiosGet(`/user/token-transaction/success?page=1&limit=30`, {})
      )

    if (!userTokenHistoryErr && userTokenHistory?.data) {
      setUserTokenHistory(userTokenHistory?.data)
    }
    setIsHistoryFetching(false)
  }

  useEffect(() => {
    getUserTokenHistory()
  }, [])

  return (
    <SwipeableDrawer
      anchor='right'
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      className='token-history-drawer'
      style={{ borderRadius: '0', zIndex: 10000 }}
    >
      <div className='token-history-container'>
        <div className='token-history-header'>
          <div onClick={() => setIsDrawerOpen(false)}>
            <TriviaBackIcon color='#111111' />
          </div>
        </div>
        <div className='token-meta-data'>
          <CoinIcon width={60} height={60} />
          <div className='user-token-count'>{userTokenCount}</div>
          <div className='token-description'>
            {t('tokenization.tokenBalance')}
          </div>
        </div>
        {isHistoryFetching ? (
          <div className='token-history-loader'>
            <CircularProgress size={40} color='inherit' />
          </div>
        ) : (
          <>
            <div className='token-history-details'>
              <div className='token-history-title'>
                {t('tokenization.tokenLedger')}
              </div>
              {userTokenHistory?.map((item) => (
                <div className='token-data' key={item?.transaction_id}>
                  <div
                    className={`token-graph ${item?.token_config?.token_action === 'earn' || item?.amount > 0 ? 'success' : 'danger'}`}
                  >
                    <DownArrowIcon
                      fill={
                        item?.token_config?.token_action === 'earn' ||
                        item?.amount > 0
                          ? '#53BC51'
                          : '#FF4040'
                      }
                    />
                  </div>
                  <div className='token-stats'>
                    <div className='token-stats-count'>
                      {Math.abs(
                        item?.amount || item?.token_config?.token_amount
                      )}
                    </div>
                    <div className='token-stats-details'>
                      {FEATURE_NAME_MAPPER[item?.service_id]}
                    </div>
                  </div>
                  <div className='token-date-details'>
                    <div className='token-date'>
                      {formatDateToDDMMMYYYY(item?.updated_at, true)}
                    </div>
                    {item?.token_config?.token_action === 'earn' && (
                      <div className='token-validity'>
                        Expiry: {formatDateToDDMMMYYYY(item?.expireAt, true)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SwipeableDrawer>
  )
}

TokenHistory.propTypes = {
  isDrawerOpen: PropsType.bool.isRequired,
  setIsDrawerOpen: PropsType.func.isRequired,
  userTokenCount: PropsType.number.isRequired
}

TokenHistory.displayName = 'TokenHistory'

export default TokenHistory
