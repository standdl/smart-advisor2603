<template>
  <div class="home">
    <!-- 导航栏 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>智能参谋</h1>
          <span class="tagline">企业AI诊断助手</span>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link active">首页</router-link>
          <router-link to="/upload" class="nav-link">降本增效</router-link>
          <router-link to="/upload?module=growth" class="nav-link">韧性增长</router-link>
          <router-link to="/profile" class="nav-link">我的诊断</router-link>
          <router-link to="/login" class="nav-link">登录/注册</router-link>
        </nav>
        <div class="mobile-menu-btn">
          <n-icon size="24">
            <MenuIcon />
          </n-icon>
        </div>
      </div>
    </header>

    <!-- 英雄区 -->
    <section class="hero">
      <div class="container">
        <h2 class="hero-title">企业智能参谋，7x24小时AI诊断助手</h2>
        <p class="hero-subtitle">上传财务/经营报告，获取专业降本增效与韧性增长建议</p>
        <div class="hero-actions">
          <n-button type="primary" size="large" @click="$router.push('/upload')">
            免费试用
          </n-button>
          <n-button size="large" @click="showDemo">
            观看演示
          </n-button>
        </div>
      </div>
    </section>

    <!-- 功能展示区 -->
    <section class="features">
      <div class="container">
        <h3 class="section-title">核心功能</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <n-icon size="48" color="#2A5CAA">
                <WalletIcon />
              </n-icon>
            </div>
            <h4 class="feature-title">降本增效</h4>
            <p class="feature-description">
              分析财务报告，识别成本优化空间，提供具体行动建议
            </p>
            <router-link to="/upload" class="feature-link">
              开始分析 →
            </router-link>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <n-icon size="48" color="#28A745">
                <TrendingIcon />
              </n-icon>
            </div>
            <h4 class="feature-title">韧性增长</h4>
            <p class="feature-description">
              分析经营报告，对比行业标杆，制定可持续增长策略
            </p>
            <router-link to="/upload?module=growth" class="feature-link">
              开始分析 →
            </router-link>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <n-icon size="48" color="#6F42C1">
                <CompareIcon />
              </n-icon>
            </div>
            <h4 class="feature-title">行业对比</h4>
            <p class="feature-description">
              基于行业数据库，对比竞争对手表现，发现改进机会
            </p>
            <router-link to="/upload" class="feature-link">
              查看对比 →
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 操作指引区 -->
    <section class="workflow">
      <div class="container">
        <h3 class="section-title">简单三步，获取专业建议</h3>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h4 class="step-title">上传报告</h4>
            <p class="step-description">上传Excel或PDF格式的财务/经营报告</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h4 class="step-title">AI诊断</h4>
            <p class="step-description">AI自动解析数据，识别关键问题与机会</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h4 class="step-title">获取建议</h4>
            <p class="step-description">获得结构化诊断报告与可执行行动建议</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作伙伴展示 -->
    <section class="partners">
      <div class="container">
        <h3 class="section-title">生态合作伙伴</h3>
        <div class="partners-logos">
          <div class="partner-logo">
            <img src="@/assets/feishu-logo.svg" alt="飞书" />
            <span class="partner-tag">生态合作应用</span>
          </div>
          <div class="partner-logo">
            <img src="@/assets/dingtalk-logo.svg" alt="钉钉" />
            <span class="partner-tag">生态合作应用</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h5 class="footer-title">智能参谋</h5>
            <p class="footer-description">
              为企业提供AI驱动的专业管理咨询服务
            </p>
          </div>
          <div class="footer-section">
            <h5 class="footer-title">产品</h5>
            <ul class="footer-links">
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/upload">降本增效</router-link></li>
              <li><router-link to="/upload?module=growth">韧性增长</router-link></li>
              <li><router-link to="/profile">我的诊断</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h5 class="footer-title">支持</h5>
            <ul class="footer-links">
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">服务条款</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h5 class="footer-title">关注我们</h5>
            <ul class="footer-links">
              <li><a href="#">微信公众号</a></li>
              <li><a href="#">行业洞察</a></li>
              <li><a href="#">客户案例</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 智能参谋平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { Menu, TrendingUp, GitCompare } from '@vicons/ionicons5'
import { Wallet } from '@vicons/tabler'

// 图标组件
const MenuIcon = Menu
const WalletIcon = Wallet
const TrendingIcon = TrendingUp
const CompareIcon = GitCompare

const showDemo = () => {
  // 显示演示视频或模态框
  alert('演示功能即将上线，敬请期待！')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.home {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .header {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;

      h1 {
        font-size: 24px;
        font-weight: 700;
        color: $primary-color;
        margin: 0;
      }

      .tagline {
        font-size: 14px;
        color: $text-secondary;
        background: $bg-light;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }

    .nav {
      display: flex;
      gap: 32px;

      &-link {
        color: $text-primary;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover, &.active {
          color: $primary-color;
        }
      }
    }

    .mobile-menu-btn {
      display: none;
    }
  }

  .hero {
    padding: 160px 0 80px;
    background: linear-gradient(135deg, #2A5CAA 0%, #4A8CE0 100%);
    color: white;
    text-align: center;

    &-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    &-subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 40px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    &-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  }

  .features {
    padding: 80px 0;
    background: white;

    .section-title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 48px;
      color: $text-primary;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .feature-card {
      background: white;
      border: 1px solid $border-color;
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      &-icon {
        margin-bottom: 24px;
      }

      &-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: $text-primary;
      }

      &-description {
        color: $text-secondary;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      &-link {
        color: $primary-color;
        text-decoration: none;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .workflow {
    padding: 80px 0;
    background: $bg-light;

    .section-title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 48px;
      color: $text-primary;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      max-width: 900px;
      margin: 0 auto;
    }

    .step {
      text-align: center;

      &-number {
        width: 64px;
        height: 64px;
        background: $primary-color;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        margin: 0 auto 24px;
      }

      &-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: $text-primary;
      }

      &-description {
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }

  .partners {
    padding: 80px 0;
    background: white;

    .section-title {
      text-align: center;
      font-size: 32px;
      margin-bottom: 48px;
      color: $text-primary;
    }

    .partners-logos {
      display: flex;
      justify-content: center;
      gap: 64px;
    }

    .partner-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      img {
        height: 48px;
      }

      .partner-tag {
        font-size: 12px;
        color: $text-secondary;
        background: $bg-light;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }
  }

  .footer {
    background: #1a1a1a;
    color: white;
    padding: 60px 0 30px;

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    &-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      margin-bottom: 40px;
    }

    &-section {
      .footer-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .footer-description {
        color: rgba(255,255,255,0.7);
        line-height: 1.6;
      }
    }

    &-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;
      }

      a {
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: white;
        }
      }
    }

    &-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 30px;
      text-align: center;
      color: rgba(255,255,255,0.5);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .home {
    .header {
      .nav {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }
    }

    .hero {
      padding: 120px 0 60px;

      &-title {
        font-size: 32px;
      }

      &-subtitle {
        font-size: 18px;
      }

      &-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    .features {
      .features-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .workflow {
      .steps {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .partners {
      .partners-logos {
        flex-direction: column;
        gap: 32px;
      }
    }

    .footer {
      &-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
      }
    }
  }
}
</style>