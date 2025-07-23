import React from 'react'
import PropTypes from 'prop-types'

const PlanCard = ({ planInfo }) => {
  return (
    <div className='plan-card'>
      <div className='normal'>{planInfo?.internet} GB</div>
      <div>{planInfo?.voice} mins</div>
      <div>{planInfo?.sms} sms</div>
    </div>
  )
}

PlanCard.propTypes = {
  planInfo: PropTypes.shape({
    internet: PropTypes.number.isRequired,
    voice: PropTypes.number.isRequired,
    sms: PropTypes.number.isRequired
  }).isRequired
}

PlanCard.displayName = 'PlanCard'

export default PlanCard
