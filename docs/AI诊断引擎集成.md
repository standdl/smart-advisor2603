# AI诊断引擎集成文档

## 1. 概述

### 1.1 核心功能
智能参谋网站的AI诊断引擎基于阿里千问(Qwen-Turbo)大模型，提供以下核心功能：

1. **财务报告智能分析**：解析Excel/PDF格式财务报告，生成降本增效建议
2. **经营报告智能分析**：分析月度/年度经营报告，生成韧性增长策略
3. **结构化输出**：自动提取关键建议、量化指标、行动项和时间规划

### 1.2 技术架构
```
前端界面 (Vue.js) → API层 (upload.js) → 诊断服务 (diagnosis.js) → 阿里千问API
                    │                    │
                    └─ 模拟模式 (simulate) ─┘
```

### 1.3 版本信息
- **引擎版本**: v1.0
- **AI服务商**: 阿里千问(Qwen-Turbo)
- **集成方式**: OpenAI兼容接口 + DashScope SDK
- **部署环境**: Node.js (Vercel Functions) / 浏览器模拟模式

## 2. 接口设计

### 2.1 核心接口 `analyzeReport`

**函数签名**：
```javascript
async function analyzeReport(request): Promise<DiagnosisResult>
```

**请求参数结构** (`DiagnosisRequest`)：
```javascript
{
  // 必需参数
  reportType: 'financial' | 'operational',  // 报告类型
  content: string,                          // 报告内容文本
  templateId: string,                       // 诊断模板标识
  
  // 可选参数
  language: string = 'zh-CN',               // 输出语言
  options: {
    simulate: boolean = false,              // 模拟模式开关
    apiKey: string,                         // API密钥（可选）
    baseUrl: string,                        // API基础URL（可选）
    timeout: number = 30000                 // 超时时间（毫秒）
  }
}
```

**响应结果结构** (`DiagnosisResult`)：
```javascript
{
  success: boolean,                         // 是否成功
  error?: string,                           // 错误信息（失败时）
  
  // 诊断信息
  reportType: string,                       // 报告类型
  templateId: string,                       // 模板ID
  templateName: string,                     // 模板名称
  
  // 核心产出
  diagnosis: string,                        // AI生成的完整诊断报告
  structuredResult: {                       // 结构化解析结果
    sections: string[],                     // 报告章节列表
    recommendations: Array<{                // 关键建议
      title: string,
      description: string
    }>,
    metrics: string[],                      // 量化指标
    actionItems: string[],                  // 具体行动项
    summary: string                         // 摘要
  },
  
  // 元数据
  usage: {                                  // API使用统计
    input_tokens: number,
    output_tokens: number,
    total_tokens: number
  },
  requestId: string,                        // 请求追踪ID
  timestamp: number                         // 时间戳
}
```

### 2.2 辅助接口

#### `getAvailableTemplates(reportType?)`
获取可用模板列表，支持按报告类型过滤。

#### `getTemplateDetail(templateId)`
获取指定模板的详细信息，包括示例提示词。

### 2.3 枚举定义

**报告类型** (`ReportType`)：
```javascript
{
  FINANCIAL: 'financial',      // 财务报告
  OPERATIONAL: 'operational'   // 经营报告
}
```

**诊断模板** (`TemplateId`)：
```javascript
{
  // 降本增效模板 (5个)
  COST_SAVING_1: 'cost_saving_1',  // 制造业成本优化
  COST_SAVING_2: 'cost_saving_2',  // 零售业成本优化
  COST_SAVING_3: 'cost_saving_3',  // 服务业成本优化
  COST_SAVING_4: 'cost_saving_4',  // 原材料成本控制
  COST_SAVING_5: 'cost_saving_5',  // 人力成本优化
  
  // 韧性增长模板 (5个)
  GROWTH_1: 'growth_1',        // 市场拓展策略
  GROWTH_2: 'growth_2',        // 产品创新策略
  GROWTH_3: 'growth_3',        // 客户留存提升
  GROWTH_4: 'growth_4',        // 数字化转型
  GROWTH_5: 'growth_5'         // 供应链优化
}
```

