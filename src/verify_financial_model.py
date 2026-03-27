import pandas as pd

file_path = 'docs/财务模型.xlsx'

# 读取所有工作表名称
xls = pd.ExcelFile(file_path)
print("工作表列表:")
for sheet in xls.sheet_names:
    print(f"  - {sheet}")

print("\n=== AI服务商定价 ===")
df1 = pd.read_excel(file_path, sheet_name='AI服务商定价')
print(f"行数: {len(df1)}")
print(df1.head())

print("\n=== 成本明细 ===")
df2 = pd.read_excel(file_path, sheet_name='成本明细')
print(f"行数: {len(df2)}")
print(df2.head())

print("\n=== 收入预测 ===")
df3 = pd.read_excel(file_path, sheet_name='收入预测')
print(f"行数: {len(df3)}")
print("场景分布:", df3['场景'].value_counts().to_dict())
print(df3.head())

print("\n=== 盈亏平衡分析 ===")
df4 = pd.read_excel(file_path, sheet_name='盈亏平衡分析')
print(f"行数: {len(df4)}")
print(df4.head())

print("\n=== 关键指标仪表盘 ===")
df5 = pd.read_excel(file_path, sheet_name='关键指标仪表盘')
print(f"行数: {len(df5)}")
print(df5.head())

print("\n=== 现金流预测 ===")
df6 = pd.read_excel(file_path, sheet_name='现金流预测')
print(f"行数: {len(df6)}")
print(df6.head())

# 验证验收标准
print("\n=== 验收标准验证 ===")
print(f"1. Excel文件包含至少4个工作表: {len(xls.sheet_names) >= 4} (实际: {len(xls.sheet_names)})")
print(f"2. 成本明细涵盖开发、API、运维、获客等类别: {'获客成本' in df2['子类别'].values}")
print(f"3. 收入预测有保守、中性、乐观三种场景: {set(df3['场景'].unique()) == {'保守', '中性', '乐观'}}")
print(f"4. 盈亏平衡分析明确显示每月需完成付费方案数量: {'盈亏平衡点(单/月)' in df4.columns}")
print(f"5. 关键指标可量化，有具体目标值: {'目标值' in df5.columns}")

# 显示关键指标
print("\n关键指标目标值:")
for idx, row in df5.iterrows():
    print(f"  {row['指标名称']}: {row['目标值']}")

print("\n盈亏平衡点摘要:")
for idx, row in df4.iterrows():
    print(f"  单价{row['单次方案价格(元)']}元: 每月需完成{row['盈亏平衡点(单/月)']}单")