import moment from 'moment'
import { conf } from '../config/config'

export const pause = (ms?: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms || conf.mockTimeout)
  })

export const addZeroBefore = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`
}

export const getDate = (date: string | undefined): string => {
  if (date && date.length <= 4) return moment(new Date(date)).format('YYYY')
  if (date && date.length <= 7) return ucFirst(moment(new Date(date)).locale('ru').format('MMMM YYYY'))

  return date ? moment(new Date(date)).format('DD.MM.YYYY') : '--'
}

export const getDateUTC = (value: string | Date): string => {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  return `${year}-${month}-${day}`
}

export const getCurrentDateUTC = (): string => {
  return getDateUTC(new Date())
}

export const getCurrentYear = (): number => {
  return new Date().getFullYear()
}

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1
}

export const getDateTime = (date: string | undefined, isShort?: boolean): string => {
  const format = isShort ? 'DD.MM.YY HH:mm' : 'DD.MM.YYYY HH:mm'
  return date ? moment(new Date(date)).format(format) : '--'
}

export const getDayName = (date: string | undefined): string => {
  return date ? new Date(date).toLocaleString('ru', { weekday: 'long' }) : '--'
}

export const isDateBefore = (date1: string, date2: string): boolean => {
  return moment(date1).isBefore(moment(date2))
}

export const isPastDate = (date: string | Date): boolean => {
  const currentDate = getCurrentDateUTC()
  return moment(date).isBefore(moment(currentDate))
}

export const isCurrentDate = (date: string | Date): boolean => {
  const currentDate = getCurrentDateUTC()
  return moment(date).isSame(moment(currentDate))
}

export const isFutureDate = (date: string | Date): boolean => {
  const currentDate = getCurrentDateUTC()
  return moment(date).isAfter(moment(currentDate))
}

export const ucFirst = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1)
}

export const isPastGoal = (date: string): boolean => {
  const currentDate = getCurrentDateUTC()
  let preparedDate
  if (date.length <= 4) {
    preparedDate = moment(new Date(date)).add(1, 'y').add(-1, 's')
  } else if (date.length <= 7) {
    preparedDate = moment(new Date(date)).add(1, 'M').add(-1, 's')
  } else {
    preparedDate = moment(new Date(date))
  }
  return preparedDate.isBefore(moment(currentDate))
}
