import React from 'react'
import style from './tag.module.scss'

type TColor = 'red' | 'orange' | 'green' | 'blue' | 'purple'

interface IProps {
  text: string
  color?: TColor
}

export const Tag: React.FC<IProps> = ({ text, color = 'red' }) => {
  const getColotStyle = (color: TColor) => {
    if (color === 'red') return style.red
    if (color === 'orange') return style.orange
    if (color === 'green') return style.green
    if (color === 'blue') return style.blue
    return style.purple
  }
  return <span className={`${style.wrapper} ${getColotStyle(color)}`}>{text}</span>
}
