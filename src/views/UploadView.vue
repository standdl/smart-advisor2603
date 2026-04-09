<template>
  <div class="upload">
    <!-- 导航栏组件 -->
    <CommonHeader />
    
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">选择诊断模块</h1>
        <p class="page-subtitle">上传您的报告，获取专业AI诊断建议</p>
      </div>

      <!-- 模块选择 -->
      <div class="module-selection">
        <div class="module-card" :class="{ active: selectedModule === 'cost' }" @click="selectModule('cost')">
          <div class="module-icon">
            <n-icon size="64" color="#2A5CAA">
              <MoneyIcon />
            </n-icon>
          </div>
          <h3 class="module-title">降本增效模块</h3>
          <p class="module-description">
            分析财务报告，识别成本优化空间，提供具体行动建议
          </p>
          <div class="module-details">
            <div class="detail-item">
              <n-icon size="16">
                <FileIcon />
              </n-icon>
              <span>支持格式：Excel/PDF</span>
            </div>
            <div class="detail-item">
              <n-icon size="16">
                <UsersIcon />
              </n-icon>
              <span>典型用户：制造业、零售业</span>
            </div>
          </div>
          <n-button type="primary" size="large" :disabled="selectedModule !== 'cost'">
            {{ selectedModule === 'cost' ? '已选择' : '选择此模块' }}
          </n-button>
        </div>

        <div class="module-card" :class="{ active: selectedModule === 'growth' }" @click="selectModule('growth')">
          <div class="module-icon">
            <n-icon size="64" color="#28A745">
              <TrendingIcon />
            </n-icon>
          </div>
          <h3 class="module-title">韧性增长模块</h3>
          <p class="module-description">
            分析经营报告，对标行业标杆，制定可持续增长策略
          </p>
          <div class="module-details">
            <div class="detail-item">
              <n-icon size="16">
                <FileIcon />
              </n-icon>
              <span>支持格式：Excel/PDF</span>
            </div>
            <div class="detail-item">
              <n-icon size="16">
                <UsersIcon />
              </n-icon>
              <span>典型用户：所有增长期企业</span>
            </div>
          </div>
          <n-button type="primary" size="large" :disabled="selectedModule !== 'growth'">
            {{ selectedModule === 'growth' ? '已选择' : '选择此模块' }}
          </n-button>
        </div>
      </div>

      <!-- 文件上传区域 -->
      <div v-if="selectedModule" class="upload-section">
        <div class="upload-area" @dragover.prevent @drop="handleDrop">
          <div class="upload-content">
            <n-icon size="64" color="#666">
              <CloudUploadIcon />
            </n-icon>
            <h3 class="upload-title">拖拽文件到此处，或点击上传</h3>
            <p class="upload-subtitle">
              支持格式：.xlsx, .xls, .xlsm, .pdf<br>
              最大文件大小：50MB
            </p>
            <n-button type="primary" size="large" @click="triggerFileInput">
              选择文件
            </n-button>
            <p class="upload-hint">
              没有报告模板？<a href="#" @click.prevent="downloadTemplate">下载标准模板</a>
            </p>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls,.xlsm,.pdf"
            @change="handleFileSelect"
            hidden
          />
        </div>

        <!-- 文件列表 -->
        <div v-if="selectedFile" class="file-list">
          <div class="file-item">
            <div class="file-info">
              <n-icon size="24" color="#2A5CAA">
                <DocumentIcon />
              </n-icon>
              <div class="file-details">
                <h4 class="file-name">{{ selectedFile.name }}</h4>
                <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <div class="file-actions">
              <n-button secondary @click="removeFile">
                移除
              </n-button>
            </div>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="isUploading" class="upload-progress">
          <n-progress
            type="line"
            :percentage="uploadProgress"
            :indicator-placement="'inside'"
            :processing="isUploading"
            :height="8"
          />
          <p class="progress-text">
            {{ progressText }}
          </p>
        </div>

        <!-- 上传按钮 -->
        <div class="upload-actions">
          <n-button 
            type="primary" 
            size="large" 
            :loading="isUploading"
            :disabled="!selectedFile || isUploading"
            @click="startUpload"
          >
            {{ isUploading ? '上传中...' : '开始诊断' }}
          </n-button>
        </div>

        <!-- 历史记录 -->
        <div class="history-section">
          <n-collapse>
            <n-collapse-item title="历史报告">
              <div class="history-list">
                <div v-for="item in historyItems" :key="item.id" class="history-item">
                  <div class="history-info">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.date }} - {{ item.module === 'cost' ? '降本增效' : '韧性增长' }}</p>
                  </div>
                  <div class="history-actions">
                    <n-button text @click="reanalyze(item)">
                      重新分析
                    </n-button>
                  </div>
                </div>
                <div v-if="historyItems.length === 0" class="empty-history">
                  <p>暂无历史记录，上传您的第一份报告开始分析</p>
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NCollapse, NCollapseItem, NProgress } from 'naive-ui'
import { 
  Cash, 
  TrendingUp, 
  CloudUpload, 
  Document, 
  DocumentText, 
  People 
} from '@vicons/ionicons5'
import { uploadFile } from '@/api/upload'
import CommonHeader from '@/components/layout/CommonHeader.vue'

const router = useRouter()
const selectedModule = ref('')
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

