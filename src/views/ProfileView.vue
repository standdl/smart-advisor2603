<template>
  <div class="profile">
    <!-- 导航栏 -->
    <CommonHeader />
    
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">个人中心</h1>
        <p class="page-subtitle">管理您的账户、诊断历史和订阅</p>
      </div>

      <div class="profile-wrapper">
        <!-- 左侧导航 -->
        <div class="sidebar">
          <div class="user-card">
            <div class="user-avatar">
              <n-avatar 
                round 
                size="large"
                :src="userInfo.avatar"
              >
                {{ userInfo.name.charAt(0) }}
              </n-avatar>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ userInfo.name }}</h3>
              <p class="user-email">{{ userInfo.email }}</p>
              <p class="user-company">{{ userInfo.company }}</p>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">{{ userStats.totalReports }}</span>
                <span class="stat-label">总报告数</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ userStats.thisMonth }}</span>
                <span class="stat-label">本月分析</span>
              </div>
            </div>
          </div>

          <nav class="side-nav">
            <router-link 
              to="/profile" 
              class="nav-item"
              :class="{ active: activeTab === 'dashboard' }"
              @click="activeTab = 'dashboard'"
            >
              <n-icon size="20">
                <DashboardIcon />
              </n-icon>
              仪表盘
            </router-link>
            <router-link 
              to="/profile/history" 
              class="nav-item"
              :class="{ active: activeTab === 'history' }"
              @click="activeTab = 'history'"
            >
              <n-icon size="20">
                <HistoryIcon />
              </n-icon>
              历史记录
            </router-link>
            <router-link 
              to="/profile/account" 
              class="nav-item"
              :class="{ active: activeTab === 'account' }"
              @click="activeTab = 'account'"
            >
              <n-icon size="20">
                <PersonIcon />
              </n-icon>
              账户设置
            </router-link>
            <router-link 
              to="/profile/subscription" 
              class="nav-item"
              :class="{ active: activeTab === 'subscription' }"
              @click="activeTab = 'subscription'"
            >
              <n-icon size="20">
                <CardIcon />
              </n-icon>
              订阅管理
            </router-link>
            <div class="nav-item logout" @click="handleLogout">
              <n-icon size="20">
                <LogoutIcon />
              </n-icon>
              退出登录
            </div>
          </nav>
        </div>

        <!-- 右侧内容区域 -->
        <div class="content">
          <!-- 仪表盘 -->
          <div v-if="activeTab === 'dashboard'" class="dashboard-tab">
            <!-- 欢迎卡片 -->
            <div class="welcome-card">
              <div class="welcome-content">
                <h2>欢迎回来，{{ userInfo.name }}！</h2>
                <p>您本月已分析 {{ userStats.thisMonth }} 份报告，继续保持</p>
              </div>
              <n-button type="primary" @click="$router.push('/upload')">
                上传新报告
              </n-button>
            </div>

            <!-- 快速操作 -->
            <div class="quick-actions">
              <h3>快速操作</h3>
              <div class="actions-grid">
                <div class="action-card" @click="$router.push('/upload')">
                  <n-icon size="32" color="#2A5CAA">
                    <CloudUploadIcon />
                  </n-icon>
                  <span>上传报告</span>
                </div>
                <div class="action-card" @click="$router.push('/profile/history')">
                  <n-icon size="32" color="#28A745">
                    <HistoryIcon />
                  </n-icon>
                  <span>查看历史</span>
                </div>
                <div class="action-card" @click="$router.push('/profile/subscription')">
                  <n-icon size="32" color="#FF6B35">
                    <CardIcon />
                  </n-icon>
                  <span>升级套餐</span>
                </div>
                <div class="action-card" @click="$router.push('/profile/account')">
                  <n-icon size="32" color="#6F42C1">
                    <SettingsIcon />
                  </n-icon>
                  <span>账户设置</span>
                </div>
              </div>
            </div>

            <!-- 最近报告 -->
            <div class="recent-reports">
              <h3>最近报告</h3>
              <div class="reports-list">
                <div v-for="report in recentReports" :key="report.id" class="report-card">
                  <div class="report-header">
                    <h4>{{ report.name }}</h4>
                    <span class="report-date">{{ report.date }}</span>
                  </div>
                  <div class="report-meta">
                    <span class="module-badge" :class="report.module">
                      {{ report.module === 'cost' ? '降本增效' : '韧性增长' }}
                    </span>
                    <span class="score" :class="getScoreClass(report.score)">
                      {{ report.score }}/100
                    </span>
                  </div>
                  <div class="report-actions">
                    <n-button text @click="viewReport(report.id)">
                      查看详情
                    </n-button>
                    <n-button text @click="reanalyzeReport(report.id)">
                      重新分析
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 历史记录 -->
          <div v-else-if="activeTab === 'history'" class="history-tab">
            <div class="tab-header">
              <h2>历史记录</h2>
              <div class="filter-controls">
                <n-select
                  v-model:value="historyFilter.module"
                  placeholder="全部模块"
                  :options="moduleOptions"
                  style="width: 120px;"
                />
                <n-select
                  v-model:value="historyFilter.timeRange"
                  placeholder="全部时间"
                  :options="timeRangeOptions"
                  style="width: 120px;"
                />
              </div>
            </div>

            <div class="history-table">
              <table>
                <thead>
                  <tr>
                    <th>报告名称</th>
                    <th>模块</th>
                    <th>分析时间</th>
                    <th>健康度</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredHistory" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>
                      <span class="module-tag" :class="item.module">
                        {{ item.module === 'cost' ? '降本增效' : '韧性增长' }}
                      </span>
                    </td>
                    <td>{{ item.analyzedAt }}</td>
                    <td>
                      <span class="score-display" :class="getScoreClass(item.score)">
                        {{ item.score }}/100
                      </span>
                    </td>
                    <td>
                      <n-space>
                        <n-button text @click="viewReport(item.id)">
                          查看
                        </n-button>
                        <n-button text @click="exportReport(item.id)">
                          导出
                        </n-button>
                        <n-button text @click="deleteReport(item.id)">
                          删除
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 账户设置 -->
          <div v-else-if="activeTab === 'account'" class="account-tab">
            <div class="tab-header">
              <h2>账户设置</h2>
            </div>

            <div class="account-sections">
              <!-- 基本信息 -->
              <section class="section">
                <h3>基本信息</h3>
                <n-form class="account-form">
                  <n-form-item label="姓名">
                    <n-input v-model:value="accountForm.name" />
                  </n-form-item>
                  <n-form-item label="邮箱">
                    <n-input v-model:value="accountForm.email" disabled />
                  </n-form-item>
                  <n-form-item label="企业名称">
                    <n-input v-model:value="accountForm.company" />
                  </n-form-item>
                  <n-form-item label="所属行业">
                    <n-select
                      v-model:value="accountForm.industry"
                      :options="industryOptions"
                    />
                  </n-form-item>
                  <n-button type="primary" @click="updateProfile">
                    保存更改
                  </n-button>
                </n-form>
              </section>

              <!-- 安全设置 -->
              <section class="section">
                <h3>安全设置</h3>
                <div class="security-actions">
                  <div class="action-item">
                    <div class="action-info">
                      <h4>修改密码</h4>
                      <p>定期更新密码保护账户安全</p>
                    </div>
                    <n-button @click="showChangePassword">
                      修改
                    </n-button>
                  </div>
                  <div class="action-item">
                    <div class="action-info">
                      <h4>绑定手机</h4>
                      <p>{{ accountForm.phone || '未绑定手机号' }}</p>
                    </div>
                    <n-button @click="bindPhone">
                      {{ accountForm.phone ? '更换' : '绑定' }}
                    </n-button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- 订阅管理 -->
          <div v-else-if="activeTab === 'subscription'" class="subscription-tab">
            <div class="tab-header">
              <h2>订阅管理</h2>
              <div class="subscription-status">
                <span class="status-label">当前套餐：</span>
                <span class="status-value">{{ currentPlan.name }}</span>
              </div>
            </div>

            <div class="plans-section">
              <h3>套餐选择</h3>
              <div class="plans-grid">
                <div 
                  v-for="plan in subscriptionPlans" 
                  :key="plan.id"
                  class="plan-card"
                  :class="{ recommended: plan.recommended, current: plan.id === currentPlan.id }"
                >
                  <div class="plan-header">
                    <h4>{{ plan.name }}</h4>
                    <div v-if="plan.recommended" class="recommended-badge">
                      推荐
                    </div>
                  </div>
                  
                  <div class="plan-price">
                    <span class="price-amount">¥{{ plan.price }}</span>
                    <span class="price-period">/{{ plan.period }}</span>
                  </div>

                  <ul class="plan-features">
                    <li v-for="feature in plan.features" :key="feature">
                      <n-icon size="16" color="#28A745">
                        <CheckIcon />
                      </n-icon>
                      {{ feature }}
                    </li>
                  </ul>

                  <n-button 
                    :type="plan.recommended ? 'primary' : 'default'"
                    :secondary="plan.id === currentPlan.id"
                    block
                    @click="selectPlan(plan.id)"
                  >
                    {{ plan.id === currentPlan.id ? '当前套餐' : '选择此套餐' }}
                  </n-button>
                </div>
              </div>
            </div>

            <div class="billing-history">
              <h3>账单历史</h3>
              <div class="billing-table">
                <table>
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>套餐</th>
                      <th>金额</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="bill in billingHistory" :key="bill.id">
                      <td>{{ bill.date }}</td>
                      <td>{{ bill.plan }}</td>
                      <td>¥{{ bill.amount }}</td>
                      <td>
                        <span class="status-badge" :class="bill.status">
                          {{ bill.status === 'paid' ? '已支付' : '待支付' }}
                        </span>
                      </td>
                      <td>
                        <n-button text @click="downloadInvoice(bill.id)">
                          下载发票
                        </n-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton,
  NIcon,
  NAvatar,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSpace
} from 'naive-ui'
import {
   Grid as DashboardIcon,
  Time as HistoryIcon,
  Person as PersonIcon,
  CardOutline as CardIcon,
  LogOut as LogoutIcon,
  CloudUpload as CloudUploadIcon,
  Settings as SettingsIcon,
  Checkmark as CheckIcon
} from '@vicons/ionicons5'
import CommonHeader from '@/components/layout/CommonHeader.vue'

