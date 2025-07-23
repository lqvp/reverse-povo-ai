import React from 'react'
import PropTypes from 'prop-types'
import BackButton from '../../../../static/BackButton'
import { useTriviaContext } from '../../../../context/TriviaContext'
import { useTranslation } from 'react-i18next'
import { formatDateToDDMMMYYYY } from '../../../../helpers/helperFunctions'
import { useTenantConfig } from '../../../../useTenantConfig'
import { getTenantName } from '../../../../helpers/tenantHelper'

const tenant = getTenantName()

const TriviaWelcome = ({ clickHandler }) => {
  const {
    quizData,
    selectedCategory: selectedSection,
    selectedLayoutConfig: theme
  } = useTriviaContext()
  const { t } = useTranslation('common')
  const tenantLayout = useTenantConfig(tenant)

  return (
    selectedSection && (
      <div
        className='ai-store-trivia-question-welcome-wrapper main-body-wrapper'
        style={{
          backgroundColor: theme && theme?.primaryColor,
          background: tenantLayout?.trivia?.dailyQuiz?.primaryColor
        }}
      >
        <div className='ai-store-trivia-home-header'>
          <BackButton
            color={'#BFBFBF'}
            textVisible={false}
            isTriviaBackBtn={true}
          />
          {selectedSection?.category_id !== 'dailyQuiz' ? (
            <p>{t('trivia.trivia')}</p>
          ) : (
            ''
          )}
          <div className='ai-store-trivia-spacer'></div>
        </div>
        <div className='ai-store-trivia-question-welcome-desc'>
          {selectedSection?.is_daily_challenge && (
            <p
              style={{
                color: theme && tenantLayout?.trivia?.dailyQuiz?.tertiaryColor
              }}
            >
              {t('trivia.todaysTheme')}
            </p>
          )}
          <h1
            style={{
              color: theme && tenantLayout?.trivia?.dailyQuiz?.secondaryColor,
              fontFamily: tenantLayout?.trivia?.title?.fontFamily,
              wordSpacing: tenantLayout?.trivia?.title?.wordSpacing,
              fontWeight: tenantLayout?.trivia?.title?.fontWeight,
              textTransform: tenantLayout?.trivia?.title?.textTransform,
              fontSize:
                tenantLayout?.trivia?.title?.fontSize ??
                (selectedSection?.category_id === 'entertainment' ||
                selectedSection?.category_id === 'generalKnowledge'
                  ? '1.8rem'
                  : '2.25rem')
            }}
          >
            {selectedSection?.category_id === 'dailyQuiz' ? (
              <>{t('trivia.dailyQuiz')}</>
            ) : (
              <>{selectedSection?.title}</>
            )}
          </h1>
          {selectedSection?.category_id === 'dailyQuiz' && (
            <div
              className='ai-store-quiz-date'
              style={{
                color: theme && tenantLayout?.trivia?.dailyQuiz?.secondaryColor,
                fontFamily: theme && tenantLayout?.trivia?.title?.fontFamily
              }}
            >
              {formatDateToDDMMMYYYY(quizData?.created_at)}
            </div>
          )}
        </div>
        <div
          className='ai-store-trivia-question-welcome-media'
          style={{
            background: tenantLayout?.trivia?.dailyQuiz?.centreIconColor
          }}
        >
          <img
            alt='section_image'
            src={selectedSection?.image_url}
            className={
              selectedSection?.category_id === 'dailyQuiz' && 'daily-quiz-image'
            }
          />
        </div>
        <div className='ai-store-trivia-question-welcome-cta-wrapper'>
          <div
            className='ai-store-trivia-question-welcome-cta'
            style={{
              backgroundColor:
                theme && tenantLayout?.trivia?.dailyQuiz?.ctaBgColor,
              fontSize: tenantLayout?.trivia?.fontSize,
              color: tenantLayout?.trivia?.dailyQuiz?.generalTextColor
            }}
            onClick={clickHandler}
          >
            {t('trivia.startQuiz')}
          </div>
        </div>
      </div>
    )
  )
}

TriviaWelcome.propTypes = {
  clickHandler: PropTypes.func.isRequired
}

export default TriviaWelcome
