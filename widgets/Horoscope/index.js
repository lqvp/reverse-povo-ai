import React, { useEffect, useState } from 'react'
import './index.css'
import { CircularProgress } from '@mui/material'
import {
  formatDateToDDMMYYYY,
  getWidgetBaseUrl,
  transformTitleCase
} from '../../helpers/helperFunctions'
import { horoscopeImagePicker } from '../../helpers/horoscopeLayout'
import common from '@kelchy/common'
import { axiosPost } from '../../utils/axios'
import RightArrowSmall from '../../static/RightArrowSmall'
import {
  getLockedComponent,
  getWidgetComponentsLockedStatus
} from '../../helpers/getWidgetComponentsLockedStatus'
import { useMemo } from 'react'
import { filterByDeviceCompatibility } from '../../utils/converter'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useTenantConfig } from '../../useTenantConfig'
import { tenantType } from '../../common/constants'

// widget component list
const horoscopeComponents = [
  {
    widgetComponentId: 'horoscope'
  }
]

const TypographyText = {
  mobicom:
    'Өнөөдөр гариг эрхэс таныг ивээж, баярт үйл явдал, амжилтаар мялаах болно. Танаас цацрах эерэг энерги шинэ зүйлсийг татна.',
  defaultDescription:
    'Today, the stars align in your favor, bringing you unexpected joy and success. Your positive energy will attract new...'
}

const tenantDefaultDescription = (tenant) => {
  if (tenant === tenantType.mobicom) return TypographyText.mobicom
  else return TypographyText.defaultDescription
}