## 3. 调用示例

### 3.1 基础使用

#### 示例1：财务报告分析
```javascript
import { analyzeReport, ReportType, TemplateId } from '@/services/diagnosis';

// 假设已从上传文件中提取出文本内容
const financialReportContent = `年度财务报告
总收入：¥12,000,000
净利润：¥1,020,000
原材料成本：¥4,200,000 (35%)
人力成本：¥3,000,000 (25%)
运营成本：¥2,400,000 (20%)
...`;

const request = {
  reportType: ReportType.FINANCIAL,
  templateId: TemplateId.COST_SAVING_1,
  content: financialReportContent,
  options: {
    simulate: true  // 开发阶段使用模拟模式
  }
};

try {
  const result = await analyzeReport(request);
  
  if (result.success) {
    console.log('诊断成功:', result.templateName);
    console.log('摘要:', result.structuredResult.summary);
    console.log('关键建议:', result.structuredResult.recommendations);
    console.log('API使用:', result.usage.total_tokens, 'tokens');
  } else {
    console.error('诊断失败:', result.error);
  }
} catch (error) {
  console.error('调用异常:', error);
}
```

#### 示例2：经营报告分析
```javascript
import { analyzeReport, ReportType, TemplateId } from '@/services/diagnosis';

const operationalReportContent = `第三季度经营报告
市场份额：8%
季度增长率：15%
客户满意度：85%
员工流失率：12%
新产品收入贡献：18%
...`;

const request = {
  reportType: ReportType.OPERATIONAL,
  templateId: TemplateId.GROWTH_1,
  content: operationalReportContent,
  options: {
    simulate: false,
    apiKey: process.env.DASHSCOPE_API_KEY  // 真实API密钥
  }
};

const result = await analyzeReport(request);
```

### 3.2 高级用法

#### 批量处理多个报告
```javascript
async function batchAnalyzeReports(reports) {
  const results = [];
  
  for (const report of reports) {
    // 限流控制：每秒最多2个请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = await analyzeReport({
      reportType: report.type,
      templateId: report.templateId,
      content: report.content,
      options: { simulate: false }
    });
    
    results.push(result);
  }
  
  return results;
}
```

#### 自定义提示词模板
```javascript
import { analyzeReport, ReportType } from '@/services/diagnosis';

// 扩展默认提示词
const customSystemPrompt = `你是一位专注于${industry}行业的资深管理顾问。
除了标准的财务分析，请特别关注以下行业特点：
1. ${industryFeature1}
2. ${industryFeature2}

请提供符合行业最佳实践的建议。`;

// 创建自定义分析函数
async function analyzeWithCustomPrompt(reportContent, industry) {
  // 临时修改系统提示词
  const originalModule = await import('@/services/diagnosis');
  const customDiagnosis = {
    ...originalModule,
    SYSTEM_PROMPTS: {
      ...originalModule.SYSTEM_PROMPTS,
      [ReportType.FINANCIAL]: customSystemPrompt
    }
  };
  
  return customDiagnosis.analyzeReport({
    reportType: ReportType.FINANCIAL,
    templateId: 'cost_saving_1',
    content: reportContent
  });
}
```

## 4. 错误处理

### 4.1 错误类型

| 错误类型 | 原因 | 建议处理方式 |
|----------|------|--------------|
| **参数验证错误** | 请求参数缺失或无效 | 检查请求格式，确保必需参数正确 |
| **API认证错误** | API密钥无效或过期 | 更新API密钥，检查环境变量设置 |
| **配额不足错误** | 免费额度耗尽或余额不足 | 升级服务套餐，监控用量 |
| **网络连接错误** | 网络问题或服务不可用 | 重试机制，检查防火墙设置 |
| **超时错误** | API响应时间过长 | 增加超时时间，优化提示词 |

### 4.2 错误处理示例

