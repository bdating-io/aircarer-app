# AIRCARER

一个基于 React Native + Expo 开发的移动应用项目。
致力于建立澳洲最大长短租清洁平台

## 项目结构

AIRCARER/

├── .expo/ # Expo 配置文件
├── app/ # 应用主要代码
│ ├── layout.tsx # 布局组件
│ ├── +html.tsx # HTML 相关组件
│ ├── +not-found.tsx # 404 页面
│ └── index.tsx # 入口文件
├── assets/ # 静态资源文件
│ ├── fonts/ # 字体文件
│ ├── icons/ # 图标资源
│ └── images/ # 图片资源
├── components/ # 可复用组件
├── types/ # TypeScript 类型定义
└── node_modules/ # 安装包

app/
├── (tabs)/
│ ├── \_layout.tsx
│ ├── account.tsx
│ ├── chat.tsx
│ └── home.tsx
├── (pages)/
│ ├── (authentication)/
│ │ ├── login.tsx
│ │ ├── signup.tsx
│ │ └── profile.tsx
│ ├── (profile)/
│ │ ├── (cleanerProfile)/
│ │ │ ├── \_layout.tsx
│ │ │ └── cleanerProfile.tsx
│ │ ├── (houseOwner)/
│ │ │ ├── \_layout.tsx
│ │ │ └── userProfile.tsx
│ │ ├── experience.tsx
│ │ ├── pricing.tsx
│ │ ├── workingArea.tsx
│ │ ├── workingTime.tsx
│ │ ├── createUserProfile.tsx
│ │ └── userTerms.tsx
│ ├── account/
│ │ ├── notifications.tsx
│ │ └── settings.tsx
│ └── tasks/
│ ├── createTask.tsx
│ └── taskList.tsx
├── \_layout.tsx
└── index.tsx

## 技术栈

- React Native
- Expo
- TypeScript
- Firebase
- TailwindCSS
- Metro

## 开始使用

### 环境要求

- Node.js (推荐 14.0.0 或更高版本)
- npm 或 yarn
- Expo CLI

### 安装步骤

1. 克隆项目
2. 安装 node
   npm install yarn install

## 项目配置文件

- `app.json` - Expo 应用配置
- `babel.config.js` - Babel 配置
- `expo-env.d.ts` - Expo 环境类型定义
- `firebase.tsx` - Firebase 配置
- `global.css` - 全局样式
- `tailwind.config.js` - TailwindCSS 配置
- `tsconfig.json` - TypeScript 配置
- `nativewind-env.d.ts` - NativeWind 环境配置

## 目录说明

### app 目录

- `_layout.tsx` - 应用布局文件
- `+html.tsx` - HTML 相关组件
- `+not-found.tsx` - 404 错误页面
- `index.tsx` - 应用入口文件

### assets 目录

- `fonts/` - 字体资源
- `icons/` - 图标资源
- `images/` - 图片资源

### components 目录

可复用的组件集合

## 开发

- 使用 `yarn start`或者 `npm start` 启动开发服务器
- 使用 Expo Go 应用扫描二维码在真机上调试
- 或使用模拟器进行开发调试
