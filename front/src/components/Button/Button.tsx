import React from 'react'
import style from './styles.module.scss'

interface IProps {
  type?: 'default' | 'primary'
  size?: 'normal' | 'min' | 'square'
  text: string | (() => React.ReactNode)
  onClick: () => void
  disabled?: boolean
  htmlType?: 'button' | 'submit'
  className?: string
}

export const Button: React.FC<IProps> = (props) => {
  const {
    type = 'default',
    size = 'normal',
    htmlType = 'button',
    text,
    onClick,
    disabled = false,
    className = '',
  } = props

  const typeClass: Record<'default' | 'primary', string> = {
    default: style.default,
    primary: style.primary,
  }

  const sizeClass: Record<'normal' | 'min' | 'square', string> = {
    normal: style.normal,
    min: style.min,
    square: style.square,
  }

  return (
    <button
      className={`${className} ${style.btn} ${sizeClass[size]} ${typeClass[type]}`}
      onClick={onClick}
      disabled={disabled}
      type={htmlType}
    >
      {typeof text === 'string' ? text : text()}
    </button>
  )
}
