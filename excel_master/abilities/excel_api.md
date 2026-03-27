# Excel API 能力 (Excel API Special Ability)

本能力提供一套高效的 Python 接口，用于读取和处理 Excel (.xlsx) 文件。它封装了 `openpyxl` 的核心功能，旨在简化常见的数据读取、搜索、区域复制和行删除操作。

请使用 `excel_master.excel_api` 模块进行调用。

## 核心原则

1.  **文件格式限制**：仅支持 `.xlsx` 格式。不支持旧版 `.xls` 格式（如需处理 .xls，请使用 pandas 配合 xlrd）。
2.  **读写模式**：本 API 主要设计用于**读取**数据和结构。虽然支持行删除和区域复制等修改操作，但它不提供创建图表、设置复杂样式的能力。
3.  **性能优化**：在处理大文件时，务必遵循下文提到的性能最佳实践（如批量删除行）。

## 核心类与方法

```python
from excel_master.excel_api import Workbook, Worksheet, General
```

### 1. 工作簿 (Workbook)

管理 Excel 文件的打开、保存和关闭。

| 方法 | 说明 |
| :--- | :--- |
| `Workbook(path)` | 打开现有的 .xlsx 文件。 |
| `wb.get_sheet(index_or_name)` | 获取工作表对象 (`Worksheet`)。 |
| `wb.get_sheet_names()` | 获取所有工作表名称列表。 |
| `wb.save(path)` | 保存更改到文件。 |
| `wb.close()` | 关闭文件句柄，释放资源。 |

### 2. 工作表 (Worksheet)

执行具体的单元格数据操作。

#### 数据读取

```python
# 获取单个单元格的值
# calc_formula=True: 计算公式结果 (推荐)
# calc_formula=False: 获取公式字符串 (如 "=SUM(A1:A5)")
value = sheet.get_raw_cell_data("A1", calc_formula=True)

# 获取区域数据 (返回二维列表)
data = sheet.get_raw_range_data("A1:C10", calc_formula=True)
# 返回: [[1, "name", 100], [2, "age", 200], ...]
```

#### 数据搜索

```python
# 使用正则表达式搜索单元格
# 返回包含 "address" (如 "B2") 和 "value" 的字典列表
results = sheet.regex_search(
    patterns=[r"^ID-\d{4}$", r"Error"], 
    match_case=False
)
```

#### 行操作（删除与上移）

```python
# 1. 获取某列有数据的最大行号 (性能优化关键)
max_row = sheet.get_max_row_with_data_in_column("A")

# 2. 删除指定区域并上移下方单元格
# 注意：这将物理删除行，下方数据会自动填充上来
sheet.shift_up_cells("A5:E10", max_row)
```

#### 格式调整

```python
# 自动调整列宽以适应内容
sheet.auto_resize_columns()
```

### 3. 通用工具 (General)

用于跨工作簿操作。

```python
# 跨工作簿复制区域 (保留值与样式)
General.copy_range_from_workbook(
    from_workbook=source_wb,
    from_range="Sheet1!A1:D20",  # 必须包含 Sheet 名
    to_workbook=target_wb,
    to_range="Data!A1"           # 目标只需指定左上角
)
```

## 最佳实践与性能指南

### 1. 批量删除行 (Critical)

严禁在循环中逐行调用 `shift_up_cells`，这会导致极严重的性能问题（O(N^2) 复杂度）。
**正确做法**：先计算出需要删除的行范围，合并为尽可能少的连续区域，然后调用删除。

**错误示例 ❌**：
```python
for row in [5, 6, 7, 10]:
    sheet.shift_up_cells(f"A{row}:Z{row}", max_row)
```

**正确示例 ✅**：
```python
# 合并为 ["A5:Z7", "A10:Z10"]
ranges = ["A5:Z7", "A10:Z10"]
# 从底部开始删除，防止索引偏移
for r in reversed(ranges):
    sheet.shift_up_cells(r, max_row)
```

### 2. 公式计算依赖

如果设置 `calc_formula=True`，读取的值依赖于 Excel 上次保存时的缓存计算值。
如果通过 API 修改了数据但未手动触发重算（Excel API 不会自动运行 Excel 计算引擎），读取的公式值可能过时。
**建议**：主要用于读取静态数据。如果必须处理复杂公式链，建议使用代码执行中的 pandas 进行数值计算。

### 3. 资源管理

操作完成后，务必调用 `wb.close()` 以释放文件锁定和内存。

## 常见代码模板

### 任务：从源文件提取符合条件的数据并存入新文件

```python
from excel_master.excel_api import Workbook, General

# 1. 打开源文件
src_wb = Workbook("source_data.xlsx")
src_sheet = src_wb.get_sheet("Sales")

# 2. 搜索特定订单
matches = src_sheet.regex_search([r"ORD-2024-\d+"])

# 3. 准备目标文件
tgt_wb = Workbook() # 创建新文件
tgt_sheet = tgt_wb.get_sheet(0)

# 4. 复制匹配行 (示例逻辑)
# 实际场景建议先计算行号，然后合并复制，或使用 pandas 处理筛选逻辑
if matches:
    first_match_row = matches[0]['address'][1:] # 假设是 A1 格式，取行号
    General.copy_range_from_workbook(
        from_workbook=src_wb,
        from_range=f"Sales!A{first_match_row}:F{first_match_row}",
        to_workbook=tgt_wb,
        to_range="Sheet1!A1"
    )

tgt_wb.save("filtered_orders.xlsx")
src_wb.close()
tgt_wb.close()
```