// 历史记录数据
const historyItems = ref([
  {
    id: 1,
    name: '2025年Q4财务报告',
    date: '2026-03-20 14:30',
    module: 'cost'
  },
  {
    id: 2,
    name: '2025年12月经营报告',
    date: '2026-03-18 09:15',
    module: 'growth'
  }
])

// 计算进度文本
const progressText = computed(() => {
  if (uploadProgress.value < 30) {
    return '正在上传文件...'
  } else if (uploadProgress.value < 70) {
    return '正在提取文件内容...'
  } else {
    return '正在生成诊断报告...'
  }
})

// 图标组件
const MoneyIcon = Cash
const TrendingIcon = TrendingUp
const CloudUploadIcon = CloudUpload
const DocumentIcon = Document
const FileIcon = DocumentText
const UsersIcon = People

const selectModule = (module) => {
  selectedModule.value = module
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    validateFile(file)
  }
}

const validateFile = (file) => {
  // 检查文件类型
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf'
  ]
  
  if (!validTypes.some(type => file.type === type)) {
    alert('不支持的文件格式，请上传Excel或PDF文件')
    return
  }

  // 检查文件大小 (50MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    alert('文件大小超过50MB限制，请压缩或分割文件')
    return
  }

  selectedFile.value = file
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const downloadTemplate = () => {
  // 模板下载逻辑
  alert('模板下载功能即将上线')
}

const reanalyze = (item) => {
  // 重新分析逻辑
  router.push(`/results/${item.id}`)
}

const startUpload = async () => {
  if (!selectedFile.value || !selectedModule.value) return

  isUploading.value = true
  uploadProgress.value = 10

  try {
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 300)

    // 调用模拟API上传文件
    const result = await uploadFile(selectedFile.value, selectedModule.value)
    
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 将提取的内容保存到localStorage，供结果页面使用
    localStorage.setItem('currentReport', JSON.stringify(result.data))
    
    // 添加历史记录
    historyItems.value.unshift({
      id: result.data.reportId,
      name: selectedFile.value.name,
      date: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      module: selectedModule.value
    })

    // 延迟跳转，让用户看到进度完成
    setTimeout(() => {
      router.push(`/results/${result.data.reportId}`)
    }, 500)

  } catch (error) {
    console.error('上传失败:', error)
    alert(`上传失败: ${error.message}`)
    isUploading.value = false
    uploadProgress.value = 0
  }
}

onMounted(() => {
  // 从URL参数获取模块选择
  const urlParams = new URLSearchParams(window.location.search)
  const moduleParam = urlParams.get('module')
  if (moduleParam === 'growth') {
    selectedModule.value = 'growth'
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.upload {
  min-height: 100vh;
  background: $bg-light;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 60px;

    .page-title {
      font-size: 40px;
      font-weight: 700;
      color: $text-primary;
      margin-bottom: 12px;
    }

    .page-subtitle {
      font-size: 18px;
      color: $text-secondary;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .module-selection {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    margin-bottom: 60px;

    .module-card {
      background: white;
      border: 2px solid $border-color;
      border-radius: 24px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: $primary-color;
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.1);
      }

      &.active {
        border-color: $primary-color;
        background: linear-gradient(135deg, rgba(42,92,170,0.05) 0%, rgba(42,92,170,0.02) 100%);
      }

      .module-icon {
        margin-bottom: 24px;
      }

      .module-title {
        font-size: 24px;
        font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
    }

    .module-description {
      color: $text-secondary;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .module-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;

      .detail-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: $text-secondary;
        font-size: 14px;
      }
    }
  }
}

.upload-section {
  .upload-area {
    background: white;
    border: 2px dashed $border-color;
    border-radius: 24px;
    padding: 60px 20px;
    text-align: center;
    transition: all 0.3s;
    margin-bottom: 32px;

    &:hover {
      border-color: $primary-color;
      background: rgba(42,92,170,0.02);
    }

    .upload-content {
      .upload-title {
        font-size: 24px;
        font-weight: 600;
        color: $text-primary;
        margin: 24px 0 12px;
      }

      .upload-subtitle {
        color: $text-secondary;
        line-height: 1.6;
        margin-bottom: 32px;
      }

      .upload-hint {
        margin-top: 24px;
        color: $text-secondary;

        a {
          color: $primary-color;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .file-list {
    .file-item {
      background: white;
      border: 1px solid $border-color;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .file-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .file-details {
          .file-name {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
            margin: 0 0 4px;
          }

          .file-size {
            font-size: 14px;
            color: $text-secondary;
            margin: 0;
          }
        }
      }
    }
  }

  .upload-progress {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);

    .progress-text {
      text-align: center;
      margin-top: 12px;
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .upload-actions {
    text-align: center;
    margin: 40px 0;
  }

  .history-section {
    background: white;
    border-radius: 16px;
    overflow: hidden;

    .history-list {
      .history-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
        }

        .history-info {
          h4 {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
            margin: 0 0 4px;
          }

          p {
            font-size: 14px;
            color: $text-secondary;
            margin: 0;
          }
        }
      }

      .empty-history {
        text-align: center;
        padding: 40px 20px;
        color: $text-secondary;
      }
    }
  }
}
}

@media (max-width: 768px) {
.upload {
  .container {
    padding: 100px 20px 60px;
  }

  .page-header {
    .page-title {
      font-size: 32px;
    }
  }

  .module-selection {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .upload-section {
    .upload-area {
      padding: 40px 20px;
    }
  }
}
}
</style>