# NLP 处理能力 (Batch NLP Special Ability)

本能力基于大语言模型（LLM）提供高效的批量文本处理功能，支持将非结构化文本转化为结构化数据。请务必使用 `excel_master.llm_api` 模块进行调用。

## 核心原则

1.  **强制使用 API**：必须使用 `batch_call_llm` 函数执行 NLP 任务。严禁使用即兴的字符串匹配、正则规则或统计方法替代模型能力。
2.  **自动批处理**：该接口已内置高性能并发与批处理机制。调用者**无需**在外部手动分批（chunking）或并发调用，直接传入完整数据列表即可。

## 适用场景

| 场景 | 示例 |
| :--- | :--- |
| **文本分类 & 情感分析** | 识别评论情感倾向、工单分类、优先级判断。 |
| **信息抽取 (IE)** | 从简历、合同、新闻中提取实体（人名、日期、金额）或关系。 |
| **非结构化转结构化** | 将会议纪要转换为待办事项 JSON，将自然语言描述转换为表格数据。 |
| **文本生成 & 改写** | 批量生成商品文案、摘要、翻译或润色。 |

> **注意**：仅用于处理提供的文本数据。如需获取外部实时信息，请使用 Search Special Ability (`excel_master/abilities/batch_search_analysis.md`)；如需数值计算，请使用 Python 代码执行。

## API 定义

```python
from excel_master.llm_api import batch_call_llm
from typing import List, Dict, Any

def batch_call_llm(
    user_prompt_template: str,
    output_schema: Dict[str, Any],
    input_list: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    执行批量 LLM 调用。
    
    Args:
        user_prompt_template: 包含变量占位符(如 {text})的提示词模板。
        output_schema: 定义期望输出结构的 JSON Schema。
        input_list: 包含每条输入变量的字典列表。
        
    Returns:
        结果列表，顺序与 input_list 一致。每项包含 'success', 'data' (成功时), 'error' (失败时)。
    """
```

## 使用指南

### 步骤 1：定义输出结构 (JSON Schema)

明确任务输出的数据结构。Schema 应严格遵循 JSON Schema 规范。

*   **原则**：尽量简化，使用 `enum` 限制特定值，使用 `required` 确保关键字段存在。

**示例（情感分析）：**
```python
output_schema = {
    "type": "object",
    "properties": {
        "sentiment": {
            "type": "string", 
            "enum": ["POSITIVE", "NEUTRAL", "NEGATIVE"],
            "description": "文本的情感倾向"
        },
        "score": {
            "type": "number", 
            "description": "情感置信度 0-1"
        },
        "tags": {
            "type": "array",
            "items": {"type": "string"},
            "description": "涉及的主题标签"
        }
    },
    "required": ["sentiment", "score"],
    "additionalProperties": False
}
```

### 步骤 2：设计提示词模板 (Prompt Template)

编写清晰的指令，并使用 `{variable}` 语法标记输入变量。

**示例：**
```python
prompt_template = """
请分析以下用户评论的情感倾向。

评论内容：
"{content}"

任务要求：
1. 识别情感倾向（POSITIVE, NEUTRAL, NEGATIVE）。
2. 给出 0-1 之间的置信度分数。
3. 提取 1-3 个主题标签。
"""
```

### 步骤 3：准备数据并调用

构造输入列表（`input_list`），确保字典中的键与模板变量名一致。

```python
from excel_master.llm_api import batch_call_llm

# 1. 准备数据
raw_comments = [
    "产品非常好用，物流也快！",
    "质量一般，感觉不值这个价。",
    "还可以吧，中规中矩。"
]
input_list = [{"content": text} for text in raw_comments]

# 2. 调用 API
results = batch_call_llm(
    user_prompt_template=prompt_template,
    output_schema=output_schema,
    input_list=input_list
)

# 3. 处理结果
for i, res in enumerate(results):
    if res["success"]:
        data = res["data"]
        print(f"评论[{i}]: 情感={data['sentiment']}, 分数={data['score']}")
    else:
        print(f"评论[{i}] 处理失败: {res['error']}")
```

## 最佳实践

1.  **Schema 约束**：总是通过 `enum` 和 `description` 在 Schema 中提供具体的业务含义，这比单纯在 Prompt 中描述更稳定。
2.  **变量一致性**：检查 `input_list` 中的 keys 是否完全覆盖了 `user_prompt_template` 中的 `{placeholders}`。
3.  **错误处理**：API 返回的 `success` 字段是处理单一错误的依据。不要假设所有请求都会成功，应妥善处理 `error` 情况。
