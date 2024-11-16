import React from 'react'
import { observer } from 'mobx-react'

interface IProps {}

export const NotAuth: React.FC<IProps> = observer(() => {

  return <div style={{color: 'black'}}>Ошибка авторизации</div>
})
