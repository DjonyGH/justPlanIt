import { IBaseItem } from '../../types/types'

export interface ITask extends IBaseItem {
  title: string
  isDone: boolean
  date: string
  userId: string
}
