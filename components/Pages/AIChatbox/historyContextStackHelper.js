export const groupAndSortHistory = (dataList) => {
  if (!Array.isArray(dataList)) return {}

  const now = new Date()
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const msInDay = 86400000

  const todayStart = startOfDay(now).getTime()
  const yesterdayStart = todayStart - msInDay
  const sevenDaysAgo = todayStart - 7 * msInDay
  const thirtyDaysAgo = todayStart - 30 * msInDay

  const allHistory = {
    todayHistory: [],
    yesterdayHistory: [],
    previous7DaysHistory: [],
    previous30DaysHistory: []
  }

  dataList
    ?.filter((item) => item?.title?.trim?.())
    ?.sort((a, b) => (b?.updated_at ?? 0) - (a?.updated_at ?? 0))
    ?.forEach((item) => {
      const updated = item?.updated_at ?? 0

      if (updated >= todayStart) {
        allHistory.todayHistory.push(item)
      } else if (updated >= yesterdayStart && updated < todayStart) {
        allHistory.yesterdayHistory.push(item)
      } else if (updated >= sevenDaysAgo && updated < yesterdayStart) {
        allHistory.previous7DaysHistory.push(item)
      } else if (updated >= thirtyDaysAgo && updated < sevenDaysAgo) {
        allHistory.previous30DaysHistory.push(item)
      }
    })

  return allHistory
}
