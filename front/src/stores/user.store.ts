import axios, { AxiosResponse } from 'axios'
import { action, makeObservable, observable } from 'mobx'
import http, { BASE_URL } from '../services/http.service'
import { IAuthResponce, IRefreshBody, IRefreshResponce, IUser, IUserNew } from '../types/types'
import { RootStore } from './root.store'

export interface IUserStore {
  isAuth?: boolean
  user?: IUser
  setIsAuth: (data: boolean) => void
  setUser: (data: IUser) => void
  signUp: (user: IUserNew, code: string) => Promise<boolean>
  checkAuth: () => Promise<void>
  login: (login: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  fetchUser: (newUser: IUserNew) => Promise<void>
}

export default class UserStore implements IUserStore {
  isAuth?: boolean
  user?: IUser

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      isAuth: observable,
      user: observable,
      setIsAuth: action,
      setUser: action,
      checkAuth: action,
      logout: action,
      fetchUser: action,
    })
  }

  setIsAuth(data: boolean) {
    this.isAuth = data
  }

  setUser(data: IUser | undefined) {
    this.user = data
  }

  async fetchUser(newUser: IUserNew) {
    try {
      this.rootStore.loaderStore.setIsLoading(true)
      let data: IUser = await http.post<IUser>(`/users`, newUser)
      this.setUser({
        ...data,
        //@ts-ignore
        id: data._id,
      })
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async signUp(user: IUserNew, code: string): Promise<boolean> {
    try {
      this.rootStore.loaderStore.setIsLoading(true)

      await axios.post<any, AxiosResponse<IAuthResponce>>(`${BASE_URL}/users`, {
        user,
        code,
      })
      return true
    } catch (error: any) {
      this.setIsAuth(false)
      return false
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async checkAuth() {
    try {
      this.rootStore.loaderStore.setIsLoading(true)

      const refreshToken = localStorage.getItem('refresh-token')
      if (!refreshToken) throw new Error('refreshToken not found')

      const { data } = await axios.post<any, AxiosResponse<IRefreshResponce>>(`${BASE_URL}/token/refresh`, {
        refreshToken,
      })

      const { user, accessToken } = data
      localStorage.setItem('access-token', accessToken)
      this.setIsAuth(true)
      this.setUser(user)
    } catch (error: any) {
      this.setIsAuth(false)
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async login(login: string, password: string): Promise<boolean> {
    try {
      this.rootStore.loaderStore.setIsLoading(true)

      const { data } = await axios.post<any, AxiosResponse<IAuthResponce>>(`${BASE_URL}/auth/login`, {
        login,
        password,
      })

      const { user, accessToken, refreshToken } = data
      localStorage.setItem('access-token', accessToken)
      localStorage.setItem('refresh-token', refreshToken)
      this.setIsAuth(true)
      this.setUser(user)
      return true
    } catch (error: any) {
      this.setIsAuth(false)
      return false
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async logout() {
    try {
      this.rootStore.loaderStore.setIsLoading(true)
      await http.post<unknown, IRefreshBody>('/auth/logout', { refreshToken: localStorage.getItem('refresh-token') })

      localStorage.removeItem('access-token')
      localStorage.removeItem('refresh-token')
      this.setIsAuth(false)
      this.setUser(undefined)
    } catch (error: any) {
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }
}
