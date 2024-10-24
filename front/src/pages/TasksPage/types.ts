import { IBaseItem } from '../../types/types'

export interface ITask extends IBaseItem {
  title: string
  isDone: boolean
  date: string
  userId: string
  order: number
  isImportant?: boolean
  goalId?: string
}

export interface INewTask {
  title: string
  date?: string
  isImportant: boolean
}

export enum EMode {
  Edit,
  Create,
}

export type TExpanded = Record<string, boolean>
