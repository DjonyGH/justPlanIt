export interface IHttpService {
  get: <T>(url: string) => Promise<T>
  post: <T>(url: string, newData: T) => Promise<T>
  put: <T>(url: string, updData: T) => Promise<T>
}

export interface IUser {
  id: string
  tgId: number
  userName: string
  login: string
}

export interface IUserNew {
  tgId: number
  userName?: string
  login?: string
}

export interface ICheckData {
  hash: string
  checkData: string
}

export interface IAuthResponce {
  accessToken: string
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
