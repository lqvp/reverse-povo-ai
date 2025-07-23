import React from 'react'
import PropTypes from 'prop-types'

const RewardCoinBg = ({
  containerSize,
  innerContainerSize,
  isShadowEnabled
}) => {
  return (
    <div
      style={{
        width: `${containerSize / 16 || 2.875}rem`,
        height: `${containerSize / 16 || 2.875}rem`
      }}
      className={`reward-coin-bg-container ${isShadowEnabled ? 'box-shadow' : ''}`}
    >
      <div
        className='reward-coin-bg'
        style={{
          height: `calc(100% - ${innerContainerSize || 7.32}px)`,
          width: `calc(100% - ${innerContainerSize || 7.32}px)`
        }}
      ></div>
    </div>
  )
}

RewardCoinBg.propTypes = {
  containerSize: PropTypes.number,
  innerContainerSize: PropTypes.number,
  isShadowEnabled: PropTypes.bool
}

RewardCoinBg.displayName = 'RewardCoinBg'

export default RewardCoinBg
