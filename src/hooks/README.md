此目录用于存放自定义 React Hooks。

建议的文件结构：
- useAuth.ts：认证相关钩子
- useForm.ts：表单处理钩子
- useApi.ts：API 请求钩子
- useTheme.ts：主题相关钩子
- usePermission.ts：权限控制钩子

每个 Hook 应该：
1. 使用 TypeScript
2. 遵循 Hook 命名规范（以 use 开头）
3. 包含必要的测试文件
4. 有完整的参数和返回值类型定义
5. 包含必要的文档注释
6. 保持单一职责原则

使用示例：
```typescript
// useApi.ts
import { useState, useCallback } from 'react'
import axios, { AxiosError } from 'axios'

interface UseApiOptions<T> {
  /** 初始数据 */
  initialData?: T
  /** 是否自动执行请求 */
  autoFetch?: boolean
  /** 请求成功回调 */
  onSuccess?: (data: T) => void
  /** 请求失败回调 */
  onError?: (error: Error) => void
}

interface UseApiResult<T> {
  /** 请求数据 */
  data: T | null
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: Error | null
  /** 执行请求函数 */
  fetch: () => Promise<void>
  /** 重置状态 */
  reset: () => void
}

/**
 * API 请求 Hook
 * 
 * @example
 * ```tsx
 * interface User {
 *   id: number
 *   name: string
 * }
 * 
 * const UserProfile = () => {
 *   const { data, loading, error, fetch } = useApi<User>(
 *     '/api/user/profile',
 *     { autoFetch: true }
 *   )
 * 
 *   if (loading) return <LoadingSpinner />
 *   if (error) return <ErrorMessage message={error.message} />
 *   if (!data) return null
 * 
 *   return <Text>Welcome, {data.name}!</Text>
 * }
 * ```
 */
export function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { initialData, autoFetch = false, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(initialData || null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<T>(url)
      setData(response.data)
      onSuccess?.(response.data)
    } catch (err) {
      const error = err as AxiosError
      setError(new Error(error.message))
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError])

  const reset = useCallback(() => {
    setData(initialData || null)
    setLoading(false)
    setError(null)
  }, [initialData])

  // 自动执行请求
  useEffect(() => {
    if (autoFetch) {
      fetch()
    }
  }, [autoFetch, fetch])

  return { data, loading, error, fetch, reset }
}

// useApi.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useApi } from './useApi'
import axios from 'axios'

jest.mock('axios')

describe('useApi', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test User' }
    ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData })

    const { result } = renderHook(() => useApi('/api/test'))

    expect(result.current.loading).toBe(false)
    
    await act(async () => {
      await result.current.fetch()
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles error correctly', async () => {
    const error = new Error('Network Error')
    ;(axios.get as jest.Mock).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useApi('/api/test'))

    await act(async () => {
      await result.current.fetch()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeTruthy()
    expect(result.current.error?.message).toBe('Network Error')
  })
})
```