const Horoscope = ({
  externalId,
  tenant,
  environment,
  setRedirectLoading,
  widgetComponents,
  userUnlockedComponents,
  isUnlockedComponentsLoading,
  isExploreSublayout
}) => {
  const [dailyHoroscopeData, setDailyHoroscopeData] = useState(null)
  const [isFetchingLayout, setFetchingLayout] = useState(true)
  const [imageLayoutDetail, setImageLayoutDetail] = useState(
    horoscopeImagePicker('default')
  )
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  // Get daily horoscope response
  const getDailyHoroscopeData = async () => {
    const { data: dailyHoroscope, error: dailyHoroscopeError } =
      await common.awaitWrap(axiosPost(`/horoscope/daily_horoscope`))
    if (!dailyHoroscopeError && dailyHoroscope?.data?.data) {
      setDailyHoroscopeData(dailyHoroscope?.data?.data)
    }
    setTimeout(() => {
      setFetchingLayout(false)
    }, 100)
  }

  useEffect(() => {
    getDailyHoroscopeData()
  }, [])

  useEffect(() => {
    if (dailyHoroscopeData?.sign) {
      const sign = tenantLayout?.horoscope?.allowLowerCaseConversion
        ? dailyHoroscopeData?.sign?.toLowerCase()
        : transformTitleCase(dailyHoroscopeData?.sign)
      const imageLayoutDetails = horoscopeImagePicker(sign, tenant)
      setImageLayoutDetail(imageLayoutDetails)
      setFetchingLayout(false)
    } else {
      setFetchingLayout(false)
    }
  }, [
    dailyHoroscopeData?.sign,
    tenant,
    tenantLayout?.horoscope?.allowLowerCaseConversion
  ])

  // Read more click handler
  const readMoreHandler = () => {
    if (!isFetchingLayout) {
      // GTM Event
      window.dataLayer.push({
        event: 'gtm.click',
        'gtm.elementId': 'horoscope',
        external_id: externalId ?? 'NA',
        explore_version: 'V4'
      })
      setRedirectLoading(true)
      const url = getWidgetBaseUrl(environment)
      window.location.assign(`${url}/horoscope?tenant=${tenant}`)
    }
  }

  // Filter components based on device compatibility and locked status
  const allowedComponents = useMemo(() => {
    if (!horoscopeComponents?.length) {
      return []
    }
    const filteredHoroscope = getWidgetComponentsLockedStatus(
      horoscopeComponents,
      widgetComponents
    )
    return filterByDeviceCompatibility(filteredHoroscope)
  }, [widgetComponents])

  return (
    <div
      className='widget-horoscope-wrapper'
      style={{
        paddingTop: isExploreSublayout && '0'
      }}
    >
      {allowedComponents?.map((item) => {
        const isLocked =
          item?.lockedStatus &&
          !userUnlockedComponents?.includes(item?.widgetComponentId)
        return (
          <div
            className='widget-horoscope-container'
            onClick={
              isUnlockedComponentsLoading || isLocked
                ? () => {}
                : readMoreHandler
            }
            style={{
              backgroundImage: isExploreSublayout ? 'none' : '',
              background: isExploreSublayout
                ? tenantLayout?.horoscope?.exploreSublayout?.background
                : '',
              borderRadius: isExploreSublayout
                ? tenantLayout?.horoscope?.exploreSublayout?.borderRadius
                : '',
              boxShadow: isExploreSublayout
                ? tenantLayout?.horoscope?.exploreSublayout?.boxShadow
                : ''
            }}
            data-cx={`explore-section-horoscope`}
            data-cy={`explore-tile-horoscope`}
            key={`horoscope-section-${item?.widgetComponentId}`}
          >
            {getLockedComponent(isUnlockedComponentsLoading, isLocked)}
            <div
              className={`widget-horoscope-blur-wrapper ${
                isFetchingLayout ? 'blur' : ''
              }`}
            >
              <div
                className='widget-horoscope-content'
                style={{
                  padding: isExploreSublayout
                    ? '1.25rem 7.5rem 1.25rem 1.5rem'
                    : ''
                }}
              >
                <p
                  className={`widget-horoscope-title ${isExploreSublayout ? 'sublayout' : ''}`}
                  style={{
                    fontFamily: tenantLayout?.fonts?.widgetTitle,
                    fontWeight: tenantLayout?.horoscope?.titleFontWeight
                  }}
                >
                  {t('horoscope.widget.todayHoroscope')}
                </p>
                <div
                  className='widget-horoscope-description'
                  style={{
                    alignItems: isExploreSublayout && 'flex-start',
                    alignSelf: isExploreSublayout && 'flex-start',
                    width:
                      isExploreSublayout &&
                      tenantLayout?.horoscope?.exploreSublayout?.descWidth
                  }}
                >
                  {dailyHoroscopeData && (
                    <div
                      className='widget-horoscope-date'
                      style={{
                        fontFamily: tenantLayout?.fonts?.primary,
                        color:
                          isExploreSublayout &&
                          isExploreSublayout &&
                          tenantLayout?.horoscope?.exploreSublayout?.textColor
                      }}
                    >
                      {formatDateToDDMMYYYY(new Date())}
                    </div>
                  )}
                  <div
                    className={`widget-horoscope-tip ${isExploreSublayout ? 'sublayout' : ''}`}
                    style={{
                      fontFamily: tenantLayout?.fonts?.primary
                    }}
                  >
                    {dailyHoroscopeData &&
                    dailyHoroscopeData?.prediction?.personal
                      ? dailyHoroscopeData?.prediction?.personal
                      : tenantDefaultDescription(tenant)}
                  </div>
                  <div
                    className={`widget-horoscope-read-more ${isExploreSublayout ? 'sublayout' : ''}`}
                    style={{
                      fontFamily: tenantLayout?.fonts?.widgetTitle,
                      fontWeight: tenantLayout?.horoscope?.titleFontWeight
                    }}
                  >
                    <div>{t('horoscope.widget.readMore')}</div>
                    {!isExploreSublayout && (
                      <div className='widget-horoscope-read-more-icon'>
                        <RightArrowSmall />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <img
                className={`widget-horoscope-image ${tenant}`}
                src={
                  `${getWidgetBaseUrl(environment)}/images/horoscope-images/` +
                  imageLayoutDetail?.starSign
                }
                alt='horoscope-self'
                style={{
                  left: !isExploreSublayout && imageLayoutDetail?.left,
                  right: isExploreSublayout && imageLayoutDetail?.left,
                  top: imageLayoutDetail?.top,
                  width: imageLayoutDetail?.width,
                  height: imageLayoutDetail?.height
                }}
              />
            </div>
            {isFetchingLayout && (
              <div className='widget-horoscope-shimmer'>
                <CircularProgress color='inherit' />
                <div
                  className='widget-horoscope-loading-tip'
                  style={{
                    fontFamily: tenantLayout?.fonts?.primary
                  }}
                >
                  {t('horoscope.widget.loadText')}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

Horoscope.propTypes = {
  externalId: PropTypes.string,
  tenant: PropTypes.string,
  environment: PropTypes.string,
  setRedirectLoading: PropTypes.func,
  widgetComponents: PropTypes.array,
  userUnlockedComponents: PropTypes.array,
  isUnlockedComponentsLoading: PropTypes.bool,
  isExploreSublayout: PropTypes.bool
}

Horoscope.displayName = 'Horoscope'

export default Horoscope
