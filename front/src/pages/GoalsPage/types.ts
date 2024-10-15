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

export interface IGoalForm {
  title: string
  year: string
  month: IOption
  day: IOption
}

export enum EMode {
  Edit,
  Create,
}

export type TExpanded = Record<string, boolean>

export interface IOption {
  value: string
  label: string
}
