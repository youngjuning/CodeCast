此目录用于存放状态管理相关代码，使用 Zustand 作为状态管理方案。

建议的文件结构：
- stores/：Zustand store 定义
  - authStore.ts：认证状态管理
  - userStore.ts：用户状态管理
  - appStore.ts：应用全局状态
  - settingsStore.ts：应用设置状态
- middleware/：Zustand 中间件
  - persist.ts：持久化配置
  - devtools.ts：开发工具配置
- types/：状态类型定义
  - auth.types.ts：认证相关类型
  - user.types.ts：用户相关类型
  - app.types.ts：应用状态类型

注意事项：
1. 使用 TypeScript 定义 store 和状态类型
2. 按功能模块拆分 store，保持单一职责
3. 使用 persist middleware 实现状态持久化
4. 开发环境启用 devtools 便于调试
5. 合理使用 selector 优化性能
6. 遵循 immutable 更新模式
7. 使用 shallow 比较避免不必要的重渲染

使用示例：
```typescript
// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
```