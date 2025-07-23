// Get aggregate stats
export function getAggregateData(data) {
  const resetData = {}
  if (data !== null) {
    data.forEach((element) => {
      const { question_id, ...rest } = element
      resetData[question_id] = rest
    })
  }

  return resetData
}

// Get stats for a specific question
export function getStats(questionID, responseStats) {
  if (responseStats && questionID) {
    if (!(questionID in responseStats)) {
      responseStats[questionID] = {}
    }
    return responseStats[questionID]
  }
}

// Get updated stats for a specific question
export function getUpdatedStats(optionID, responseStats, setCurrentStats) {
  if (responseStats) {
    if (!responseStats[optionID]) {
      responseStats[optionID] = 0
    }
    if (!responseStats.total) {
      responseStats.total = 0
    }
    responseStats[optionID] += 1
    responseStats.total += 1
  }

  setCurrentStats(responseStats)
}

export const getFontSizeByWordCount = (wordCount) => {
  if (wordCount <= 5) {
    return '24px'
  } else if (wordCount <= 10) {
    return '20px'
  } else {
    return '16px'
  }
}
