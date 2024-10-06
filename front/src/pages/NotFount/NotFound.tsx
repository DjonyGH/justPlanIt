import React from 'react'
import { observer } from 'mobx-react'

interface IProps {}

export const NotFound: React.FC<IProps> = observer(() => {
  console.log('NotFound')

  return <div>NotFound</div>
})
