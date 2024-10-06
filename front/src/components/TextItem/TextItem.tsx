import React from 'react'
import { TColor } from '../../types/types'
import style from './styles.module.scss'

interface IProps {
  label: string
  text: string
  color?: TColor
}

export const TextItem: React.FC<IProps> = ({ label, text, color }) => {
  const getColorStyle = (color?: TColor) => {
    if (!color) return
    if (color === 'green') return style.green
    if (color === 'blue') return style.blue
    if (color === 'red') return style.red
    if (color === 'purple') return style.purple
  }

  return (
    <div className={style.textItem}>
      <div className={style.label}>{label}</div>
      <div className={`${style.text} ${getColorStyle(color)}`}>{text}</div>
    </div>
  )
}
