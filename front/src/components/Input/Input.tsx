import React from 'react'
import style from './input.module.scss'

interface IProps {
  type?: 'text' | 'password'
  placeholder?: string
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
}

export const Input: React.FC<IProps> = (props) => {
  const { type = 'text', placeholder, name, onChange, value, disabled = false, error = false, errorMsg } = props

  return (
    <div className={style.wrapper}>
      <input
        className={`${style.input} ${error ? style.error : ''}`}
        type={type}
        name={name}
        placeholder={placeholder || ''}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete='new-password'
      />
      <span className={`${style.errorMsg} ${error ? style.errorMsgVisible : ''}`}>{errorMsg}</span>
    </div>
  )
}
