<template>
  <div class="login">
    <!-- 导航栏 -->
    <CommonHeader />
    
    <div class="container">
      <div class="login-wrapper">
        <!-- 左侧欢迎区域 -->
        <div class="welcome-section">
          <div class="welcome-content">
            <h1 class="welcome-title">欢迎回来</h1>
            <p class="welcome-subtitle">
              登录智能参谋，开启您的企业AI诊断之旅
            </p>
            <div class="welcome-features">
              <div class="feature-item">
                <n-icon size="20" color="#2A5CAA">
                  <CheckCircleIcon />
                </n-icon>
                <span>专业财务分析，识别成本优化空间</span>
              </div>
              <div class="feature-item">
                <n-icon size="20" color="#2A5CAA">
                  <CheckCircleIcon />
                </n-icon>
                <span>行业对标，制定韧性增长策略</span>
              </div>
              <div class="feature-item">
                <n-icon size="20" color="#2A5CAA">
                  <CheckCircleIcon />
                </n-icon>
                <span>7x24小时AI助手，随时获取专业建议</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧登录表单 -->
        <div class="form-section">
          <div class="form-container">
            <!-- 切换标签 -->
            <div class="form-tabs">
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'login' }"
                @click="activeTab = 'login'"
              >
                登录
              </div>
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'register' }"
                @click="activeTab = 'register'"
              >
                注册
              </div>
            </div>

            <!-- 登录表单 -->
            <div v-if="activeTab === 'login'" class="tab-content">
              <h2 class="form-title">登录账号</h2>
              
              <n-form 
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                @submit.prevent="handleLogin"
              >
                <n-form-item path="email" label="邮箱">
                  <n-input
                    v-model:value="loginForm.email"
                    placeholder="请输入邮箱"
                    size="large"
                  />
                </n-form-item>

                <n-form-item path="password" label="密码">
                  <n-input
                    v-model:value="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                    show-password-on="click"
                  />
                </n-form-item>

                <div class="form-options">
                  <n-checkbox v-model:checked="rememberMe">
                    记住我
                  </n-checkbox>
                  <router-link to="/forgot-password" class="forgot-link">
                    忘记密码？
                  </router-link>
                </div>

                <n-button 
                  type="primary" 
                  size="large" 
                  :loading="isLoggingIn"
                  @click="handleLogin"
                  block
                >
                  登录
                </n-button>
              </n-form>

              <!-- 第三方登录 -->
              <div class="social-login">
                <div class="divider">
                  <span>或使用第三方登录</span>
                </div>

                <div class="social-buttons">
                  <n-button 
                    secondary 
                    size="large" 
                    @click="loginWithFeishu"
                    block
                  >
                    <template #icon>
                      <n-icon>
                        <FeishuIcon />
                      </n-icon>
                    </template>
                    飞书登录
                  </n-button>

                  <n-button 
                    secondary 
                    size="large" 
                    @click="loginWithDingtalk"
                    block
                  >
                    <template #icon>
                      <n-icon>
                        <DingtalkIcon />
                      </n-icon>
                    </template>
                    钉钉登录
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 注册表单 -->
            <div v-if="activeTab === 'register'" class="tab-content">
              <h2 class="form-title">注册账号</h2>
              
              <n-form 
                ref="registerFormRef"
                :model="registerForm"
                :rules="registerRules"
                @submit.prevent="handleRegister"
              >
                <n-form-item path="companyName" label="企业名称">
                  <n-input
                    v-model:value="registerForm.companyName"
                    placeholder="请输入企业全称"
                    size="large"
                  />
                </n-form-item>

                <n-form-item path="email" label="邮箱">
                  <n-input
                    v-model:value="registerForm.email"
                    placeholder="请输入工作邮箱"
                    size="large"
                  />
                </n-form-item>

                <n-form-item path="password" label="密码">
                  <n-input
                    v-model:value="registerForm.password"
                    type="password"
                    placeholder="至少8位字符，包含字母和数字"
                    size="large"
                    show-password-on="click"
                  />
                </n-form-item>

                <n-form-item path="confirmPassword" label="确认密码">
                  <n-input
                    v-model:value="registerForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    size="large"
                    show-password-on="click"
                  />
                </n-form-item>

                <n-form-item path="phone" label="手机号">
                  <n-input
                    v-model:value="registerForm.phone"
                    placeholder="请输入手机号"
                    size="large"
                  />
                </n-form-item>

                <n-form-item path="industry" label="所属行业">
                  <n-select
                    v-model:value="registerForm.industry"
                    placeholder="请选择行业"
                    size="large"
                    :options="industryOptions"
                  />
                </n-form-item>

                <div class="terms-agreement">
                  <n-checkbox v-model:checked="agreeTerms">
                    我已阅读并同意
                  </n-checkbox>
                  <a href="#" class="terms-link">《用户协议》</a>
                  <span>和</span>
                  <a href="#" class="terms-link">《隐私政策》</a>
                </div>

                <n-button 
                  type="primary" 
                  size="large" 
                  :loading="isRegistering"
                  @click="handleRegister"
                  block
                >
                  注册
                </n-button>
              </n-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NIcon, 
  NCheckbox, 
  NSelect 
} from 'naive-ui'
import { 
  CheckmarkCircleOutline,
  LogoWechat,
  LogoAlipay 
} from '@vicons/ionicons5'
import CommonHeader from '@/components/layout/CommonHeader.vue'

