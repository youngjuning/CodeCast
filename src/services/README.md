此目录用于存放 API 服务和网络请求相关代码。

建议的文件结构：
- api/：API 接口定义和实现
  - auth.ts：认证相关 API
  - user.ts：用户相关 API
  - index.ts：API 统一导出
- config/：API 配置
  - axios.ts：axios 实例和拦截器配置
  - endpoints.ts：API 端点配置

注意事项：
1. 使用 TypeScript 定义请求和响应类型
2. 实现统一的错误处理机制
3. 配置请求拦截器处理认证信息
4. 配置响应拦截器处理通用错误
5. 使用环境变量管理 API 地址

使用示例：
```typescript
// config/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

// config/endpoints.ts
export const Endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  user: {
    profile: '/user/profile',
    update: '/user/update',
  },
} as const

// api/auth.ts
import axiosInstance from '../config/axios'
import { Endpoints } from '../config/endpoints'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return axiosInstance.post(Endpoints.auth.login, data)
  },
  
  logout: async (): Promise<void> => {
    return axiosInstance.post(Endpoints.auth.logout)
  },
}

// 使用示例
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

const LoginScreen = () => {
  const setToken = useAuthStore((state) => state.setToken)

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      setToken(response.token)
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    // 登录表单组件
  )
}
```