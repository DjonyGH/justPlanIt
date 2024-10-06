import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { IAuthResponce, IHttpService } from '../types/types'

export const BASE_URL = process.env.REACT_APP_BASE_URL

class HttpService implements IHttpService {
  http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
    })

    this.http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.headers && (config.headers.Authorization = `Bearer ${localStorage.getItem('access-token')}`)
      return config
    })

    this.http.interceptors.response.use(
      (config: AxiosResponse) => {
        return config
      },
      async (error) => {
        const originalRequest = error.config
        if (error.responce.status === 401 && error.config && !error.config._isRetry) {
          originalRequest._isRetry = true
          try {
            const responce = await axios.post<any, AxiosResponse<IAuthResponce>>(`${BASE_URL}/token/refresh`, {
              refreshToken: localStorage.getItem('refresh-token'),
            })
            console.log('test')

            localStorage.setItem('access-token', responce.data.accessToken)
            localStorage.setItem('refresh-token', responce.data.refreshToken)
            this.http.request(originalRequest)
          } catch (error) {
            console.log('Не авторизован')
          }
        }
        throw error
      }
    )
  }

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.http.get<T>(url)
      if (data) return data
      throw new Error('data not found')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async post<T, D = any>(url: string, newData?: D): Promise<T> {
    try {
      const { data } = await this.http.post<T, AxiosResponse<T>, D>(url, newData)
      if (data) return data
      throw new Error('error of creating')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async put<T, D = any>(url: string, updData: D): Promise<T> {
    try {
      const { data } = await this.http.put<T, AxiosResponse<T>, D>(url, updData)
      if (data) return data
      throw new Error('error of updating')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new HttpService()