const router = useRouter()
const activeTab = ref('login')
const rememberMe = ref(false)
const agreeTerms = ref(false)
const isLoggingIn = ref(false)
const isRegistering = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  industry: ''
})

// 验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const registerRules = {
  companyName: [
    { required: true, message: '请输入企业名称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value) => value === registerForm.password,
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  industry: [
    { required: true, message: '请选择行业', trigger: 'change' }
  ]
}

// 行业选项
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

// 图标组件
const CheckCircleIcon = CheckmarkCircleOutline
const FeishuIcon = LogoWechat  // 暂时使用微信图标
const DingtalkIcon = LogoAlipay  // 暂时使用支付宝图标

const handleLogin = async () => {
  isLoggingIn.value = true

  try {
    // 模拟登录过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 存储用户token
    localStorage.setItem('user_token', 'demo_token')
    localStorage.setItem('user_email', loginForm.email)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查邮箱和密码')
  } finally {
    isLoggingIn.value = false
  }
}

const handleRegister = async () => {
  if (!agreeTerms.value) {
    alert('请阅读并同意用户协议和隐私政策')
    return
  }

  isRegistering.value = true

  try {
    // 模拟注册过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 存储用户token
    localStorage.setItem('user_token', 'demo_token')
    localStorage.setItem('user_email', registerForm.email)
    localStorage.setItem('user_company', registerForm.companyName)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请稍后重试')
  } finally {
    isRegistering.value = false
  }
}

const loginWithFeishu = () => {
  alert('飞书登录功能即将上线')
}

const loginWithDingtalk = () => {
  alert('钉钉登录功能即将上线')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.login {
  min-height: 100vh;
  background: $bg-light;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }

  .login-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    background: white;
    border-radius: 32px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  }

  .welcome-section {
    background: linear-gradient(135deg, #2A5CAA 0%, #4A8CE0 100%);
    color: white;
    padding: 80px 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .welcome-content {
      max-width: 400px;

      .welcome-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 20px;
        line-height: 1.2;
      }

      .welcome-subtitle {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 40px;
        line-height: 1.6;
      }

      .welcome-features {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;

          .n-icon {
            flex-shrink: 0;
          }

          span {
            font-size: 16px;
            line-height: 1.4;
          }
        }
      }
    }
  }

  .form-section {
    padding: 60px 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .form-container {
      width: 100%;
      max-width: 400px;

      .form-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 40px;

        .tab-item {
          flex: 1;
          text-align: center;
          padding: 12px;
          font-size: 18px;
          font-weight: 500;
          color: $text-secondary;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s;

          &:hover {
            background: $bg-light;
          }

          &.active {
            color: $primary-color;
            background: rgba(42,92,170,0.1);
            font-weight: 600;
          }
        }
      }

      .tab-content {
        .form-title {
          font-size: 28px;
          font-weight: 600;
          color: $text-primary;
          margin-bottom: 32px;
        }

        .n-form {
          .n-form-item {
            margin-bottom: 24px;
          }
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;

          .forgot-link {
            color: $primary-color;
            text-decoration: none;
            font-size: 14px;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .social-login {
          margin-top: 40px;

          .divider {
            text-align: center;
            position: relative;
            margin-bottom: 24px;

            span {
              background: white;
              padding: 0 16px;
              color: $text-secondary;
              font-size: 14px;
              position: relative;
              z-index: 1;
            }

            &::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 0;
              right: 0;
              height: 1px;
              background: $border-color;
              z-index: 0;
            }
          }

          .social-buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .n-button {
              &:first-child {
                color: #07C160; // 飞书绿
                border-color: #07C160;

                &:hover {
                  background: rgba(7,193,96,0.1);
                }
              }

              &:last-child {
                color: #2A5CAA; // 钉钉蓝
                border-color: #2A5CAA;

                &:hover {
                  background: rgba(42,92,170,0.1);
                }
              }
            }
          }
        }
      }

      .terms-agreement {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 24px;
        font-size: 14px;
        color: $text-secondary;

        .terms-link {
          color: $primary-color;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .login {
    .login-wrapper {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .welcome-section {
      padding: 60px 20px;
      
      .welcome-content {
        text-align: center;
        
        .welcome-title {
          font-size: 36px;
        }
      }
    }

    .form-section {
      padding: 40px 20px;
    }
  }
}

@media (max-width: 576px) {
  .login {
    .container {
      padding: 100px 16px 60px;
    }

    .login-wrapper {
      border-radius: 24px;
    }

    .welcome-section {
      padding: 40px 20px;
      
      .welcome-content {
        .welcome-title {
          font-size: 28px;
        }
        
        .welcome-subtitle {
          font-size: 16px;
        }
      }
    }

    .form-section {
      padding: 32px 20px;
    }
  }
}
</style>