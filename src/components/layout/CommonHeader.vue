<template>
  <header class="common-header">
    <div class="container">
      <!-- Logo区域 -->
      <div class="logo-area">
        <router-link to="/" class="logo-link">
          <h1 class="logo-text">智能参谋</h1>
          <span class="logo-tagline">企业AI诊断助手</span>
        </router-link>
      </div>

      <!-- 桌面端导航 -->
      <nav class="desktop-nav">
        <router-link 
          to="/" 
          class="nav-item"
          :class="{ active: $route.path === '/' }"
        >
          首页
        </router-link>
        <router-link 
          to="/upload" 
          class="nav-item"
          :class="{ active: $route.path === '/upload' && !$route.query.module }"
        >
          降本增效
        </router-link>
        <router-link 
          to="/upload?module=growth" 
          class="nav-item"
          :class="{ active: $route.query.module === 'growth' }"
        >
          韧性增长
        </router-link>
        <router-link 
          to="/profile" 
          class="nav-item"
          :class="{ active: $route.path === '/profile' }"
          v-if="isAuthenticated"
        >
          我的诊断
        </router-link>
        <router-link 
          to="/login" 
          class="nav-item"
          :class="{ active: $route.path === '/login' }"
          v-else
        >
          登录/注册
        </router-link>
      </nav>

      <!-- 移动端菜单按钮 -->
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <n-icon size="24">
          <MenuIcon v-if="!mobileMenuOpen" />
          <CloseIcon v-else />
        </n-icon>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-backdrop" @click="closeMobileMenu"></div>
        <div class="mobile-menu-content">
          <div class="mobile-menu-header">
            <h3>导航菜单</h3>
            <n-icon size="24" @click="closeMobileMenu">
              <CloseIcon />
            </n-icon>
          </div>
          <div class="mobile-menu-items">
            <router-link 
              to="/" 
              class="mobile-menu-item"
              :class="{ active: $route.path === '/' }"
              @click="closeMobileMenu"
            >
              首页
            </router-link>
            <router-link 
              to="/upload" 
              class="mobile-menu-item"
              :class="{ active: $route.path === '/upload' && !$route.query.module }"
              @click="closeMobileMenu"
            >
              降本增效
            </router-link>
            <router-link 
              to="/upload?module=growth" 
              class="mobile-menu-item"
              :class="{ active: $route.query.module === 'growth' }"
              @click="closeMobileMenu"
            >
              韧性增长
            </router-link>
            <router-link 
              to="/profile" 
              class="mobile-menu-item"
              :class="{ active: $route.path === '/profile' }"
              @click="closeMobileMenu"
              v-if="isAuthenticated"
            >
              我的诊断
            </router-link>
            <router-link 
              to="/login" 
              class="mobile-menu-item"
              :class="{ active: $route.path === '/login' }"
              @click="closeMobileMenu"
              v-else
            >
              登录/注册
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NIcon } from 'naive-ui'
import { Menu, Close } from '@vicons/ionicons5'

const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('user_token')
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 图标组件
const MenuIcon = Menu
const CloseIcon = Close
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.common-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-area {
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;

      .logo-text {
        font-size: 24px;
        font-weight: 700;
        color: $primary-color;
        margin: 0;
      }

      .logo-tagline {
        font-size: 14px;
        color: $text-secondary;
        background: $bg-light;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }
  }

  .desktop-nav {
    display: flex;
    gap: 32px;

    .nav-item {
      color: $text-primary;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 0;
      position: relative;
      transition: color 0.2s;

      &:hover, &.active {
        color: $primary-color;
      }

      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: $primary-color;
        border-radius: 1px;
      }
    }
  }

  .mobile-menu-btn {
    display: none;
    cursor: pointer;
    padding: 8px;
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;

    &-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
    }

    &-content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      background: white;
      animation: slideIn 0.3s ease;
      overflow-y: auto;
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid $border-color;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
      }

      .n-icon {
        cursor: pointer;
        color: $text-secondary;
      }
    }

    &-items {
      padding: 20px 0;
    }

    &-item {
      display: block;
      padding: 16px 20px;
      color: $text-primary;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: background 0.2s;

      &:hover, &.active {
        background: $bg-light;
        color: $primary-color;
      }

      &.active {
        border-right: 3px solid $primary-color;
      }
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .common-header {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }
  }
}
</style>