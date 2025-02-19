此目录用于存放工具函数和通用辅助方法。

建议的文件结构：
- format/：格式化相关工具
  - date.ts：日期格式化
  - number.ts：数字格式化
  - string.ts：字符串处理
- validation/：数据验证工具
  - validators.ts：通用验证函数
  - schemas.ts：验证模式定义
- storage/：本地存储工具
  - asyncStorage.ts：AsyncStorage 封装
  - secureStorage.ts：安全存储封装

注意事项：
1. 使用 TypeScript 定义函数类型
2. 编写单元测试
3. 保持函数的纯粹性
4. 提供详细的文档注释
5. 避免重复造轮子，优先使用成熟的工具库

使用示例：
```typescript
// format/date.ts
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期
 * @param date ISO 日期字符串或 Date 对象
 * @param pattern 格式化模式
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, pattern = 'yyyy-MM-dd HH:mm:ss'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: zhCN })
}

// validation/validators.ts
/**
 * 邮箱格式验证
 * @param email 待验证的邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return pattern.test(email)
}

/**
 * 密码强度验证
 * @param password 待验证的密码
 * @returns 密码强度评级：weak | medium | strong
 */
export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak'
  
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*]/.test(password)
  
  if (hasLetter && hasNumber && hasSpecial) return 'strong'
  if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) return 'medium'
  return 'weak'
}

// storage/asyncStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export class Storage {
  /**
   * 存储数据
   * @param key 存储键
   * @param value 存储值
   */
  static async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (error) {
      console.error('Storage.set error:', error)
      throw error
    }
  }

  /**
   * 获取数据
   * @param key 存储键
   * @returns 存储的数据，如果不存在则返回 null
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (error) {
      console.error('Storage.get error:', error)
      throw error
    }
  }

  /**
   * 删除数据
   * @param key 存储键
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('Storage.remove error:', error)
      throw error
    }
  }
}

// 使用示例
import { formatDate, isValidEmail, checkPasswordStrength, Storage } from '@/utils'

// 日期格式化
const now = new Date()
const formattedDate = formatDate(now, 'yyyy年MM月dd日')

// 邮箱验证
const email = 'test@example.com'
if (isValidEmail(email)) {
  console.log('邮箱格式正确')
}

// 密码强度检查
const password = 'Abc123!@#'
const strength = checkPasswordStrength(password)
console.log('密码强度:', strength)

// 数据存储
await Storage.set('user-preferences', { theme: 'dark', language: 'zh' })
const preferences = await Storage.get('user-preferences')
```