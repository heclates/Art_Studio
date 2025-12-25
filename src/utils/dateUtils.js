export function getNextWeekdayDate(targetDay) {
  const today = new Date()
  const todayDay = today.getDay()

  let diff = targetDay - todayDay
  if (diff < 0) diff += 7

  const result = new Date(today)
  result.setDate(today.getDate() + diff)

  const dd = String(result.getDate()).padStart(2, '0')
  const mm = String(result.getMonth() + 1).padStart(2, '0')
  const yyyy = result.getFullYear()

  return `${dd}/${mm}/${yyyy}`
}

export function normalizeWeekday(day) {
  const map = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    воскресенье: 0,
    понедельник: 1,
    вторник: 2,
    среда: 3,
    четверг: 4,
    пятница: 5,
    суббота: 6
  }

  return map[String(day).toLowerCase()]
}
