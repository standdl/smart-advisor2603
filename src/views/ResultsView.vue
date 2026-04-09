<template>
  <div class="results">
    <!-- 导航栏 -->
    <CommonHeader />
    
    <div class="container">
      <!-- 报告头信息 -->
      <div class="report-header">
        <div class="report-meta">
          <h1 class="report-title">企业诊断报告</h1>
          <div class="meta-grid">
            <div class="meta-item">
              <label>企业名称</label>
              <span>XX科技有限公司</span>
            </div>
            <div class="meta-item">
              <label>报告期</label>
              <span>2025年Q4</span>
            </div>
            <div class="meta-item">
              <label>生成时间</label>
              <span>2026-03-24 10:30</span>
            </div>
            <div class="meta-item">
              <label>诊断模块</label>
              <span>降本增效</span>
            </div>
          </div>
        </div>
        <div class="health-score">
          <div class="score-circle">
            <div class="score-value">76.5</div>
            <div class="score-label">综合健康度</div>
          </div>
          <div class="score-details">
            <div class="health-rating">
              <span class="rating-badge good">良好</span>
            </div>
            <div class="trend-indicator">
              <n-icon size="20" color="#28A745">
                <TrendingUpIcon />
              </n-icon>
              <span>较上期提升5.2分</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作工具栏 -->
      <div class="report-toolbar">
        <n-button-group>
          <n-button secondary @click="exportReport">
            <template #icon>
              <n-icon>
                <DownloadIcon />
              </n-icon>
            </template>
            导出报告
          </n-button>
          <n-button secondary @click="shareReport">
            <template #icon>
              <n-icon>
                <ShareIcon />
              </n-icon>
            </template>
            分享
          </n-button>
          <n-button secondary @click="printReport">
            <template #icon>
              <n-icon>
                <PrintIcon />
              </n-icon>
            </template>
            打印
          </n-button>
        </n-button-group>
      </div>

      <!-- 健康度概览 -->
      <section class="health-overview">
        <h2 class="section-title">健康度概览</h2>
        <div class="overview-content">
          <div class="overview-chart">
            <!-- 环形图占位 -->
            <div class="chart-placeholder">
              <p>环形图：综合得分76.5</p>
            </div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <label>成本结构健康度</label>
              <div class="stat-value">
                <span class="score">68.2</span>
                <span class="trend positive">+2.1</span>
              </div>
              <n-progress
                type="line"
                :percentage="68.2"
                :height="8"
                :show-indicator="false"
              />
            </div>
            <div class="stat-item">
              <label>毛利率偏差度</label>
              <div class="stat-value">
                <span class="score">81.5</span>
                <span class="trend positive">+3.4</span>
              </div>
              <n-progress
                type="line"
                :percentage="81.5"
                :height="8"
                :show-indicator="false"
              />
            </div>
            <div class="stat-item">
              <label>费用控制效率</label>
              <div class="stat-value">
                <span class="score">72.8</span>
                <span class="trend negative">-1.2</span>
              </div>
              <n-progress
                type="line"
                :percentage="72.8"
                :height="8"
                :show-indicator="false"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 关键指标仪表盘 -->
      <section class="metrics-dashboard">
        <h2 class="section-title">关键指标分析</h2>
        <div class="dashboard-content">
          <div class="radar-chart">
            <!-- 雷达图占位 -->
            <div class="chart-placeholder">
              <p>雷达图：5个降本增效指标得分</p>
            </div>
          </div>
          <div class="comparison-chart">
            <!-- 条形图占位 -->
            <div class="chart-placeholder">
              <p>条形图：企业vs行业平均值对比</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 详细分析 -->
      <section class="detailed-analysis">
        <h2 class="section-title">详细分析</h2>
        <div class="analysis-list">
          <div class="analysis-item">
            <h3 class="analysis-title">成本结构健康度（68.2分）</h3>
            <div class="analysis-data">
              <div class="data-row">
                <span class="label">您的值：</span>
                <span class="value">82%</span>
              </div>
              <div class="data-row">
                <span class="label">行业平均：</span>
                <span class="value">78%</span>
              </div>
              <div class="data-row">
                <span class="label">健康范围：</span>
                <span class="value">70-85%</span>
              </div>
            </div>
            <div class="analysis-insights">
              <h4>问题识别</h4>
              <p>销售费用占比偏高，主要因为数字营销渠道ROI偏低。</p>
              
              <h4>建议</h4>
              <p>优化数字营销渠道ROI，通过A/B测试识别高效渠道，降低销售费用占比2-3个百分点，预计年度可节省成本约¥150,000。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 行动建议 -->
      <section class="action-recommendations">
        <h2 class="section-title">行动建议</h2>
        <div class="action-table">
          <table>
            <thead>
              <tr>
                <th>优先级</th>
                <th>行动事项</th>
                <th>时间线</th>
                <th>预期影响</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="priority high">高</span></td>
                <td>优化销售费用结构</td>
                <td>1-2个月</td>
                <td>毛利率+1.5%</td>
              </tr>
              <tr>
                <td><span class="priority medium">中</span></td>
                <td>优化存货管理系统</td>
                <td>3-6个月</td>
                <td>周转率+15%</td>
              </tr>
              <tr>
                <td><span class="priority low">低</span></td>
                <td>优化供应商付款周期</td>
                <td>6-12个月</td>
                <td>现金流+¥500,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 付费升级入口 -->
      <section class="premium-upsell">
        <div class="upsell-card">
          <div class="upsell-header">
            <n-icon size="32" color="#FF6B35">
              <LockIcon />
            </n-icon>
            <h3>深度分析仅限付费用户</h3>
          </div>
          <div class="upsell-content">
            <div class="upsell-item">
              <h4>供应链成本结构分析</h4>
              <p class="upsell-price">¥499</p>
              <p class="upsell-description">
                识别供应商成本优化空间，预计年节省¥150,000
              </p>
            </div>
            <div class="upsell-item">
              <h4>竞争对手对标分析</h4>
              <p class="upsell-price">¥799</p>
              <p class="upsell-description">
                获取前3名竞争对手详细对比数据
              </p>
            </div>
          </div>
          <div class="upsell-actions">
            <n-button type="primary" size="large">
              升级到专业版
            </n-button>
            <n-button size="large">
              单独购买深度分析
            </n-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { NButton, NButtonGroup, NIcon, NProgress } from 'naive-ui'
