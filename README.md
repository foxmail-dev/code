# code

## 目录内容

- docs/conversations/history: 保存了hermes agent 的对话历史;


- docs/summary/awaiter_characteristics.md: 保存了hermes agent 对 test/snippets 中所有文件中 __awaiter 代码特征的分析；


- docs/summary/conversion_solutions.md: 保存了hermes agent 将test/snippets 中所有文件中 __awaiter 调用完全转换为原生 async/await 代码的所有可行方案分析；


- scripts/awaiter-transformer: hermes agent 基于 docs/summary/conversion_solutions.md 中方案2 实现的部分代码，未完成；


- scripts/extract_snippets.js: 提取指定文件中调用了 __awaiter 辅助方法的上层 function 到单独文件中的工具；


- test/snippets: 保存了 scripts/extract_snippets.js 脚本从 src/app.js 中提取的调用了 __awaiter 的上层 function 片段；


## TODO 待办

- 基于 docs/summary/conversion_solutions.md 中方案2 完成 scripts/awaiter-transformer 的编码


