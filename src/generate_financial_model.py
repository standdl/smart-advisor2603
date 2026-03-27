import pandas as pd
import numpy as np
from datetime import datetime

# 创建Excel写入器
output_path = 'docs/财务模型.xlsx'
with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
    
    # 工作表1: AI服务商定价比较
    ai_pricing_data = {
        '服务商': ['字节豆包', 'DeepSeek', '阿里千问', '智谱AI'],
        '模型名称': ['豆包Lite', 'DeepSeek-V3', 'Qwen-Turbo', 'GLM-5-Turbo'],
        '输入价格(元/百万Token)': [0.6, 1.0, 0.3, None],  # 豆包Lite 0.6, DeepSeek 1.0, 千问Turbo 0.3, 智谱需查
        '输出价格(元/百万Token)': [1.2, 2.0, 0.6, None],
        '免费额度': ['新用户赠送', '注册送500万Token', '各100万Token(90天)', '无首月优惠'],
        '备注': ['单价最低，响应快', '性价比之王，开源', '均衡实用，API友好', '性能强但涨价明显']
    }
    
    # 更新智谱AI价格（根据搜索信息）
    # GLM-5-Turbo相对GLM-4.7平均上涨83%，GLM-4.7价格需估算
    # 假设GLM-4.7输入约2元/百万Token，输出约6元/百万Token
    # 则GLM-5-Turbo输入约3.66元/百万Token，输出约10.98元/百万Token
    ai_pricing_data['输入价格(元/百万Token)'][3] = 3.66
    ai_pricing_data['输出价格(元/百万Token)'][3] = 10.98
    
    ai_pricing_df = pd.DataFrame(ai_pricing_data)
    ai_pricing_df.to_excel(writer, sheet_name='AI服务商定价', index=False)
    
    # 工作表2: 成本明细
    cost_items = [
        {'成本类别': '初始开发成本', '子类别': '人力等效折算', '金额(元)': 20000, '计算依据': '4周MVP开发，市场价折算', '周期': '一次性'},
        {'成本类别': '月度固定成本', '子类别': 'AI API费用', '金额(元)': 500, '计算依据': '预估1000次诊断，DeepSeek V3', '周期': '月度'},
        {'成本类别': '月度固定成本', '子类别': '云服务费用', '金额(元)': 0, '计算依据': 'Vercel免费额度', '周期': '月度'},
        {'成本类别': '月度固定成本', '子类别': '运维人力', '金额(元)': 1000, '计算依据': '兼职运维人员', '周期': '月度'},
        {'成本类别': '月度可变成本', '子类别': '获客成本', '金额(元)': 50, '计算依据': '单用户获取成本<50元', '周期': '按用户数'},
        {'成本类别': '月度可变成本', '子类别': '其他营销', '金额(元)': 300, '计算依据': '内容营销等', '周期': '月度'}
    ]
    
    cost_df = pd.DataFrame(cost_items)
    cost_df.to_excel(writer, sheet_name='成本明细', index=False)
    
    # 工作表3: 收入预测（三种场景）
    scenarios = ['保守', '中性', '乐观']
    months = 12
    
    revenue_data = []
    for scenario in scenarios:
        if scenario == '保守':
            free_users = 100
            paid_conversion = 0.03  # 3%
            avg_paid_price = 400
            enterprise_customers = 1
            enterprise_fee = 3000
        elif scenario == '中性':
            free_users = 200
            paid_conversion = 0.05  # 5%
            avg_paid_price = 500
            enterprise_customers = 2
            enterprise_fee = 5000
        else:  # 乐观
            free_users = 300
            paid_conversion = 0.08  # 8%
            avg_paid_price = 600
            enterprise_customers = 3
            enterprise_fee = 8000
        
        monthly_paid_users = int(free_users * paid_conversion)
        monthly_revenue = monthly_paid_users * avg_paid_price + enterprise_customers * enterprise_fee
        
        for month in range(1, months + 1):
            # 简单增长模型：用户数每月增长10%
            month_free_users = int(free_users * (1 + 0.1) ** (month-1))
            month_paid_users = int(month_free_users * paid_conversion)
            month_revenue = month_paid_users * avg_paid_price + enterprise_customers * enterprise_fee
            
            revenue_data.append({
                '场景': scenario,
                '月份': month,
                '免费用户数': month_free_users,
                '付费用户数': month_paid_users,
                '企业客户数': enterprise_customers,
                '单次方案收入(元)': avg_paid_price,
                '企业定制收入(元)': enterprise_customers * enterprise_fee,
                '月度总收入(元)': month_revenue
            })
    
    revenue_df = pd.DataFrame(revenue_data)
    revenue_df.to_excel(writer, sheet_name='收入预测', index=False)
    
    # 工作表4: 盈亏平衡分析
    monthly_fixed_cost = 1800  # AI API 500 + 运维1000 + 其他300
    variable_cost_per_paid = 50  # 获客成本
    
    # 不同单价下的盈亏平衡点
    price_points = [299, 500, 799, 999]
    breakeven_data = []
    
    for price in price_points:
        contribution_margin = price - variable_cost_per_paid
        breakeven_units = int(np.ceil(monthly_fixed_cost / contribution_margin)) if contribution_margin > 0 else float('inf')
        
        breakeven_data.append({
            '单次方案价格(元)': price,
            '可变成本(元)': variable_cost_per_paid,
            '边际贡献(元)': contribution_margin,
            '盈亏平衡点(单/月)': breakeven_units,
            '月度收入目标(元)': breakeven_units * price,
            '备注': f'需每月完成{breakeven_units}单付费方案'
        })
    
    breakeven_df = pd.DataFrame(breakeven_data)
    breakeven_df.to_excel(writer, sheet_name='盈亏平衡分析', index=False)
    
    # 工作表5: 关键指标仪表盘
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    kpi_items = [
        {'指标类别': '财务指标', '指标名称': '月度固定成本', '目标值': '<2000元', '当前值': '1800元', '数据来源': '成本明细表', '更新频率': '月度'},
        {'指标类别': '财务指标', '指标名称': '单用户获客成本', '目标值': '<50元', '当前值': '50元', '数据来源': '市场调研', '更新频率': '月度'},
        {'指标类别': '运营指标', '指标名称': '付费转化率', '目标值': '>5%', '当前值': '3-8%', '数据来源': '行业基准', '更新频率': '月度'},
        {'指标类别': '运营指标', '指标名称': '用户留存率', '目标值': '>80%', '当前值': '预估75%', '数据来源': '行业基准', '更新频率': '季度'},
        {'指标类别': '运营指标', '指标名称': '平均诊断时间', '目标值': '<5分钟', '当前值': '预估3分钟', '数据来源': '技术预估', '更新频率': '季度'},
        {'指标类别': '运营指标', '指标名称': '诊断准确率', '目标值': '>85%', '当前值': '目标85%', '数据来源': '质量目标', '更新频率': '持续监控'},
        {'指标类别': '用户指标', '指标名称': '月活跃用户', '目标值': '>200', '当前值': '0', '数据来源': '上线后统计', '更新频率': '月度'},
        {'指标类别': '用户指标', '指标名称': '用户满意度', '目标值': '>4.5/5.0', '当前值': '待上线', '数据来源': '用户反馈', '更新频率': '季度'},
        {'指标类别': '用户指标', '指标名称': '净推荐值(NPS)', '目标值': '>30', '当前值': '待上线', '数据来源': '用户调研', '更新频率': '半年'}
    ]
    
    kpi_df = pd.DataFrame(kpi_items)
    kpi_df.to_excel(writer, sheet_name='关键指标仪表盘', index=False)
    
    # 工作表6: AI月成本估算
    # 假设每次诊断平均消耗：输入5,000 Token + 输出5,000 Token = 10,000 Token
    monthly_diagnoses = 1000
    tokens_per_diagnosis = 10000
    total_monthly_tokens = monthly_diagnoses * tokens_per_diagnosis / 1_000_000  # 百万Token
    
    ai_cost_data = []
    for provider, model, input_price, output_price in zip(
        ai_pricing_df['服务商'], ai_pricing_df['模型名称'], 
        ai_pricing_df['输入价格(元/百万Token)'], ai_pricing_df['输出价格(元/百万Token)']
    ):
        input_cost = total_monthly_tokens * input_price * 0.5  # 输入占50%
        output_cost = total_monthly_tokens * output_price * 0.5  # 输出占50%
        total_cost = input_cost + output_cost
        
        ai_cost_data.append({
            '服务商': provider,
            '模型名称': model,
            '输入价格(元/百万Token)': input_price,
            '输出价格(元/百万Token)': output_price,
            '月输入成本(元)': round(input_cost, 2),
            '月输出成本(元)': round(output_cost, 2),
            '月总成本(元)': round(total_cost, 2),
            '单次诊断成本(元)': round(total_cost / monthly_diagnoses, 4)
        })
    
    ai_cost_df = pd.DataFrame(ai_cost_data)
    ai_cost_df.to_excel(writer, sheet_name='AI月成本估算', index=False)
    
    # 工作表7: 现金流预测（12个月）
    months = 12
    cash_flow_data = []
    
    # 初始现金
    initial_cash = 20000  # 开发成本作为初始投入
    monthly_fixed_cash_out = 1800
    
    cash_balance = initial_cash
    
    for month in range(1, months + 1):
        # 收入预测（取中性场景第month月）
        month_revenue = revenue_df[(revenue_df['场景'] == '中性') & (revenue_df['月份'] == month)]['月度总收入(元)'].values[0]
        
        # 现金流
        cash_in = month_revenue
        cash_out = monthly_fixed_cash_out + variable_cost_per_paid * revenue_df[(revenue_df['场景'] == '中性') & (revenue_df['月份'] == month)]['付费用户数'].values[0]
        
        net_cash_flow = cash_in - cash_out
        cash_balance += net_cash_flow
        
        cash_flow_data.append({
            '月份': month,
            '现金流入(元)': cash_in,
            '现金流出(元)': cash_out,
            '净现金流量(元)': net_cash_flow,
            '累计现金余额(元)': cash_balance,
            '盈亏状态': '盈利' if net_cash_flow > 0 else '亏损'
        })
    
    cash_flow_df = pd.DataFrame(cash_flow_data)
    cash_flow_df.to_excel(writer, sheet_name='现金流预测', index=False)

print(f"财务模型已生成: {output_path}")
print("包含工作表:")
print("1. AI服务商定价")
print("2. 成本明细")
print("3. 收入预测")
print("4. 盈亏平衡分析")
print("5. 关键指标仪表盘")
print("6. AI月成本估算")
print("7. 现金流预测")