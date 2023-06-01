import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

export type JSONValue = string | number | null | boolean | JSONValue[] | { [key: string]: JSONValue }

export class Http {
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    })
  }

  get<R = unknown>(
    url: string,
    query?: Record<string, string | boolean | number | undefined>,
    config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>,
  ) {
    return this.instance.request<HttpResponse<R>>({ url, params: query, method: 'GET', ...config })
  }

  post<R = unknown>(
    url: string,
    data?: Record<string, JSONValue> | FormData,
    config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>,
  ) {
    return this.instance.request<HttpResponse<R>>({ url, data, method: 'POST', ...config })
  }

  patch<R = unknown>(
    url: string,
    data?: Record<string, JSONValue>,
    config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>,
  ) {
    return this.instance.request<HttpResponse<R>>({ url, data, method: 'PATCH', ...config })
  }

  delete<R = unknown>(
    url: string,
    query?: Record<string, string>,
    config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>,
  ) {
    return this.instance.request<HttpResponse<R>>({ url, params: query, method: 'DELETE', ...config })
  }
}

export const http = new Http('/api')
http.instance.interceptors.response.use(
  (response: AxiosResponse<HttpResponse | Blob>) => {
    if (response.data instanceof Blob) {
      // download file
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', (response.headers['content-disposition']).split(';')[1].split('=')[1])
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
    return response
  },
  (error: AxiosError<HttpResponse>) => {
    throw error
  },
)