```javascript
import { analyzeReport } from '@/services/diagnosis';

async function safeAnalyze(request, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await analyzeReport(request);
      
      if (result.success) {
        return result;
      }
      
      // 处理特定错误
      if (result.error.includes('quota') || result.error.includes('额度')) {
        throw new Error('API配额不足，请检查余额或升级套餐');
      }
      
      if (result.error.includes('auth') || result.error.includes('认证')) {
        throw new Error('API认证失败，请检查API密钥');
      }
      
      console.warn(`第${attempt}次尝试失败: ${result.error}`);
      
    } catch (error) {
      console.error(`第${attempt}次尝试异常:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`分析失败，已重试${maxRetries}次: ${error.message}`);
      }
      
      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

// 使用示例
try {
  const result = await safeAnalyze(request);
  // 处理成功结果
} catch (error) {
  console.error('最终失败:', error.message);
  // 显示用户友好的错误信息
  showErrorMessage('诊断服务暂时不可用，请稍后重试或联系客服');
}
```

### 4.3 监控与日志

建议在服务端添加监控点：
```javascript
// 监控指标示例
const metrics = {
  startTime: Date.now(),
  requestId: generateRequestId(),
  reportType: request.reportType,
  templateId: request.templateId,
  contentLength: request.content.length
};

// 记录日志
function logDiagnosisEvent(event, details) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ...details,
    ...metrics
  }));
}

// 在关键节点记录
logDiagnosisEvent('analysis_started', {});
const result = await analyzeReport(request);
logDiagnosisEvent('analysis_completed', {
  success: result.success,
  tokenUsage: result.usage,
  duration: Date.now() - metrics.startTime
});
```

## 5. 性能优化

### 5.1 提示词优化策略

1. **长度控制**：
   - 财务报告内容截断：保留核心数据表，移除格式标记
   - 建议提取关键数字和趋势，而非完整报告

2. **结构化要求**：
   - 明确指定输出格式（章节、标题、列表）
   - 要求量化数据（金额、百分比、时间）

3. **温度参数**：
   - 分析任务：temperature = 0.3-0.7（平衡创意与一致性）
   - 摘要任务：temperature = 0.1-0.3（确保准确性）

### 5.2 缓存策略

```javascript
// 简单的内容哈希缓存
const diagnosisCache = new Map();

function getCacheKey(request) {
  return `${request.reportType}:${request.templateId}:${hash(request.content)}`;
}

async function cachedAnalyze(request) {
  const cacheKey = getCacheKey(request);
  
  // 检查缓存（有效期1小时）
  const cached = diagnosisCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3600000) {
    console.log('命中缓存:', cacheKey);
    return cached.result;
  }
  
  // 调用API
  const result = await analyzeReport(request);
  
  if (result.success) {
    diagnosisCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
  }
  
  return result;
}
```

### 5.3 并发控制

```javascript
class DiagnosisQueue {
  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent;
    this.active = 0;
    this.queue = [];
  }
  
  async enqueue(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.active >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    this.active++;
    const { request, resolve, reject } = this.queue.shift();
    
    try {
      const result = await analyzeReport(request);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.active--;
      this.process();
    }
  }
}

// 使用队列
const diagnosisQueue = new DiagnosisQueue(2);
const result1 = diagnosisQueue.enqueue(request1);
const result2 = diagnosisQueue.enqueue(request2);
```

## 6. 部署配置

### 6.1 环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DASHSCOPE_API_KEY` | 阿里云API密钥 | `sk-1234567890abcdef` |
| `AI_SERVICE_URL` | API基础URL（可选） | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `DIAGNOSIS_TIMEOUT` | 超时时间（毫秒） | `30000` |
| `SIMULATION_MODE` | 模拟模式开关 | `false` |

### 6.2 Vercel Functions配置

在 `vercel.json` 中配置：
```json
{
  "functions": {
    "api/diagnose": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### 6.3 安全配置

1. **API密钥管理**：
   - 使用环境变量，避免硬编码
   - 定期轮换密钥（建议90天）
   - 为不同环境使用不同密钥

2. **请求验证**：
   - 验证请求来源（CORS配置）
   - 限制请求频率（防滥用）
   - 验证内容长度（防攻击）

## 7. 测试方案

### 7.1 单元测试示例

```javascript
// diagnosis.test.js
import { analyzeReport, ReportType, TemplateId } from '@/services/diagnosis';

