import { EStatus } from '../../types/types'

export interface IGameAccess {
  isAccess: boolean
  nextGameDate?: string
  existGameId?: string
}

export interface ITournament {
  id: string
  name: string
  status: EStatus
  startDate: string
  endDate: string
  playerCount: number
  myPlace: number
  myPoints: number
  myGames: number
}
