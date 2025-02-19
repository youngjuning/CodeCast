此目录用于存放页面级别的组件。

建议按照功能模块进行子文件夹划分，例如：
- auth/：认证相关页面（登录、注册等）
- home/：主页相关页面
- profile/：用户资料相关页面
- settings/：设置相关页面

每个页面组件应该：
1. 使用 TypeScript
2. 遵循页面组件命名规范（以 Screen 结尾）
3. 包含必要的测试文件
4. 实现页面级别的状态管理
5. 包含必要的文档注释

使用示例：
```typescript
// auth/LoginScreen.tsx
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Input } from '@/components/common'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api'
import { Theme } from '@/theme'

interface LoginForm {
  email: string
  password: string
}

/**
 * 登录页面
 * 
 * @description 处理用户登录流程，包括表单验证和错误处理
 */
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation()
  const setToken = useAuthStore((state) => state.setToken)

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.login(form)
      setToken(response.token)
    } catch (err) {
      setError('登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="邮箱"
        value={form.email}
        onChangeText={(email) => setForm({ ...form, email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="密码"
        value={form.password}
        onChangeText={(password) => setForm({ ...form, password })}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="登录"
        onPress={handleLogin}
        loading={loading}
        disabled={!form.email || !form.password}
      />
      <Button
        title="注册账号"
        onPress={handleRegister}
        variant="outline"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
  },
  error: {
    color: Theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
})

// LoginScreen.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { LoginScreen } from './LoginScreen'
import { authApi } from '@/services/api'

jest.mock('@/services/api')

describe('LoginScreen', () => {
  it('handles login success', async () => {
    const mockResponse = { token: 'test-token' }
    ;(authApi.login as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('邮箱'), 'test@example.com')
    fireEvent.changeText(getByPlaceholderText('密码'), 'password123')
    fireEvent.press(getByText('登录'))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('displays error message on login failure', async () => {
    ;(authApi.login as jest.Mock).mockRejectedValueOnce(new Error('Login failed'))

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('邮箱'), 'test@example.com')
    fireEvent.changeText(getByPlaceholderText('密码'), 'password123')
    fireEvent.press(getByText('登录'))

    await waitFor(() => {
      expect(getByText('登录失败，请检查邮箱和密码')).toBeTruthy()
    })
  })
})
```