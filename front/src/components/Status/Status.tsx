import React from 'react'
import style from './status.module.scss'
import { EStatus, TColor } from '../../types/types'
import { getStatusColor, getStatusName } from '../../utils/utils'

interface IProps {
  status: EStatus
}

export const Status: React.FC<IProps> = ({ status }) => {
  const getColorStyle = (color?: TColor) => {
    if (!color) return
    if (color === 'green') return style.green
    if (color === 'blue') return style.blue
    if (color === 'red') return style.red
    if (color === 'purple') return style.purple
  }

  const statusColor = getStatusColor(status)

  return <div className={`${style.wrapper} ${getColorStyle(statusColor)}`}>{getStatusName(status)}</div>
}
