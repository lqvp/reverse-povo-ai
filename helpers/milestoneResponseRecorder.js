import common from '@kelchy/common'
import { trackEvent } from './analyticsHelper'
import { axiosPost } from '../utils/axios'

export const recordGameCompletionResponse = async (
  authorizationId,
  game_id
) => {
  if (authorizationId && game_id) {
    const { error: gameCompletionResponseError } = await common.awaitWrap(
      axiosPost('/fun-games/create-fun-games-response', {
        fun_game_id: game_id
      })
    )
    if (!gameCompletionResponseError) {
      trackEvent('game play completed', {
        external_id: authorizationId,
        fun_game_id: game_id
      })
    }
  }
}

export const recordNewsResponseCompletionResponse = async (
  authorizationId,
  news_id,
  news_category
) => {
  if (authorizationId && news_id && news_category) {
    const { error: gameCompletionResponseError } = await common.awaitWrap(
      axiosPost('/news/create-news-response', {
        news_id: news_id,
        news_category: news_category
      })
    )
    if (!gameCompletionResponseError) {
      trackEvent('news response recorded', {
        external_id: authorizationId,
        news_id: news_id,
        news_category: news_category
      })
    }
  }
}

export const recordTrendingPostCompletionResponse = async (
  authorizationId,
  post_id
) => {
  if (authorizationId && post_id) {
    const { error: gameCompletionResponseError } = await common.awaitWrap(
      axiosPost('/trending-posts/create-trending-post-response', {
        trending_post_id: post_id
      })
    )
    if (!gameCompletionResponseError) {
      trackEvent('trending post response recorded', {
        external_id: authorizationId,
        trending_post_id: post_id
      })
    }
  }
}
