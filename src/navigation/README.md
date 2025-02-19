此目录用于存放导航相关的配置和组件。

建议的文件结构：
- types.ts：导航参数类型定义
- routes.ts：路由常量定义
- stacks/：各个导航栈的配置
  - AuthStack.tsx：认证相关页面导航
  - MainStack.tsx：主要页面导航
  - RootStack.tsx：根导航配置

注意事项：
1. 使用 TypeScript 定义导航参数类型
2. 统一管理路由名称常量
3. 合理组织导航栈结构
4. 实现导航守卫和权限控制

使用示例：
```typescript
// types.ts
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: {
    inviteCode?: string
  }
  ForgotPassword: undefined
}

export type MainStackParamList = {
  Home: undefined
  Profile: {
    userId: string
  }
  Settings: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// routes.ts
export const Routes = {
  Auth: {
    Root: 'Auth',
    Login: 'Login',
    Register: 'Register',
    ForgotPassword: 'ForgotPassword',
  },
  Main: {
    Root: 'Main',
    Home: 'Home',
    Profile: 'Profile',
    Settings: 'Settings',
  },
} as const

// stacks/AuthStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

// stacks/RootStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { useAuthStore } from '@/store/authStore'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const RootStack = () => {
  const token = useAuthStore((state) => state.token)

  return (
    <Stack.Navigator>
      {token ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  )
}

// 使用示例
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation()

  const handleRegister = () => {
    navigation.navigate('Register', { inviteCode: 'INVITE123' })
  }

  return (
    <Button title="注册" onPress={handleRegister} />
  )
}
```