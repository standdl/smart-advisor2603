/**
 * 智能参谋网站AI诊断引擎
 * 
 * 该模块提供统一的AI诊断接口，调用阿里千问(Qwen-Turbo) API，
 * 根据财务报告或经营报告内容生成专业的降本增效或韧性增长建议。
 * 
 * 支持两种运行模式：
 * 1. 真实模式：调用阿里云DashScope API
 * 2. 模拟模式：返回模拟数据，用于开发和测试
 */

// ==================== 常量定义 ====================

/**
 * 报告类型枚举
 */
export const ReportType = {
  FINANCIAL: 'financial',
  OPERATIONAL: 'operational'
};

/**
 * 诊断模板枚举
 */
export const TemplateId = {
  // 降本增效模板
  COST_SAVING_1: 'cost_saving_1',      // 制造业成本优化
  COST_SAVING_2: 'cost_saving_2',      // 零售业成本优化
  COST_SAVING_3: 'cost_saving_3',      // 服务业成本优化
  COST_SAVING_4: 'cost_saving_4',      // 原材料成本控制
  COST_SAVING_5: 'cost_saving_5',      // 人力成本优化
  
  // 韧性增长模板
  GROWTH_1: 'growth_1',                // 市场拓展策略
  GROWTH_2: 'growth_2',                // 产品创新策略
  GROWTH_3: 'growth_3',                // 客户留存提升
  GROWTH_4: 'growth_4',                // 数字化转型
  GROWTH_5: 'growth_5'                 // 供应链优化
};

/**
 * 模板元数据
 */
export const TemplateMetadata = {
  [TemplateId.COST_SAVING_1]: {
    name: '制造业成本优化',
    description: '针对制造业企业的生产成本、原材料采购、设备利用率等进行分析',
    reportType: ReportType.FINANCIAL
  },
  [TemplateId.COST_SAVING_2]: {
    name: '零售业成本优化',
    description: '针对零售企业的库存成本、租金成本、人力成本等进行分析',
    reportType: ReportType.FINANCIAL
  },
  [TemplateId.COST_SAVING_3]: {
    name: '服务业成本优化',
    description: '针对服务型企业的人力成本、运营成本、营销成本等进行分析',
    reportType: ReportType.FINANCIAL
  },
  [TemplateId.COST_SAVING_4]: {
    name: '原材料成本控制',
    description: '分析原材料采购策略、供应商管理、库存优化等',
    reportType: ReportType.FINANCIAL
  },
  [TemplateId.COST_SAVING_5]: {
    name: '人力成本优化',
    description: '分析组织架构效率、薪酬结构、培训投入等',
    reportType: ReportType.FINANCIAL
  },
  [TemplateId.GROWTH_1]: {
    name: '市场拓展策略',
    description: '基于经营数据制定新市场进入、渠道拓展、品牌建设策略',
    reportType: ReportType.OPERATIONAL
  },
  [TemplateId.GROWTH_2]: {
    name: '产品创新策略',
    description: '分析产品线结构、研发投入、客户反馈，制定创新方向',
    reportType: ReportType.OPERATIONAL
  },
  [TemplateId.GROWTH_3]: {
    name: '客户留存提升',
    description: '基于客户数据优化客户服务、提升复购率、降低流失率',
    reportType: ReportType.OPERATIONAL
  },
  [TemplateId.GROWTH_4]: {
    name: '数字化转型',
    description: '评估数字化现状，制定系统升级、数据驱动决策、自动化流程方案',
    reportType: ReportType.OPERATIONAL
  },
  [TemplateId.GROWTH_5]: {
    name: '供应链优化',
    description: '分析供应链效率、风险管理、供应商多元化策略',
    reportType: ReportType.OPERATIONAL
  }
};

// ==================== 提示词模板 ====================

/**
 * 系统提示词模板
 */
