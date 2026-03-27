# Vercel 部署指南

本文档详细介绍了智能参谋平台的 Vercel 部署流程和配置说明。

## 1. 项目概述

智能参谋平台是一个基于 Vue 3 + Vite 构建的企业AI诊断网站，主要功能包括：
- 企业财务报告上传与解析
- AI驱动的降本增效诊断
- 行业对标与韧性增长分析
- 基础免费 + 付费深度分析的商业化路径

## 2. 技术栈

### 前端框架
- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理

### UI 组件库
- **Naive UI** - Vue 3 组件库
- **ECharts** - 数据可视化

### 开发工具
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化

### 部署平台
- **Vercel** - 静态站点部署

## 3. 环境要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 8.0.0 或更高版本
- **Git**: 版本控制

## 4. 本地开发

### 4.1 环境准备
```bash
# 克隆项目
git clone <your-repository-url>
cd smart-advisor-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4.2 代码规范
```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 4.3 构建测试
```bash
# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

## 5. Vercel 部署流程

### 5.1 准备工作
1. 注册 [Vercel](https://vercel.com) 账号
2. 连接 GitHub/GitLab/Bitbucket 账户

### 5.2 自动部署
1. 将代码推送到远程仓库
2. 登录 Vercel 控制台
3. 点击 "New Project"
4. 导入你的仓库
5. Vercel 自动检测配置并部署

### 5.3 手动部署（使用 Vercel CLI）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

### 5.4 使用 Access Token 部署
若需要在 CI/CD 环境或无交互环境下部署，可以使用 Access Token：

1. 在 Vercel 控制台生成 Token：
   - 进入 [Account Settings → Tokens](https://vercel.com/account/tokens)
   - 点击 "Create Token"，选择权限（建议：Deployments, Projects）
   - 复制生成的 Token

2. 使用 Token 部署：
```bash
# 设置环境变量
export VERCEL_TOKEN=你的Token值

# 部署到生产环境
vercel --prod --token $VERCEL_TOKEN
```

## 6. 预览部署记录

### 6.1 首次预览部署（计划时间：2026年3月27日 00:13）
- **状态**: 待执行（需要 Vercel 认证）
- **部署方式**: Vercel CLI
- **部署内容**: 项目骨架 + 基础界面（主页、上传页、导航栏）
- **AI 诊断功能**: 未包含（需后续集成）
- **预览链接**: 待生成

### 6.2 完成部署的步骤
1. **注册 Vercel 账号**（若未完成）
2. **将代码推送到 GitHub/GitLab 仓库**（若未完成）
3. **生成 Vercel Access Token**（用于自动化部署）
4. **重新执行部署任务**或手动执行以下命令：
   ```bash
   # 在项目根目录执行
   vercel --prod --token 你的Token
   ```

### 6.3 验证部署
部署成功后，请验证：
1. 预览链接可正常访问（如 `https://smart-advisor-platform.vercel.app`）
2. 主页正常加载，显示欢迎内容
3. 导航栏功能正常（首页、上传、登录等）
4. 上传页面基础交互正常（文件选择、模拟上传）

## 7. 配置文件说明

### 7.1 `vercel.json`
```json
{
  "buildCommand": "npm run build",        // 构建命令
  "outputDirectory": "dist",              // 输出目录
  "devCommand": "npm run dev",            // 开发命令
  "installCommand": "npm install",        // 安装命令
  "framework": "vite",                    // 框架类型
  "regions": ["hkg1"],                    // 部署区域（香港）
  "env": {
    "NODE_ENV": "production"              // 环境变量
  },
  "routes": [                             // 路由配置
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "rewrites": [                           // 重写规则
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 7.2 环境变量配置
在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `VITE_API_BASE_URL` | API基础地址 | `https://api.example.com` |
| `VITE_APP_NAME` | 应用名称 | `智能参谋` |

## 8. 域名配置

### 8.1 自定义域名
1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名（如 `advisor.yourcompany.com`）
3. 按照指引配置 DNS 记录

### 8.2 DNS 配置示例
```
类型   名称              值
CNAME  advisor          cname.vercel-dns.com
A      @                76.76.21.21
```

