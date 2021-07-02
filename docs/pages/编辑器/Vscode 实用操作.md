---
title: Vscode 实用快捷键
date: 2020-06-30
sidebarDepth: 2
tags:
 - Vscode
 - 快捷键
categories:
 - Editor
---

# Vscode 实用快捷键

1. 打开当前文件所在的文件夹 [Shift+Alt+R]
2. 后退/前进操作 [Alt+ <- ]/[Alt+ ->]
3. 打开命令面板 [Ctrl+Shirf+P] [F1]

## 插件使用
### Clang-Format
- 功能：代码格式化
- 配置：
  1. 在Executable选项下设置clang-format的可执行文件路径。（如果已安装C/C++插件可在此插件安装目录下查找，否则需要去手动下载）
  2. 在Style选项下可选择格式化风格（Google，LLVM等）或者使用.clang-format文件。
  3. 针对使用.clang-format文件，可通过命令生成.clang-format文件（clang-format -style=Google -dump-config > .clang-format）
- .clang-format文件编写
</br>
[参考](https://clang.llvm.org/docs/ClangFormatStyleOptions.html)https://clang.llvm.org/docs/ClangFormatStyleOptions.html
