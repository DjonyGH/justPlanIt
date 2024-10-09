import { IBaseItem } from '../../types/types'

export interface ITask extends IBaseItem {
  title: string
  isDone: boolean
  date: string
  userId: string
  order: number
}

export interface INewTask {
  title: string
  date?: string
}

export enum EMode {
  Edit,
  Create,
}
