此目录用于存放项目的静态资源文件。

建议的文件结构：
- images/：图片资源
  - icons/：图标文件
  - backgrounds/：背景图片
  - logos/：Logo 相关
- fonts/：字体文件
- animations/：动画文件（如 Lottie）
- locales/：国际化资源文件

注意事项：
1. 图片资源建议使用 @2x, @3x 命名规范
2. 使用 TypeScript 为资源文件创建类型声明
3. 考虑资源文件的体积优化
4. 建议使用统一的资源引用方式
5. 为资源文件创建索引文件（index.ts）

使用示例：
```typescript
// types/assets.d.ts
declare module '*.png' {
  const content: any
  export default content
}

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

// index.ts
export const Images = {
  logo: {
    default: require('./images/logos/logo.png'),
    dark: require('./images/logos/logo-dark.png'),
  },
  icons: {
    home: require('./images/icons/home.png'),
    profile: require('./images/icons/profile.png'),
  },
  backgrounds: {
    auth: require('./images/backgrounds/auth-bg.png'),
  },
} as const

// 使用示例
import { Images } from '@/assets'
import LogoSvg from '@/assets/images/logos/logo.svg'

// 在组件中使用
<Image source={Images.logo.default} />
<LogoSvg width={24} height={24} />
```