const SYSTEM_PROMPTS = {
  [ReportType.FINANCIAL]: `你是一位资深的企业财务管理咨询专家，专注于帮助企业进行财务分析和成本优化。
你的任务是分析企业财务报告，识别成本节约机会，并提出切实可行的降本增效建议。

请按照以下结构组织你的分析：
1. **财务概况总结**：提炼报告中的关键财务指标和趋势
2. **成本结构分析**：详细分析各项成本占比和变化趋势
3. **关键问题识别**：指出3-5个最突出的成本控制问题
4. **具体建议方案**：针对每个问题提出可操作的具体建议
5. **预期效益评估**：量化估算每项建议的潜在节约金额/比例
6. **实施优先级排序**：根据实施难度和效益进行排序

要求：
- 使用专业但易懂的语言
- 提供数据支撑（引用报告中的具体数据）
- 建议应具体、可衡量、有时限
- 考虑行业特点和企业的实际情况`,

  [ReportType.OPERATIONAL]: `你是一位资深的企业战略与运营管理咨询专家，专注于帮助企业实现可持续增长和韧性提升。
你的任务是分析企业经营报告，识别增长机会，并提出切实可行的韧性增长建议。

请按照以下结构组织你的分析：
1. **经营概况总结**：提炼报告中的关键运营指标和趋势
2. **增长机会分析**：识别市场、产品、客户等方面的增长潜力
3. **风险与挑战识别**：指出3-5个最关键的经营风险或增长瓶颈
4. **具体增长策略**：针对每个机会提出可操作的具体策略
5. **资源需求评估**：估算实施策略所需的人力、资金、技术资源
6. **实施路线图建议**：分阶段、分步骤的实施计划

要求：
- 使用专业但易懂的语言
- 提供数据支撑（引用报告中的具体数据）
- 策略应具体、可衡量、有时限
- 考虑行业趋势、竞争环境和企业的核心竞争力`
};

/**
 * 根据模板ID生成具体提示词
 */
function generateUserPrompt(templateId, content) {
  const template = TemplateMetadata[templateId];
  if (!template) {
    throw new Error(`无效的模板ID: ${templateId}`);
  }
  
  return `请分析以下${template.name}报告：

【报告内容】
${content}

请严格按照要求的结构提供详细的分析和建议。`;
}

// ==================== 核心诊断函数 ====================

/**
 * 诊断请求参数
 * @typedef {Object} DiagnosisRequest
 * @property {string} reportType - 报告类型: 'financial' 或 'operational'
 * @property {string} content - 从报告中提取的文本内容
 * @property {string} templateId - 诊断模板标识
 * @property {string} [language='zh-CN'] - 输出语言
 * @property {Object} [options] - 额外选项
 * @property {boolean} [options.simulate=false] - 是否使用模拟模式
 * @property {string} [options.apiKey] - API密钥（可选，默认从环境变量获取）
 */

/**
 * 诊断响应结果
 * @typedef {Object} DiagnosisResult
 * @property {boolean} success - 是否成功
 * @property {string} [error] - 错误信息（成功时为undefined）
 * @property {string} reportType - 报告类型
 * @property {string} templateId - 使用的模板ID
 * @property {string} templateName - 模板名称
 * @property {string} diagnosis - AI生成的专业诊断建议
 * @property {Object} structuredResult - 结构化解析结果
 * @property {Object} usage - API使用统计
 * @property {string} requestId - 请求ID（用于追踪）
 * @property {number} timestamp - 时间戳
 */

/**
 * 执行AI诊断分析
 * @param {DiagnosisRequest} request - 诊断请求参数
 * @returns {Promise<DiagnosisResult>} 诊断结果
 */
export async function analyzeReport(request) {
  try {
    // 参数验证
    validateRequest(request);
    
    // 生成提示词
    const systemPrompt = SYSTEM_PROMPTS[request.reportType];
    const userPrompt = generateUserPrompt(request.templateId, request.content);
    
    // 调用AI API
    let apiResponse;
    if (request.options?.simulate) {
      apiResponse = await simulateAIResponse(request);
    } else {
      apiResponse = await callQwenTurboAPI(systemPrompt, userPrompt, request.options);
    }
    
    // 解析响应
    const structuredResult = parseAIResponse(apiResponse.content, request.templateId);
    
    // 构建结果
    const templateMeta = TemplateMetadata[request.templateId];
    
    return {
      success: true,
      reportType: request.reportType,
      templateId: request.templateId,
      templateName: templateMeta.name,
      diagnosis: apiResponse.content,
      structuredResult,
      usage: apiResponse.usage || { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
      requestId: apiResponse.requestId || `sim-${Date.now()}`,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('AI诊断分析失败:', error);
    
    return {
      success: false,
      error: error.message || '未知错误',
      reportType: request?.reportType,
      templateId: request?.templateId,
      templateName: request?.templateId ? TemplateMetadata[request.templateId]?.name : '未知',
      diagnosis: '',
      structuredResult: {},
      usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
      requestId: `err-${Date.now()}`,
      timestamp: Date.now()
    };
  }
}

// ==================== API调用函数 ====================

/**
 * 调用Qwen-Turbo API
 * @param {string} systemPrompt - 系统提示词
 * @param {string} userPrompt - 用户提示词
 * @param {Object} [options] - 选项
 * @param {string} [options.apiKey] - API密钥
 * @param {string} [options.baseUrl] - API基础URL
 * @returns {Promise<Object>} API响应
 */
async function callQwenTurboAPI(systemPrompt, userPrompt, options = {}) {
  const apiKey = options.apiKey || process.env.DASHSCOPE_API_KEY;
  const baseUrl = options.baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  
  if (!apiKey) {
    throw new Error('未提供API密钥。请设置DASHSCOPE_API_KEY环境变量或传递apiKey选项');
  }
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
  
  try {
    // 使用fetch调用兼容OpenAI的接口
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0
      },
      requestId: data.id
    };
    
  } catch (error) {
    console.error('API调用失败:', error);
    throw new Error(`AI服务调用失败: ${error.message}`);
  }
}

