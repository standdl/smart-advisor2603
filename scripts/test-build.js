#!/usr/bin/env node

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 开始构建测试...\n')

try {
  // 检查 Node.js 版本
  console.log('📦 检查环境...')
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
  console.log(`   Node.js: ${nodeVersion}`)
  
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
  console.log(`   npm: ${npmVersion}`)
  
  // 清理之前构建
  console.log('\n🧹 清理构建目录...')
  execSync('rm -rf dist', { stdio: 'inherit' })
  
  // 安装依赖（如果node_modules不存在）
  console.log('\n📦 安装依赖...')
  execSync('npm install', { stdio: 'inherit' })
  
  // 代码检查
  console.log('\n🔍 代码检查...')
  execSync('npm run lint', { stdio: 'inherit' })
  
  // 生产构建
  console.log('\n⚡ 生产环境构建...')
  execSync('npm run build', { stdio: 'inherit' })
  
  // 检查构建结果
  console.log('\n📁 检查构建结果...')
  const fs = await import('fs')
  const distPath = resolve(__dirname, '../dist')
  
  if (!fs.existsSync(distPath)) {
    throw new Error('构建失败：dist 目录不存在')
  }
  
  const files = fs.readdirSync(distPath)
  console.log(`  构建文件数量: ${files.length}`)
  
  // 检查必要文件
  const requiredFiles = ['index.html', 'assets']
  const missingFiles = requiredFiles.filter(file => !files.includes(file))
  
  if (missingFiles.length > 0 && !files.includes('assets')) {
    console.warn(`  警告: 缺少必要文件: ${missingFiles.join(', ')}`)
  }
  
  console.log('\n✅ 构建测试通过！')
  console.log('\n📋 后续步骤:')
  console.log('   1. 推送代码到 GitHub 仓库')
  console.log('   2. 在 Vercel 控制台导入项目')
  console.log('   3. 配置环境变量（可选）')
  console.log('   4. 自动部署完成')
  
} catch (error) {
  console.error('\n❌ 构建测试失败:', error.message)
  process.exit(1)
}