const router = useRouter()
const activeTab = ref('dashboard')

// 用户信息
const userInfo = reactive({
  name: '张经理',
  email: 'zhang@example.com',
  company: 'XX科技有限公司',
  avatar: '',
  phone: '13800138000',
  industry: 'manufacturing'
})

// 用户统计
const userStats = reactive({
  totalReports: 12,
  thisMonth: 3
})

// 最近报告
const recentReports = ref([
  {
    id: 1,
    name: '2025年Q4财务报告',
    date: '2026-03-20',
    module: 'cost',
    score: 76.5
  },
  {
    id: 2,
    name: '2025年12月经营报告',
    date: '2026-03-18',
    module: 'growth',
    score: 82.3
  }
])

// 历史记录过滤
const historyFilter = reactive({
  module: null,
  timeRange: null
})

const historyData = ref([
  { id: 1, name: '2025年Q4财务报告', module: 'cost', analyzedAt: '2026-03-20 14:30', score: 76.5 },
  { id: 2, name: '2025年12月经营报告', module: 'growth', analyzedAt: '2026-03-18 09:15', score: 82.3 },
  { id: 3, name: '2025年Q3财务报告', module: 'cost', analyzedAt: '2025-12-15 11:20', score: 71.8 },
  { id: 4, name: '2025年9月经营报告', module: 'growth', analyzedAt: '2025-11-30 16:45', score: 79.2 }
])

