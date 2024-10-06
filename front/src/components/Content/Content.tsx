import React from 'react'
import style from './styles.module.scss'

interface IProps {
  children: React.ReactNode
}

export const Content: React.FC<IProps> = ({ children }) => {
  return <div className={style.content}>{children}</div>
}
