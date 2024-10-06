import React from 'react'
import { RouteProps } from 'react-router-dom'
import { TasksPage } from '../pages/TasksPage/TasksPage'
import { NotFound } from '../pages/NotFount/NotFound'

export interface IRouteValue {
  exact?: boolean
  path: string
  component: React.ComponentType<RouteProps>
  getLink?: (gameId: string) => string
}

type TRouteKey = 'tasks' | 'tasksWithoutDate' | 'monthGoals' | 'yearGoals' | 'faq'

export type TRouteValue = Record<TRouteKey, IRouteValue>

export const routes: TRouteValue = {
  tasks: {
    path: '/',
    component: TasksPage,
    exact: true,
  },
  tasksWithoutDate: {
    path: '/tasksWithoutDate',
    component: NotFound,
    exact: true,
  },
  monthGoals: {
    path: '/monthGoals',
    component: NotFound,
    exact: true,
  },
  yearGoals: {
    path: '/yearGoals',
    component: NotFound,
    exact: true,
  },

  faq: {
    path: '/faq',
    component: NotFound,
    exact: true,
  },
}