// 账户表单
const accountForm = reactive({ ...userInfo })

// 订阅计划
const currentPlan = reactive({
  id: 'free',
  name: '免费版',
  price: 0,
  period: '月'
})

const subscriptionPlans = ref([
  {
    id: 'free',
    name: '免费版',
    price: 0,
    period: '月',
    features: [
      '每月3次基础诊断',
      '基础报告生成',
      '3个深度分析入口'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: '专业版',
    price: 499,
    period: '月',
    features: [
      '无限次诊断',
      '完整报告导出',
      '行业对比分析',
      '优先技术支持'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 1999,
    period: '月',
    features: [
      '专业版所有功能',
      '定制化分析模板',
      'API接口调用',
      '专属客户经理'
    ],
    recommended: false
  }
])

// 账单历史
const billingHistory = ref([
  { id: 1, date: '2026-03-01', plan: '专业版', amount: 499, status: 'paid' },
  { id: 2, date: '2026-02-01', plan: '专业版', amount: 499, status: 'paid' },
  { id: 3, date: '2026-01-01', plan: '免费版', amount: 0, status: 'paid' }
])

// 计算属性
const filteredHistory = computed(() => {
  let filtered = [...historyData.value]
  
  if (historyFilter.module) {
    filtered = filtered.filter(item => item.module === historyFilter.module)
  }
  
  if (historyFilter.timeRange) {
    const now = new Date()
    const days = parseInt(historyFilter.timeRange)
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.analyzedAt)
      return itemDate >= cutoff
    })
  }
  
  return filtered
})