/**
 * 模拟AI响应（用于开发和测试）
 * @param {DiagnosisRequest} request - 诊断请求
 * @returns {Promise<Object>} 模拟响应
 */
async function simulateAIResponse(request) {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const templateMeta = TemplateMetadata[request.templateId];
  const reportType = request.reportType;
  
  // 生成模拟内容
  let content;
  if (reportType === ReportType.FINANCIAL) {
    content = `# ${templateMeta.name}分析报告

## 1. 财务概况总结
基于提供的财务报告，企业年度总收入为¥1,200万元，净利润率8.5%。主要成本构成：原材料成本占比35%，人力成本占比25%，运营成本占比20%。

## 2. 成本结构分析
- **原材料成本**：较去年同期上升12%，主要受国际市场价格波动影响
- **人力成本**：占比合理，但人均产出较行业标杆低15%
- **运营成本**：营销费用占比偏高，投资回报率有待提升

## 3. 关键问题识别
1. **原材料采购缺乏议价能力**：单一供应商依赖度达70%
2. **生产效率有待提升**：设备综合利用率仅65%
3. **营销费用结构不合理**：数字渠道投入不足传统渠道一半

## 4. 具体建议方案
**建议1：多元化采购策略**
- 开发3-5家合格备选供应商
- 建立原材料价格监测机制
- 推行集中采购提高议价能力
- **预期效益**：年节约成本¥50-80万元（4-6%）

**建议2：生产效率优化**
- 实施设备预防性维护计划
- 引入生产执行系统(MES)优化排程
- 开展员工技能培训提升操作效率
- **预期效益**：产能提升15-20%，年增效¥60万元

**建议3：营销数字化转型**
- 将30%传统营销预算转向数字渠道
- 建立客户数据分析系统
- 试点社交媒体精准营销
- **预期效益**：营销ROI提升25%，年节约¥30万元

## 5. 实施优先级排序
1. **高优先级**：多元化采购策略（实施周期3个月，效益显著）
2. **中优先级**：生产效率优化（实施周期6个月，需要技改投入）
3. **低优先级**：营销数字化转型（实施周期4个月，需团队学习）`;
  } else {
    content = `# ${templateMeta.name}分析报告

## 1. 经营概况总结
基于提供的经营报告，企业市场占有率为8%，年客户增长率为15%。主要增长驱动力来自现有产品线，新产品贡献率不足20%。

## 2. 增长机会分析
- **市场拓展**：华南地区渗透率仅5%，有较大提升空间
- **产品创新**：客户反馈显示对智能化功能需求强烈
- **客户留存**：老客户年流失率12%，高于行业平均水平

## 3. 风险与挑战识别
1. **市场竞争加剧**：三家新竞争对手进入细分市场
2. **技术迭代压力**：核心产品技术已三年未重大更新
3. **人才短缺**：关键岗位人才流失率高达20%

## 4. 具体增长策略
**策略1：区域市场深度拓展**
- 在华南地区设立区域办事处
- 发展本地渠道合作伙伴网络
- 开展针对性市场营销活动
- **资源需求**：初始投入¥100万元，团队6人

**策略2：产品智能化升级**
- 组建专项研发团队开发智能功能
- 与高校合作引入AI技术
- 推出智能产品系列作为溢价产品
- **资源需求**：研发投入¥200万元，周期12个月

**策略3：客户成功体系建设**
- 建立客户健康度评分模型
- 实施主动式客户服务计划
- 设计客户忠诚度奖励计划
- **资源需求**：系统建设¥50万元，专职团队3人

## 5. 实施路线图建议
**第一阶段（1-3个月）**：客户成功体系试点，稳定现有客户基础
**第二阶段（4-9个月）**：华南市场试点拓展，验证区域扩张模型
**第三阶段（10-18个月）**：产品智能化升级，打造差异化竞争优势`;
  }
  
  return {
    content,
    usage: {
      input_tokens: Math.floor(request.content.length / 4),
      output_tokens: Math.floor(content.length / 4),
      total_tokens: Math.floor((request.content.length + content.length) / 4)
    },
    requestId: `sim-${Date.now()}`
  };
}

// ==================== 响应解析函数 ====================

/**
 * 解析AI响应，提取结构化信息
 * @param {string} aiResponse - AI返回的文本
 * @param {string} templateId - 模板ID
 * @returns {Object} 结构化结果
 */
