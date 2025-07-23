import { translatedJsonData } from '../i18nextConfig'

export const NEWS_CATEGORIES = {
  DAILY_ROUNDUPS: 'daily_roundups',
  WORLD_NEWS: 'world_news',
  TECHNOLOGY: 'technology',
  HOT_TAKES: 'hot_takes',
  SPORTS: 'sports',
  ENTERTAINMENT: 'entertainment',
  STORY: 'story',
  MOVIES: 'movies',
  YOUTH: 'youth',
  OTHERS: 'others'
}

export const newsSections = [
  {
    id: 0,
    key: NEWS_CATEGORIES.WORLD_NEWS,
    title: translatedJsonData.news.newsTopics.worldNews,
    desc: translatedJsonData.news.newsTopics.worldNewsDesc,
    url: '/images/news_sections/news_section_1.jpg'
  },
  {
    id: 1,
    key: NEWS_CATEGORIES.TECHNOLOGY,
    title: translatedJsonData.news.newsTopics.latestInTech,
    desc: translatedJsonData.news.newsTopics.latestInTechDesc,
    url: '/images/news_sections/news_section_2.jpg'
  },
  {
    id: 2,
    key: NEWS_CATEGORIES.HOT_TAKES,
    title: translatedJsonData.news.newsTopics.hotTakes,
    desc: translatedJsonData.news.newsTopics.hotTakesDesc,
    url: '/images/news_sections/news_section_3.jpg'
  },
  {
    id: 3,
    key: NEWS_CATEGORIES.SPORTS,
    title: translatedJsonData.news.newsTopics.sports,
    desc: translatedJsonData.news.newsTopics.sportsDesc,
    url: '/images/news_sections/news_section_4.jpg'
  },
  {
    id: 4,
    key: NEWS_CATEGORIES.ENTERTAINMENT,
    title: translatedJsonData.news.newsTopics.entertainmentHighlight,
    desc: translatedJsonData.news.newsTopics.entertainmentHighlightDesc,
    url: '/images/news_sections/news_section_5.jpg'
  }
]
