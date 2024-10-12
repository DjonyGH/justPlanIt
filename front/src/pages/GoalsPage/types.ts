import { IBaseItem } from '../../types/types'

export interface IGoal extends IBaseItem {
  title: string
  isDone: boolean
  date: string
  userId: string
}

export interface INewGoal {
  title: string
  date: string
}

export enum EMode {
  Edit,
  Create,
}