describe('AI诊断引擎', () => {
  test('财务报告分析 - 模拟模式', async () => {
    const request = {
      reportType: ReportType.FINANCIAL,
      templateId: TemplateId.COST_SAVING_1,
      content: '模拟财务报告内容...',
      options: { simulate: true }
    };
    
    const result = await analyzeReport(request);
    
    expect(result.success).toBe(true);
    expect(result.templateName).toBe('制造业成本优化');
    expect(result.diagnosis).toContain('分析报告');
    expect(result.structuredResult.recommendations.length).toBeGreaterThan(0);
  });
  
  test('参数验证 - 内容过短', async () => {
    const request = {
      reportType: ReportType.FINANCIAL,
      templateId: TemplateId.COST_SAVING_1,
      content: '太短',
      options: { simulate: true }
    };
    
    const result = await analyzeReport(request);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('过短');
  });
});
```

### 7.2 集成测试

```javascript
// 真实API调用测试（需要有效API密钥）
describe('真实API集成测试', () => {
  let apiKey;
  
  beforeAll(() => {
    apiKey = process.env.TEST_DASHSCOPE_API_KEY;
    if (!apiKey) {
      console.warn('未设置测试API密钥，跳过真实API测试');
    }
  });
  
  test('真实财务分析', async () => {
    if (!apiKey) return;
    
    const request = {
      reportType: ReportType.FINANCIAL,
      templateId: TemplateId.COST_SAVING_1,
      content: '真实财务报告内容...',
      options: {
        simulate: false,
        apiKey,
        timeout: 60000
      }
    };
    
    const result = await analyzeReport(request);
    
    expect(result.success).toBe(true);
    expect(result.usage.total_tokens).toBeGreaterThan(0);
  }, 90000); // 延长超时时间
});
```

## 8. 升级与维护

### 8.1 版本兼容性

| 版本 | AI模型 | 接口变更 | 向后兼容 |
|------|--------|----------|----------|
| v1.0 | Qwen-Turbo | 初始版本 | - |
| v1.1 | Qwen-Max | 新增高级模板 | ✅ |
| v2.0 | 多模型支持 | API重构 | ❌（需迁移） |

### 8.2 监控指标

建议监控以下关键指标：
1. **成功率**：成功请求数 / 总请求数
2. **平均响应时间**：从请求到响应的平均耗时
3. **Token使用量**：输入/输出Token统计
4. **错误分布**：各类错误的比例和趋势

### 8.3 故障排查清单

1. ✅ API密钥是否正确配置
2. ✅ 网络连接是否正常
3. ✅ 服务配额是否充足
4. ✅ 请求参数是否符合规范
5. ✅ 模型服务是否可用（检查阿里云状态）

## 9. 附录

### 9.1 相关文件路径

| 文件 | 路径 | 说明 |
|------|------|------|
| 诊断服务模块 | `src/services/diagnosis.js` | 核心诊断引擎实现 |
| API测试脚本 | `src/ai_api_test.py` | Python API调用示例 |
| 选型报告 | `docs/AI服务商选型报告.md` | 服务商选择和成本分析 |
| 财务模型 | `docs/财务模型.xlsx` | 成本收益测算 |

### 9.2 参考链接

1. [阿里云DashScope文档](https://help.aliyun.com/zh/dashscope/)
2. [Qwen-Turbo API参考](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
3. [OpenAI兼容接口说明](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/)
4. [智能参谋项目计划](computer://memory/spec.txt)

### 9.3 联系支持

如遇技术问题，请：
1. 检查本文档的常见问题部分
2. 查阅阿里云官方文档
3. 联系项目技术负责人
4. 提交GitHub Issue（如开源）

---

**文档版本**: 1.0  
**最后更新**: 2026年3月26日  
**维护团队**: 智能参谋技术组