const moduleOptions = [
  { label: '全部模块', value: null },
  { label: '降本增效', value: 'cost' },
  { label: '韧性增长', value: 'growth' }
]

const timeRangeOptions = [
  { label: '全部时间', value: null },
  { label: '最近7天', value: '7' },
  { label: '最近30天', value: '30' },
  { label: '最近90天', value: '90' }
]

const industryOptions = [
  { label: '制造业', value: 'manufacturing' },
  { label: '零售业', value: 'retail' },
  { label: '互联网/IT', value: 'internet' },
  { label: '金融业', value: 'finance' },
  { label: '建筑业', value: 'construction' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '教育', value: 'education' },
  { label: '其他', value: 'other' }
]

// 方法
const getScoreClass = (score) => {
  if (score >= 80) return 'good'
  if (score >= 60) return 'medium'
  return 'poor'
}

const viewReport = (reportId) => {
  router.push(`/results/${reportId}`)
}

const reanalyzeReport = (reportId) => {
  console.log('重新分析报告:', reportId)
  // 重新分析逻辑
}

const exportReport = (reportId) => {
  console.log('导出报告:', reportId)
  alert('导出功能即将上线')
}

const deleteReport = (reportId) => {
  if (confirm('确定要删除这份报告吗？')) {
    console.log('删除报告:', reportId)
    // 删除逻辑
  }
}

const updateProfile = () => {
  console.log('更新个人信息:', accountForm)
  Object.assign(userInfo, accountForm)
  alert('个人信息已更新')
}

const showChangePassword = () => {
  alert('修改密码功能即将上线')
}

const bindPhone = () => {
  alert('绑定手机功能即将上线')
}

const selectPlan = (planId) => {
  if (planId === currentPlan.id) return
  
  const plan = subscriptionPlans.value.find(p => p.id === planId)
  if (plan) {
    Object.assign(currentPlan, plan)
    alert(`已切换到${plan.name}套餐`)
  }
}

const handleLogout = () => {
  localStorage.removeItem('user_token')
  localStorage.removeItem('user_email')
  localStorage.removeItem('user_company')
  
  router.push('/login')
}

const downloadInvoice = (billId) => {
  console.log('下载发票:', billId)
  alert('发票下载功能即将上线')
}

