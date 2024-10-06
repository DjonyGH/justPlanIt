import React, { ReactNode } from 'react'
import style from './row.module.scss'

interface IProps {
  children: ReactNode
  my?: number
  mt?: number
  mb?: number
  py?: number
  px?: number
  justify?: 'flex-start' | 'flex-end' | 'space-between' | 'center'
}

export const Row: React.FC<IProps> = (props) => {
  const { children, my, mt, mb, py, px, justify = 'flex-start' } = props
  return (
    <div
      className={`${style.row} ${justify === 'flex-start' ? style.start : ''} ${
        justify === 'flex-end' ? style.end : ''
      }`}
      style={{
        justifyContent: justify,
        marginTop: `${mt || my || 0}px`,
        marginBottom: `${mb || my || 0}px`,
        paddingTop: `${py || 0}px`,
        paddingBottom: `${py || 0}px`,
        paddingLeft: `${px || 0}px`,
        paddingRight: `${px || 0}px`,
      }}
    >
      {children}
    </div>
  )
}
