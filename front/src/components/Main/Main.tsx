import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '../..'
import style from './styles.module.scss'

interface IProps {
  children: React.ReactNode
}

const antIcon = <LoadingOutlined style={{ fontSize: 75 }} spin />

export const Main: React.FC<IProps> = observer(({ children }) => {
  const { loaderStore } = useStore()
  return (
    <div className={style.main}>
      {children}
      {loaderStore.isLoading && (
        <div className={style.loader}>
          <Spin indicator={antIcon} />
        </div>
      )}
    </div>
  )
})