onMounted(() => {
  // 从localStorage加载用户信息
  const savedEmail = localStorage.getItem('user_email')
  const savedCompany = localStorage.getItem('user_company')
  
  if (savedEmail) userInfo.email = savedEmail
  if (savedCompany) {
    userInfo.company = savedCompany
    accountForm.company = savedCompany
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.profile {
  min-height: 100vh;
  background: $bg-light;

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }

  .page-header {
    margin-bottom: 40px;

    .page-title {
      font-size: 40px;
      font-weight: 700;
      color: $text-primary;
      margin-bottom: 12px;
    }

    .page-subtitle {
      font-size: 18px;
      color: $text-secondary;
    }
  }

  .profile-wrapper {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 32px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  // 侧边栏样式
  .sidebar {
    .user-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);

      .user-avatar {
        text-align: center;
        margin-bottom: 16px;
      }

      .user-info {
        text-align: center;
        margin-bottom: 20px;

        .user-name {
          font-size: 20px;
          font-weight: 600;
          color: $text-primary;
          margin: 0 0 8px;
        }

        .user-email,
        .user-company {
          font-size: 14px;
          color: $text-secondary;
          margin: 4px 0;
          line-height: 1.4;
        }
      }

      .user-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        padding-top: 16px;
        border-top: 1px solid $border-color;

        .stat-item {
          text-align: center;

          .stat-value {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: $primary-color;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: $text-secondary;
          }
        }
      }
    }

    .side-nav {
      background: white;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        color: $text-primary;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s;
        margin-bottom: 8px;
        cursor: pointer;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: $bg-light;
          color: $primary-color;
        }

        &.active {
          background: rgba(42,92,170,0.1);
          color: $primary-color;
          font-weight: 500;
        }

        &.logout {
          color: #DC3545;

          &:hover {
            background: rgba(220,53,69,0.1);
          }
        }
      }
    }
  }

  // 内容区域样式
  .content {
    .welcome-card {
      background: linear-gradient(135deg, #2A5CAA 0%, #4A8CE0 100%);
      border-radius: 20px;
      padding: 32px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .welcome-content {
        h2 {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 12px;
        }

        p {
          opacity: 0.9;
          margin: 0;
          font-size: 16px;
        }
      }
    }

    .quick-actions {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 32px;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 24px;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;

        .action-card {
          background: $bg-light;
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: $primary-color;
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          }

          .n-icon {
            margin-bottom: 12px;
          }

          span {
            display: block;
            font-size: 16px;
            font-weight: 500;
            color: $text-primary;
          }
        }
      }
    }

    .recent-reports {
      background: white;
      border-radius: 20px;
      padding: 24px;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 24px;
      }

      .reports-list {
        display: grid;
        gap: 16px;

        .report-card {
          border: 1px solid $border-color;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;

          &:hover {
            border-color: $primary-color;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;

            h4 {
              font-size: 18px;
              font-weight: 600;
              color: $text-primary;
              margin: 0;
            }

            .report-date {
              font-size: 14px;
              color: $text-secondary;
              background: $bg-light;
              padding: 4px 12px;
              border-radius: 12px;
            }
          }

          .report-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;

            .module-badge {
              font-size: 12px;
              font-weight: 500;
              padding: 4px 12px;
              border-radius: 12px;

              &.cost {
                background: rgba(42,92,170,0.1);
                color: $primary-color;
              }

              &.growth {
                background: rgba(40,167,69,0.1);
                color: #28A745;
              }
            }

            .score {
              font-size: 16px;
              font-weight: 600;

              &.good {
                color: #28A745;
              }

              &.medium {
                color: #FFC107;
              }

              &.poor {
                color: #DC3545;
              }
            }
          }
        }
      }
    }

    // 历史记录标签页
    .history-tab {
      background: white;
      border-radius: 20px;
      padding: 24px;

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: $text-primary;
          margin: 0;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }
      }

      .history-table {
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;

          thead {
            background: $bg-light;

            th {
              padding: 16px;
              text-align: left;
              font-weight: 600;
              color: $text-primary;
              border-bottom: 2px solid $border-color;
              white-space: nowrap;
            }
          }

          tbody {
            tr {
              border-bottom: 1px solid $border-color;

              &:last-child {
                border-bottom: none;
              }

              td {
                padding: 16px;
                color: $text-secondary;

                .module-tag {
                  font-size: 12px;
                  font-weight: 500;
                  padding: 4px 12px;
                  border-radius: 12px;

                  &.cost {
                    background: rgba(42,92,170,0.1);
                    color: $primary-color;
                  }

                  &.growth {
                    background: rgba(40,167,69,0.1);
                    color: #28A745;
                  }
                }

                .score-display {
                  font-weight: 600;

                  &.good {
                    color: #28A745;
                  }

                  &.medium {
                    color: #FFC107;
                  }

                  &.poor {
                    color: #DC3545;
                  }
                }
              }
            }
          }
        }
      }
    }

    // 账户设置标签页
    .account-tab {
      background: white;
      border-radius: 20px;
      padding: 24px;

      .tab-header {
        margin-bottom: 32px;

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: $text-primary;
          margin: 0;
        }
      }

      .account-sections {
        .section {
          margin-bottom: 40px;

          h3 {
            font-size: 20px;
            font-weight: 600;
            color: $text-primary;
            margin: 0 0 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid $border-color;
          }

          .account-form {
            max-width: 500px;
          }

          .security-actions {
            .action-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px;
              border: 1px solid $border-color;
              border-radius: 16px;
              margin-bottom: 16px;

              .action-info {
                h4 {
                  font-size: 16px;
                  font-weight: 600;
                  color: $text-primary;
                  margin: 0 0 8px;
                }

                p {
                  font-size: 14px;
                  color: $text-secondary;
                  margin: 0;
                }
              }
            }
          }
        }
      }
    }

    // 订阅管理标签页
    .subscription-tab {
      background: white;
      border-radius: 20px;
      padding: 24px;

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: $text-primary;
          margin: 0;
        }

        .subscription-status {
          .status-label {
            color: $text-secondary;
          }

          .status-value {
            font-weight: 600;
            color: $primary-color;
          }
        }
      }

      .plans-section {
        margin-bottom: 40px;

        h3 {
          font-size: 20px;
          font-weight: 600;
          color: $text-primary;
          margin: 0 0 24px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;

          .plan-card {
            border: 2px solid $border-color;
            border-radius: 20px;
            padding: 32px;
            transition: all 0.3s;

            &.recommended {
              border-color: $primary-color;
              transform: translateY(-8px);
              box-shadow: 0 16px 40px rgba(42,92,170,0.15);
            }

            &.current {
              border-color: #28A745;
            }

            .plan-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 24px;

              h4 {
                font-size: 24px;
                font-weight: 600;
                color: $text-primary;
                margin: 0;
              }

              .recommended-badge {
                background: $primary-color;
                color: white;
                font-size: 12px;
                font-weight: 500;
                padding: 4px 12px;
                border-radius: 12px;
              }
            }

            .plan-price {
              margin-bottom: 24px;

              .price-amount {
                font-size: 48px;
                font-weight: 700;
                color: $text-primary;
              }

              .price-period {
                font-size: 16px;
                color: $text-secondary;
              }
            }

            .plan-features {
              list-style: none;
              padding: 0;
              margin: 0 0 32px;

              li {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
                color: $text-primary;

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }

      .billing-history {
        h3 {
          font-size: 20px;
          font-weight: 600;
          color: $text-primary;
          margin: 0 0 24px;
        }

        .billing-table {
          overflow-x: auto;

          table {
            width: 100%;
            border-collapse: collapse;

            thead {
              background: $bg-light;

              th {
                padding: 16px;
                text-align: left;
                font-weight: 600;
                color: $text-primary;
                border-bottom: 2px solid $border-color;
                white-space: nowrap;
              }
            }

            tbody {
              tr {
                border-bottom: 1px solid $border-color;

                &:last-child {
                  border-bottom: none;
                }

                td {
                  padding: 16px;
                  color: $text-secondary;

                  .status-badge {
                    font-size: 12px;
                    font-weight: 500;
                    padding: 4px 12px;
                    border-radius: 12px;

                    &.paid {
                      background: rgba(40,167,69,0.1);
                      color: #28A745;
                    }

                    &.pending {
                      background: rgba(255,193,7,0.1);
                      color: #FFC107;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .profile {
    .profile-wrapper {
      gap: 24px;
    }

    .content {
      .plans-section {
        .plans-grid {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .profile {
    .profile-wrapper {
      grid-template-columns: 1fr;
    }

    .sidebar {
      order: 2;
    }

    .content {
      order: 1;
      margin-bottom: 32px;
    }
  }
}

@media (max-width: 768px) {
  .profile {
    .container {
      padding: 100px 16px 60px;
    }

    .page-header {
      .page-title {
        font-size: 32px;
      }
    }

    .content {
      .plans-section {
        .plans-grid {
          grid-template-columns: 1fr;
        }
      }

      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
    }
  }
}
</style>