import moment from 'moment'
import { conf } from '../config/config'
import { ELiga, EStatus, TColor } from '../types/types'

export const pause = (ms?: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms || conf.mockTimeout)
  })

export const getShortAddress = (address: string) => {
  const firstSimbols = address.substring(0, 6)
  const lastSimbols = address.substring(address.length - 5, address.length - 1)
  return `${firstSimbols}...${lastSimbols}`
}

export const getDate = (date: string | undefined): string => {
  return date ? moment(new Date(date)).format('DD.MM.YYYY') : '--'
}

export const getDateTime = (date: string | undefined, isShort?: boolean): string => {
  const format = isShort ? 'DD.MM.YY HH:mm' : 'DD.MM.YYYY HH:mm'
  return date ? moment(new Date(date)).format(format) : '--'
}

export const isDateBefore = (date1: string, date2: string): boolean => {
  return moment(date1).isBefore(moment(date2))
}

export const getWinnersRatio = (winners: number): number[] => {
  const s = 100
  let firstEl = 0
  let pairSum = 0
  let step = 0
  if (winners % 2) {
    // Нечетное
    firstEl = s / (winners * 2)

    const centrEl = s / winners

    pairSum = (s - centrEl) / ((winners - 1) / 2)

    step = (pairSum - 2 * firstEl) / ((winners - 1) / 2 + 1 + ((winners - 1) / 2 - 1))
  } else {
    // Четное
    firstEl = s / ((winners + 1) * 2)
    pairSum = s / (winners / 2)
    step = (pairSum - 2 * firstEl) / (winners / 2 + (winners / 2 - 1))
  }

  let result: number[] = []
  for (let i = 0; i < winners; i++) {
    if (!i) result.push(+firstEl.toFixed(2))
    else result.push(+(firstEl + step * i).toFixed(2))
  }

  return result.reverse()
}

export const getLigaName = (liga?: ELiga): string => {
  const ligaNameMap: Record<ELiga, string> = {
    [ELiga.Common]: 'Common',
    [ELiga.Master]: 'Master',
    [ELiga.Epic]: 'Epic',
  }
  return liga !== undefined ? ligaNameMap[liga] : '--'
}

export const getLigaColor = (liga?: ELiga): TColor => {
  const ligaColorMap: Record<ELiga, TColor> = {
    [ELiga.Common]: 'green',
    [ELiga.Master]: 'blue',
    [ELiga.Epic]: 'purple',
  }
  return liga !== undefined ? ligaColorMap[liga] : undefined
}

export const getStatusName = (status?: EStatus): string => {
  const statusNameMap: Record<EStatus, string> = {
    [EStatus.finished]: 'Finished',
    [EStatus.active]: 'Active',
  }

  return status !== undefined ? statusNameMap[status] : '--'
}

export const getStatusColor = (status?: EStatus): TColor => {
  const statusColorMap: Record<EStatus, TColor> = {
    [EStatus.finished]: 'red',
    [EStatus.active]: 'green',
  }

  return status !== undefined ? statusColorMap[status] : undefined
}