function parseAIResponse(aiResponse, templateId) {
  try {
    // 提取章节
    const sections = extractSections(aiResponse);
    
    // 提取关键建议
    const recommendations = extractRecommendations(aiResponse);
    
    // 提取量化数据
    const metrics = extractMetrics(aiResponse);
    
    // 提取行动项
    const actionItems = extractActionItems(aiResponse);
    
    return {
      sections,
      recommendations,
      metrics,
      actionItems,
      summary: generateSummary(aiResponse)
    };
  } catch (error) {
    console.warn('响应解析失败，返回原始文本:', error);
    return {
      raw: aiResponse,
      error: '解析失败，请查看原始内容'
    };
  }
}

/**
 * 提取报告章节
 */
function extractSections(text) {
  const sections = [];
  const sectionRegex = /##?\s*(\d+\.\s*[^\n]+)/g;
  let match;
  
  while ((match = sectionRegex.exec(text)) !== null) {
    sections.push(match[1]);
  }
  
  return sections;
}

/**
 * 提取关键建议
 */
function extractRecommendations(text) {
  const recommendations = [];
  const recRegex = /(\*\*建议\d+\*\*|[*-]\s*建议\d*[:：]?)\s*([^\n]+)/gi;
  let match;
  
  while ((match = recRegex.exec(text)) !== null) {
    recommendations.push({
      title: match[1].trim(),
      description: match[2].trim()
    });
  }
  
  return recommendations;
}

/**
 * 提取量化指标
 */
function extractMetrics(text) {
  const metrics = [];
  const metricRegex = /([¥$]?\d+(?:\.\d+)?[%万元]*)\s*(?:节约|提升|降低|增效|占比)/g;
  let match;
  
  while ((match = metricRegex.exec(text)) !== null) {
    metrics.push(match[1]);
  }
  
  return [...new Set(metrics)]; // 去重
}

/**
 * 提取行动项
 */
function extractActionItems(text) {
  const actions = [];
  const actionRegex = /[-*]\s*([^\n]+?)(?=\n[-*]|$)/g;
  let match;
  
  while ((match = actionRegex.exec(text)) !== null) {
    const action = match[1].trim();
    if (action.length > 10 && !action.includes('建议')) {
      actions.push(action);
    }
  }
  
  return actions.slice(0, 10); // 最多返回10个
}

/**
 * 生成摘要
 */
function generateSummary(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length >= 3) {
    return lines.slice(0, 3).join(' ');
  }
  return text.substring(0, 300) + (text.length > 300 ? '...' : '');
}

// ==================== 工具函数 ====================

/**
 * 验证请求参数
 */
function validateRequest(request) {
  if (!request) {
    throw new Error('请求参数不能为空');
  }
  
  if (!request.reportType || !Object.values(ReportType).includes(request.reportType)) {
    throw new Error(`无效的报告类型: ${request.reportType}。有效值: ${Object.values(ReportType).join(', ')}`);
  }
  
  if (!request.content || request.content.trim().length < 50) {
    throw new Error('报告内容过短，至少需要50个字符');
  }
  
  if (!request.templateId || !TemplateMetadata[request.templateId]) {
    throw new Error(`无效的模板ID: ${request.templateId}`);
  }
  
  // 验证报告类型与模板匹配
  const templateMeta = TemplateMetadata[request.templateId];
  if (templateMeta.reportType !== request.reportType) {
    throw new Error(`模板${templateMeta.name}不适用于${request.reportType}类型的报告`);
  }
}

/**
 * 获取所有可用模板
 * @param {string} [reportType] - 可选，过滤指定报告类型的模板
 * @returns {Array} 模板列表
 */
export function getAvailableTemplates(reportType = null) {
  let templates = Object.entries(TemplateMetadata).map(([id, meta]) => ({
    id,
    name: meta.name,
    description: meta.description,
    reportType: meta.reportType
  }));
  
  if (reportType) {
    templates = templates.filter(t => t.reportType === reportType);
  }
  
  return templates;
}

/**
 * 获取模板详情
 * @param {string} templateId - 模板ID
 * @returns {Object} 模板详情
 */
export function getTemplateDetail(templateId) {
  const meta = TemplateMetadata[templateId];
  if (!meta) {
    throw new Error(`模板不存在: ${templateId}`);
  }
  
  return {
    id: templateId,
    name: meta.name,
    description: meta.description,
    reportType: meta.reportType,
    examplePrompt: generateUserPrompt(templateId, '[示例报告内容...]')
  };
}

// ==================== 默认导出 ====================

export default {
  ReportType,
  TemplateId,
  TemplateMetadata,
  analyzeReport,
  getAvailableTemplates,
  getTemplateDetail
};