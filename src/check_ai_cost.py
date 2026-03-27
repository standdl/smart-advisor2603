import pandas as pd
df = pd.read_excel('docs/财务模型.xlsx', sheet_name='AI月成本估算')
print("AI月成本估算工作表:")
print(df.head())
print("\n关键发现:")
print(f"1. 最具性价比: {df.loc[df['月总成本(元)'].idxmin()]['服务商']} ({df['月总成本(元)'].min():.2f}元/月)")
print(f"2. 最昂贵: {df.loc[df['月总成本(元)'].idxmax()]['服务商']} ({df['月总成本(元)'].max():.2f}元/月)")
print(f"3. 单次诊断成本范围: {df['单次诊断成本(元)'].min():.4f} - {df['单次诊断成本(元)'].max():.4f} 元")