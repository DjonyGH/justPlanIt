import React, { ReactNode } from 'react'
import style from './title.module.scss'

interface IProps {
  children: ReactNode
}

export const Title: React.FC<IProps> = ({ children }) => {
  return <h2 className={style.title}>{children}</h2>
}
