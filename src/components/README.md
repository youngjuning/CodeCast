此目录用于存放可复用的 React 组件。

建议按照功能或类型进行子文件夹划分，例如：
- common/：通用组件（按钮、输入框等）
- layout/：布局相关组件
- forms/：表单相关组件
- modals/：弹窗组件

每个组件应该：
1. 使用 TypeScript
2. 包含必要的测试文件
3. 有完整的 Props 类型定义
4. 包含必要的文档注释

使用示例：
```typescript
// common/Button/Button.tsx
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Theme } from '@/theme'

export interface ButtonProps {
  /** 按钮文字内容 */
  title: string
  /** 点击事件处理函数 */
  onPress: () => void
  /** 按钮类型：primary | secondary | outline */
  variant?: 'primary' | 'secondary' | 'outline'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
}

/**
 * 通用按钮组件
 * 
 * @example
 * ```tsx
 * <Button
 *   title="登录"
 *   onPress={handleLogin}
 *   variant="primary"
 *   loading={isLoading}
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Theme.colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: Theme.colors.primary,
  },
})

// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="测试按钮" onPress={onPress} />
    )
    
    expect(getByText('测试按钮')).toBeTruthy()
  })

  it('handles press correctly', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="测试按钮" onPress={onPress} />
    )
    
    fireEvent.press(getByText('测试按钮'))
    expect(onPress).toHaveBeenCalled()
  })
})
```