## 9. 持续集成/持续部署 (CI/CD)

### 9.1 自动部署规则
- 主分支（main/master）推送 → 生产环境部署
- 功能分支推送 → 预览环境部署
- Pull Request 创建 → 预览环境部署

### 9.2 预览环境
每次推送都会生成唯一的预览 URL，便于：
- 团队内部评审
- 客户演示
- 功能测试

## 10. 性能优化

### 10.1 构建优化
- 代码分割（Code Splitting）
- 图片优化（自动 WebP 转换）
- 资源压缩（Gzip/Brotli）

### 10.2 CDN 加速
Vercel 自动提供：
- 全球 CDN 分发
- 边缘缓存
- 自动 HTTPS

## 11. 监控与分析

### 11.1 性能监控
- 页面加载速度
- 首次内容渲染时间
- 最大内容渲染时间

### 11.2 业务分析
- 用户访问统计
- 功能使用情况
- 转化率分析

## 12. 故障排除

### 12.1 常见问题

#### 构建失败
**可能原因**：
1. Node.js 版本不兼容
2. 依赖安装失败
3. 配置错误

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install

# 更新 Node.js
nvm install 18
nvm use 18
```

#### 部署后页面空白
**可能原因**：
1. 路由配置错误
2. 资源路径错误
3. 浏览器兼容性问题

**解决方案**：
1. 检查 `vercel.json` 中的路由规则
2. 确认资源是否成功上传
3. 测试不同浏览器

### 12.2 日志查看
```bash
# 查看部署日志
vercel logs <deployment-url>

# 查看构建日志
vercel logs --build
```

## 13. 备份与恢复

### 13.1 代码备份
- GitHub/GitLab 远程仓库
- 定期本地备份

### 13.2 数据备份
- 用户上传文件（配置外部存储）
- 分析结果（数据库备份）

## 14. 安全最佳实践

### 14.1 网络安全
- 强制 HTTPS
- CSP 策略配置
- XSS 防护

### 14.2 数据安全
- 文件上传验证
- 敏感数据加密
- 访问权限控制

## 15. 更新与维护

### 15.1 日常维护
- 定期更新依赖
- 监控性能指标
- 处理用户反馈

### 15.2 版本发布
1. 功能开发完成
2. 代码审查通过
3. 测试验证通过
4. 生产环境部署

---

## 附录

### A. 相关链接
- [Vercel 文档](https://vercel.com/docs)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)

### B. 联系支持
- 技术问题：tech@smart-advisor.com
- 业务咨询：business@smart-advisor.com
- 紧急联系：+86 138 0013 8000

---

*文档版本：v1.1*  
*最后更新：2026年3月26日*  
*更新内容：添加预览部署记录、Token部署方法*
## 7. GitHub代码推送记录

### 7.1 首次推送尝试（2026年3月27日 15:50）
- **状态**: 失败
- **失败原因**: 提供的GitHub Token权限不足，无法访问仓库资源
- **详细错误**: 
  ```
  remote: Permission to standdl/smart-advisor2603.git denied to standdl.
  fatal: unable to access 'https://github.com/standdl/smart-advisor2603.git/': The requested URL returned error: 403
  ```
- **验证结果**: 
  - Token可成功调用GitHub API查询用户信息（login: standdl）
  - Token无repo写权限，无法推送代码
  - 仓库状态：存在且为空（public repository）

### 7.2 解决方案
1. **重新生成GitHub Token**：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - **权限选择**：必须勾选 `repo`（完整控制仓库权限）
   - 生成后立即复制Token值

2. **提供新Token**：
   - 将新Token通过私密方式发送
   - 我将立即重新执行代码推送

3. **验证推送**：
   - 成功后GitHub仓库将显示所有项目文件
   - 后续Vercel部署可正常进行

### 7.3 当前状态
- **项目文件**: 已就绪于本地环境（`/app/data/files`）
- **Git仓库**: 已初始化，关联远程仓库
- **代码提交**: 已完成本地提交（56个文件）
- **推送阻塞**: Token权限不足，等待新Token

---
*更新时间：2026年3月27日 16:10*
