# 搜索分析能力 (Batch Search & Analysis Special Ability)

本能力集成了**网络搜索**与**LLM 分析**功能。它能批量自动执行搜索查询，并利用大模型阅读搜索结果，从中提取特定的结构化信息。

请务必使用 `excel_master.web_search_api` 模块进行调用。

## 核心原则

1.  **强制使用 API**：必须使用 `batch_search_and_analyze` 函数。严禁手动循环执行“搜索-读取-分析”流程。
2.  **批量优化**：接口已针对搜索引擎限流（Rate Limit）和并发（Concurrency）进行了完整优化。只需传入完整输入列表，无需外部手动分批。
3.  **信息检索非数据采集**：此工具用于“获取信息（Information Retrieval）”而非“大规模爬虫（Scraping）”。适用于调研、核实事实、获取最新动态，不适用于抓取海量历史股价或电商SKU数据。

## 适用场景

| 场景 | 示例 |
| :--- | :--- |
| **实时信息查询** | 查询最新的股价、天气、汇率或新闻事件。 |
| **技术/市场调研** | 调研多个竞品的功能对比、技术概念定义、行业趋势。 |
| **事实核查** | 验证多个声明的真实性（Fact Checking）。 |
| **教程与文档检索** | 查找特定工具的使用方法或官方文档摘要。 |

## API 定义

```python
from excel_master.web_search_api import batch_search_and_analyze
from typing import List, Dict, Any

def batch_search_and_analyze(
    query_template: str,
    analysis_prompt_template: str,
    output_schema: Dict[str, Any],
    input_list: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    执行批量搜索并分析结果。
    
    Args:
        query_template: 搜索关键词模板（如 "{product} 价格"）。
        analysis_prompt_template: 用于分析搜索结果的 Prompt 模板。必须包含 {search_results} 占位符。
        output_schema: 定义最终分析结果结构的 JSON Schema。
        input_list: 包含每条任务输入变量的字典列表。
        
    Returns:
        结果列表，每项包含 'success', 'data' (符合 schema 的结构化数据), 'error'。
    """
```

## 使用指南

### 流程概览

1.  **构建查询 (Query)**：系统根据 `input_list` 和 `query_template` 生成搜索关键词。
2.  **执行搜索 (Search)**：并发执行网络搜索，获取摘要和链接。
3.  **智能分析 (Analyze)**：将搜索结果注入 `analysis_prompt_template`，令 LLM 提取目标信息。
4.  **结构化输出 (Output)**：返回符合 `output_schema` 的 JSON 数据。

### 详细步骤

#### 步骤 1：设计查询模板 (Query Template)

设计能精准命中目标的搜索关键词。尽量包含核心实体和意图关键词。

*   **推荐**：`"{entity} latest version release notes"`
*   **避免**：`"Help me find the latest version of {entity}"` (不要使用自然语言问句，使用关键词)

#### 步骤 2：设计分析提示词 (Analysis Prompt)

指导 LLM 如何从搜索结果中提取信息。

*   **必须包含**：`{search_results}` 占位符（API 会自动填入搜索到的内容）。
*   **必须包含**：任务中其他的上下文变量（如 `{entity}`）。

**示例：**
```python
analysis_prompt_template = """
基于以下搜索结果，总结关于 {entity} 的信息。

搜索结果：
{search_results}

任务：
1. 提取该技术的最新版本号。
2. 总结其核心新特性（3点以内）。
3. 查找发布日期。
"""
```

#### 步骤 3：定义输出 Schema

定义你希望获得的结构化数据格式。

```python
output_schema = {
    "type": "object",
    "properties": {
        "entity": {"type": "string"},
        "version": {"type": "string"},
        "release_date": {"type": "string"},
        "features": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["entity", "version"],
    "additionalProperties": False
}
```

#### 步骤 4：准备数据并执行

```python
from excel_master.web_search_api import batch_search_and_analyze

# 1. 准备输入列表
entities = ["Python 3.12", "Django 5.0", "React 19"]
input_list = [{"entity": name} for name in entities]

# 2. 定义模板
query_template = "{entity} latest features release date"

# 3. 调用 API
results = batch_search_and_analyze(
    query_template=query_template,
    analysis_prompt_template=analysis_prompt_template,  # 见上文定义
    output_schema=output_schema,                        # 见上文定义
    input_list=input_list
)

# 4. 消费结果
for res in results:
    if res["success"]:
        data = res["data"]
        print(f"[{data['entity']}] 版本: {data['version']}, 日期: {data.get('release_date')}")
        print(f"特性: {data.get('features')}")
    else:
        print(f"搜索/分析失败: {res['error']}")
```

## 最佳实践

1.  **关键词优化**：搜索结果的质量直接决定最终产出的质量。如果分析结果不准确，首先尝试优化 `query_template`。
2.  **来源追溯**：虽然 Schema 示例中未展示，但建议在 Schema 中增加 `source_url` 字段，并要求 LLM 在 Prompt 中从搜索结果中提取来源链接，以便人工核查。
3.  **处理空结果**：网络搜索可能无结果，或者结果不相关。Prompt 应包含“如果找不到信息，请返回 null/空字符串”的指令，防止 LLM 产生幻觉。
