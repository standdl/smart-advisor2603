/**
 * 文件上传模拟API接口
 * 
 * 该模块提供模拟的文件上传和处理功能，支持Excel和PDF文件的内容提取。
 * 在真实环境中，这些函数将由后端API实现，目前为前端开发提供模拟数据。
 */

/**
 * 模拟文件上传API响应
 * @param {File} file - 用户上传的文件对象
 * @param {string} moduleType - 诊断模块类型 ('cost' | 'growth')
 * @returns {Promise<object>} 模拟API响应
 */
export async function uploadFile(file, moduleType) {
  console.log(`模拟上传: ${file.name}, 模块: ${moduleType}, 大小: ${file.size} bytes`);
  
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 提取文件内容（模拟）
  const extractedContent = await extractFileContent(file);
  
  // 生成模拟报告ID
  const reportId = Date.now();
  
  // 模拟保存文件到服务器
  const savedFilePath = await saveFileToServer(file, reportId);
  
  return {
    success: true,
    message: '文件上传成功',
    data: {
      reportId,
      fileName: file.name,
      fileSize: file.size,
      module: moduleType,
      extractedContent,
      savedFilePath,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 根据文件类型提取内容（模拟实现）
 * @param {File} file - 文件对象
 * @returns {Promise<object>} 提取的内容
 */
async function extractFileContent(file) {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return extractPDFContent(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm')) {
    return extractExcelContent(file);
  } else {
    throw new Error(`不支持的文件格式: ${file.name}`);
  }
}

/**
 * 模拟提取PDF文件内容
 * @param {File} file - PDF文件
 * @returns {Promise<object>} 提取的文本内容
 */
async function extractPDFContent() {
  // 在实际环境中，这里会使用pdf-parse或类似的库来提取文本
  // 模拟返回一些示例文本
  
  const mockText = `财务报表分析报告

公司名称：XX科技有限公司
报告期间：2025年第四季度

一、财务状况概览
1. 资产总额：¥15,820,000
2. 负债总额：¥8,450,000
3. 净资产：¥7,370,000
4. 营业收入：¥12,500,000
5. 净利润：¥2,340,000

二、关键指标
1. 流动比率：1.85
2. 资产负债率：53.4%
3. 毛利率：28.7%
4. 净利率：18.7%
5. 存货周转率：6.2次

三、经营分析
公司整体财务状况良好，盈利能力稳定。建议关注存货周转效率，进一步优化供应链管理。`;
  
  return {
    type: 'pdf',
    textContent: mockText,
    pageCount: 8,
    extractionMethod: '模拟提取 - 实际环境中使用pdf-parse库'
  };
}

/**
 * 模拟提取Excel文件内容
 * @param {File} file - Excel文件
 * @returns {Promise<object>} 提取的表格数据
 */
async function extractExcelContent() {
  // 在实际环境中，这里会使用xlsx库来解析Excel文件
  // 模拟返回一些示例数据
  
  const mockSheets = [
    {
      name: '利润表',
      data: [
        ['项目', '2025年Q4', '2025年Q3', '环比变化'],
        ['营业收入', '12,500,000', '11,200,000', '+11.6%'],
        ['营业成本', '8,910,000', '8,050,000', '+10.7%'],
        ['毛利润', '3,590,000', '3,150,000', '+14.0%'],
        ['毛利率', '28.7%', '28.1%', '+0.6%'],
        ['销售费用', '650,000', '580,000', '+12.1%'],
        ['管理费用', '420,000', '390,000', '+7.7%'],
        ['研发费用', '280,000', '250,000', '+12.0%'],
        ['营业利润', '2,240,000', '1,930,000', '+16.1%'],
        ['净利润', '2,340,000', '2,010,000', '+16.4%']
      ]
    },
    {
      name: '资产负债表',
      data: [
        ['项目', '2025年Q4', '2025年Q3'],
        ['货币资金', '2,450,000', '2,100,000'],
        ['应收账款', '3,820,000', '3,450,000'],
        ['存货', '2,150,000', '2,350,000'],
        ['流动资产合计', '8,420,000', '7,900,000'],
        ['固定资产', '5,200,000', '5,250,000'],
        ['无形资产', '2,200,000', '2,200,000'],
        ['非流动资产合计', '7,400,000', '7,450,000'],
        ['资产总计', '15,820,000', '15,350,000'],
        ['短期借款', '1,500,000', '1,500,000'],
        ['应付账款', '2,850,000', '2,600,000'],
        ['流动负债合计', '4,550,000', '4,350,000'],
        ['长期借款', '3,900,000', '4,000,000'],
        ['负债合计', '8,450,000', '8,350,000'],
        ['实收资本', '5,000,000', '5,000,000'],
        ['未分配利润', '2,370,000', '2,000,000'],
        ['所有者权益合计', '7,370,000', '7,000,000']
      ]
    },
    {
      name: '现金流量表',
      data: [
        ['项目', '2025年Q4'],
        ['经营活动现金流入', '13,200,000'],
        ['经营活动现金流出', '10,850,000'],
        ['经营活动现金流量净额', '2,350,000'],
        ['投资活动现金流入', '450,000'],
        ['投资活动现金流出', '1,200,000'],
        ['投资活动现金流量净额', '-750,000'],
        ['筹资活动现金流入', '500,000'],
        ['筹资活动现金流出', '800,000'],
        ['筹资活动现金流量净额', '-300,000'],
        ['现金及等价物净增加额', '1,300,000'],
        ['期初现金余额', '1,150,000'],
        ['期末现金余额', '2,450,000']
      ]
    }
  ];
  
  return {
    type: 'excel',
    sheets: mockSheets,
    sheetCount: mockSheets.length,
    extractionMethod: '模拟提取 - 实际环境中使用xlsx库'
  };
}

/**
 * 模拟保存文件到服务器
 * @param {File} file - 文件对象
 * @param {number} reportId - 报告ID
 * @returns {Promise<string>} 保存的文件路径
 */
async function saveFileToServer(file, reportId) {
  // 在实际环境中，这里会将文件保存到服务器文件系统或云存储
  // 模拟返回一个文件路径
  
  const timestamp = new Date().getTime();
  const extension = file.name.split('.').pop();
  const fileName = `upload_${reportId}_${timestamp}.${extension}`;
  const filePath = `temp/uploads/${fileName}`;
  
  console.log(`模拟保存文件到: ${filePath}`);
  
  // 在实际环境中，这里会使用fs.writeFileSync或类似方法保存文件
  // 模拟中我们只返回路径
  
  return filePath;
}

/**
 * 模拟获取历史报告
 * @returns {Promise<Array>} 历史报告列表
 */
export async function getHistoryReports() {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      name: '2025年Q4财务报告',
      date: '2026-03-20 14:30',
      module: 'cost',
      fileType: 'xlsx',
      size: '2.4MB',
      reportId: 123456
    },
    {
      id: 2,
      name: '2025年12月经营报告',
      date: '2026-03-18 09:15',
      module: 'growth',
      fileType: 'pdf',
      size: '1.8MB',
      reportId: 123455
    },
    {
      id: 3,
      name: '2025年Q3财务分析',
      date: '2026-03-10 11:20',
      module: 'cost',
      fileType: 'xlsx',
      size: '2.1MB',
      reportId: 123454
    }
  ];
}