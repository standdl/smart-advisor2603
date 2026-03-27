<template>
  <div class="not-found">
    <!-- 导航栏 -->
    <CommonHeader />
    
    <div class="container">
      <div class="error-content">
        <!-- 404图标 -->
        <div class="error-icon">
          <n-icon size="120" color="#2A5CAA">
            <CompassIcon />
          </n-icon>
        </div>

        <!-- 错误信息 -->
        <div class="error-message">
          <h1>404</h1>
          <h2>页面未找到</h2>
          <p>抱歉，您访问的页面可能已被移动、删除或暂时不可用。</p>
        </div>

        <!-- 操作建议 -->
        <div class="suggestions">
          <h3>您可以尝试：</h3>
          <div class="suggestion-cards">
            <div class="suggestion-card" @click="$router.push('/')">
              <n-icon size="32" color="#2A5CAA">
                <HomeIcon />
              </n-icon>
              <h4>返回首页</h4>
              <p>回到智能参谋的主页，重新开始</p>
            </div>

            <div class="suggestion-card" @click="$router.push('/upload')">
              <n-icon size="32" color="#28A745">
                <CloudUploadIcon />
              </n-icon>
              <h4>上传报告</h4>
              <p>立即开始您的企业诊断分析</p>
            </div>

            <div class="suggestion-card" @click="contactSupport">
              <n-icon size="32" color="#FF6B35">
                <HelpIcon />
              </n-icon>
              <h4>联系支持</h4>
              <p>需要帮助？我们的团队随时待命</p>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-section">
          <h3>或者搜索您需要的内容：</h3>
          <div class="search-box">
            <n-input
              v-model:value="searchQuery"
              placeholder="请输入关键词..."
              size="large"
              round
              @keyup.enter="performSearch"
            >
              <template #suffix>
                <n-icon @click="performSearch">
                  <SearchIcon />
                </n-icon>
              </template>
            </n-input>
            <n-button type="primary" size="large" @click="performSearch">
              搜索
            </n-button>
          </div>
        </div>

        <!-- 常见链接 -->
        <div class="quick-links">
          <h3>常用页面：</h3>
          <div class="links-grid">
            <router-link to="/" class="link-item">
              <n-icon size="16">
                <HomeIcon />
              </n-icon>
              <span>首页</span>
            </router-link>
            
            <router-link to="/upload" class="link-item">
              <n-icon size="16">
                <DocumentIcon />
              </n-icon>
              <span>降本增效</span>
            </router-link>
            
            <router-link to="/upload?module=growth" class="link-item">
              <n-icon size="16">
                <TrendingUpIcon />
              </n-icon>
              <span>韧性增长</span>
            </router-link>
            
            <router-link to="/login" class="link-item">
              <n-icon size="16">
                <PersonIcon />
              </n-icon>
              <span>登录/注册</span>
            </router-link>
            
            <router-link to="/profile" class="link-item">
              <n-icon size="16">
                <SettingsIcon />
              </n-icon>
              <span>个人中心</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NInput } from 'naive-ui'
import {
  Home as HomeIcon,
  CloudUpload as CloudUploadIcon,
  HelpCircle as HelpIcon,
  Search as SearchIcon,
  Document as DocumentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Compass as CompassIcon
} from '@vicons/ionicons5'
import CommonHeader from '@/components/layout/CommonHeader.vue'

const router = useRouter()
const searchQuery = ref('')

const contactSupport = () => {
  alert('请联系客服邮箱：support@smart-advisor.com')
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // 这里可以集成搜索功能
  alert(`搜索功能即将上线，您搜索的关键词是：${searchQuery.value}`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.not-found {
  min-height: 100vh;
  background: $bg-light;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }

  .error-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .error-icon {
    margin-bottom: 40px;

    .n-icon {
      animation: float 3s ease-in-out infinite;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .error-message {
    margin-bottom: 60px;

    h1 {
      font-size: 120px;
      font-weight: 700;
      color: $primary-color;
      margin: 0;
      line-height: 1;
    }

    h2 {
      font-size: 36px;
      font-weight: 600;
      color: $text-primary;
      margin: 20px 0 16px;
    }

    p {
      font-size: 18px;
      color: $text-secondary;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .suggestions {
    margin-bottom: 60px;

    h3 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 32px;
    }

    .suggestion-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;

      .suggestion-card {
        background: white;
        border: 1px solid $border-color;
        border-radius: 20px;
        padding: 32px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;

        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          border-color: $primary-color;
        }

        .n-icon {
          margin-bottom: 20px;
        }

        h4 {
          font-size: 20px;
          font-weight: 600;
          color: $text-primary;
          margin: 0 0 12px;
        }

        p {
          font-size: 14px;
          color: $text-secondary;
          margin: 0;
          line-height: 1.6;
        }
      }
    }
  }

  .search-section {
    margin-bottom: 60px;

    h3 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 24px;
    }

    .search-box {
      display: flex;
      gap: 16px;
      max-width: 600px;
      margin: 0 auto;

      .n-input {
        flex: 1;
      }
    }
  }

  .quick-links {
    h3 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 24px;
    }

    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      max-width: 600px;
      margin: 0 auto;

      .link-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: white;
        border: 1px solid $border-color;
        border-radius: 12px;
        color: $text-primary;
        text-decoration: none;
        transition: all 0.2s;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
          transform: translateY(-2px);
        }

        .n-icon {
          flex-shrink: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    .container {
      padding: 100px 16px 60px;
    }

    .error-message {
      h1 {
        font-size: 80px;
      }

      h2 {
        font-size: 28px;
      }
    }

    .suggestions {
      .suggestion-cards {
        grid-template-columns: 1fr;
      }
    }

    .search-section {
      .search-box {
        flex-direction: column;
      }
    }

    .quick-links {
      .links-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>