export interface IHttpService {
  get: <T>(url: string) => Promise<T>
  post: <T>(url: string, newData: T) => Promise<T>
  put: <T>(url: string, updData: T) => Promise<T>
}

export enum ELiga {
  Common = 'common', // серый цвет, не ограниченное кол-во участников (150 первых переходят в master лигу)
  Master = 'master', // синий цвет, 500 участников (50 первых переходят в epic лигу, 100 последних переходят в common лигу)
  Epic = 'epic', // фиолетовый цвет, 100 участников (50 последних переходят в master лигу)
}

export interface IUser {
  id: string
  tgId: number
  userName: string
  login: string
  liga: ELiga
  // globalRank: number
  // email: string
  // bonuses: number
  // w3Address?: string
}

export interface IUserNew {
  tgId: number
  userName?: string
  login?: string
}

export interface IAuthResponce {
  accessToken: string
  refreshToken: string
  user: IUser
}

export interface IRefreshResponce {
  user: IUser
  accessToken: string
}

export interface IRefreshBody {
  refreshToken: string | null
}

export interface ISignUpResponce {
  user: IUser
  accessToken: string
}

export interface IPrice {
  value: number
  token: string
}

export type IAwards = IPrice[]

export interface IBaseItem {
  _id: string
  id: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export enum EStatus {
  finished = 'finished',
  active = 'active',
}

export type TColor = 'green' | 'red' | 'blue' | 'purple' | undefined

export enum ELang {
  En = 'en',
  Ru = 'ru',
}