import { 
  TrendingUp, 
  Download, 
  Share, 
  Print, 
  LockClosed 
} from '@vicons/ionicons5'
import CommonHeader from '@/components/layout/CommonHeader.vue'

// 图标组件
const TrendingUpIcon = TrendingUp
const DownloadIcon = Download
const ShareIcon = Share
const PrintIcon = Print
const LockIcon = LockClosed

const exportReport = () => {
  alert('导出报告功能即将上线')
}

const shareReport = () => {
  alert('分享功能即将上线')
}

const printReport = () => {
  window.print()
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.results {
  min-height: 100vh;
  background: $bg-light;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }

  .report-header {
    background: white;
    border-radius: 24px;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);

    .report-meta {
      .report-title {
        font-size: 32px;
        font-weight: 700;
        color: $text-primary;
        margin: 0 0 24px;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;

        .meta-item {
          label {
            display: block;
            font-size: 14px;
            color: $text-secondary;
            margin-bottom: 4px;
          }

          span {
            font-size: 16px;
            font-weight: 500;
            color: $text-primary;
          }
        }
      }
    }

    .health-score {
      text-align: center;

      .score-circle {
        width: 120px;
        height: 120px;
        border: 8px solid #28A745;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;

        .score-value {
          font-size: 32px;
          font-weight: 700;
          color: $text-primary;
        }

        .score-label {
          font-size: 14px;
          color: $text-secondary;
          margin-top: 4px;
        }
      }

      .score-details {
        .health-rating {
          margin-bottom: 8px;

          .rating-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 500;

            &.good {
              background: rgba(40,167,69,0.1);
              color: #28A745;
            }
          }
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #28A745;
          font-size: 14px;
        }
      }
    }
  }

  .report-toolbar {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid $border-color;
  }

  .health-overview {
    background: white;
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;

    .overview-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 32px;

      .overview-chart {
        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $bg-light;
          border-radius: 16px;
          border: 2px dashed $border-color;
          color: $text-secondary;
        }
      }

      .overview-stats {
        .stat-item {
          margin-bottom: 24px;

          label {
            display: block;
            font-size: 14px;
            color: $text-secondary;
            margin-bottom: 8px;
          }

          .stat-value {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;

            .score {
              font-size: 20px;
              font-weight: 600;
              color: $text-primary;
            }

            .trend {
              font-size: 14px;
              font-weight: 500;

              &.positive {
                color: #28A745;
              }

              &.negative {
                color: #DC3545;
              }
            }
          }
        }
      }
    }
  }

  .metrics-dashboard {
    background: white;
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;

      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $bg-light;
        border-radius: 16px;
        border: 2px dashed $border-color;
        color: $text-secondary;
      }
    }
  }

  .detailed-analysis {
    background: white;
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;

    .analysis-item {
      border: 1px solid $border-color;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .analysis-title {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 16px;
      }

      .analysis-data {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: $bg-light;
        border-radius: 12px;

        .data-row {
          .label {
            display: block;
            font-size: 14px;
            color: $text-secondary;
            margin-bottom: 4px;
          }

          .value {
            font-size: 16px;
            font-weight: 600;
            color: $text-primary;
          }
        }
      }

      .analysis-insights {
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: $text-primary;
          margin: 16px 0 8px;

          &:first-child {
            margin-top: 0;
          }
        }

        p {
          color: $text-secondary;
          line-height: 1.6;
          margin: 0 0 12px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .action-recommendations {
    background: white;
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;

    .action-table {
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

              .priority {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 14px;
                font-weight: 500;

                &.high {
                  background: rgba(220,53,69,0.1);
                  color: #DC3545;
                }

                &.medium {
                  background: rgba(255,193,7,0.1);
                  color: #FFC107;
                }

                &.low {
                  background: rgba(40,167,69,0.1);
                  color: #28A745;
                }
              }
            }
          }
        }
      }
    }
  }

  .premium-upsell {
    background: linear-gradient(135deg, #2A5CAA 0%, #4A8CE0 100%);
    border-radius: 24px;
    padding: 40px;
    color: white;

    .upsell-card {
      .upsell-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;

        h3 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
      }

      .upsell-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 32px;

        .upsell-item {
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;

          h4 {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 12px;
          }

          .upsell-price {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 12px;
          }

          .upsell-description {
            opacity: 0.9;
            line-height: 1.6;
            margin: 0;
          }
        }
      }

      .upsell-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 768px) {
  .results {
    .container {
      padding: 100px 20px 60px;
    }

    .report-header {
      flex-direction: column;
      gap: 32px;

      .meta-grid {
        grid-template-columns: 1fr !important;
      }
    }

    .health-overview {
      .overview-content {
        grid-template-columns: 1fr !important;
      }
    }

    .metrics-dashboard {
      .dashboard-content {
        grid-template-columns: 1fr !important;
      }
    }

    .detailed-analysis {
      .analysis-data {
        grid-template-columns: 1fr !important;
      }
    }

    .premium-upsell {
      .upsell-content {
        grid-template-columns: 1fr !important;
      }

      .upsell-actions {
        flex-direction: column;
      }
    }
  }
}
</style>