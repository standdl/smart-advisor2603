# 智能参谋企业诊断平台

基于AI技术的企业财务与经营报告智能诊断平台，提供降本增效与韧性增长的专业建议。

## 功能特性

- **智能报告解析**：支持Excel/PDF格式财务报告自动解析
- **AI诊断引擎**：基于大模型生成专业诊断建议
- **行业对标分析**：对比行业标杆，发现改进机会
- **响应式设计**：PC端与移动端全适配
- **商业化路径**：基础功能免费 + 深度分析付费

## 技术栈

### 前端
- Vue 3 + Composition API
- Vite 5.0
- Vue Router 4
- Pinia 2
- Naive UI
- ECharts 5

### 开发工具
- ESLint + Prettier
- TypeScript（可选）
- Git + GitHub Actions

### 部署
- Vercel（自动部署）
- 自定义域名支持
- HTTPS 自动配置

## 快速开始

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 项目结构

```
src/
├── main.js                 # 应用入口
├── App.vue                 # 根组件
├── router/                 # 路由配置
│   └── index.js
├── views/                  # 页面组件
│   ├── HomeView.vue
│   ├── UploadView.vue
│   ├── ResultsView.vue
│   ├── LoginView.vue
│   ├── ProfileView.vue
│   └── NotFoundView.vue
├── components/             # 可复用组件
│   └── layout/
│       └── CommonHeader.vue
├── styles/                 # 全局样式
│   ├── variables.scss
│   └── main.scss
└── assets/                 # 静态资源
    ├── feishu-logo.svg
    └── dingtalk-logo.svg
```

## 部署指南

### Vercel 自动部署
1. 将代码推送到GitHub仓库
2. 在Vercel控制台导入项目
3. 配置环境变量（可选）
4. 自动部署完成

### 自定义域名
1. 在Vercel项目设置中添加域名
2. 配置DNS记录指向Vercel
3. 等待SSL证书自动签发

详细部署步骤请参阅：[部署文档](docs/deployment/vercel-deployment.md)

## 开发规范

### 代码风格
- 使用ESLint + Prettier统一代码风格
- Vue组件使用Composition API
- 组件命名采用PascalCase
- 文件命名采用kebab-case

### 提交规范
- 使用语义化版本号
- 提交信息格式：`类型(范围): 描述`
- 类型：feat, fix, docs, style, refactor, test, chore

### 分支管理
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复

## 相关文档

- [需求规格说明书](docs/spec.md)
- [设计文档](docs/design/)
- [API接口文档](docs/api/)
- [测试文档](docs/test/)

## 许可证

MIT License

## 联系方式

- 项目主页：https://advisor.yourcompany.com
- 技术支持：tech@smart-advisor.com
- 商务合作：business@smart-advisor.com

---

*© 2026 智能参谋平台团队*