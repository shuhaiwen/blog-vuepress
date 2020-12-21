---
title: for Range新特性
date: 2020-12-21
sidebarDepth: 2
tags:
 - for Range新特性
 - for
categories:
 - C++20
 - C++17
---
- [for Range新特性](#for-range新特性)
  - [for 结构化绑定](#for-结构化绑定)
  - [for Range初始化语句](#for-range初始化语句)
# for Range新特性
## for 结构化绑定
- 功能：结合c++17机构化绑定使用
```c++
#include <iostream>
#include <map>
int main(){
  std::map<int, std::string> mp = { {1,"1"},{2,"2"} };
  for (auto&& [first,second] : mymap) {
    // 使用 first 和 second
  }
}

```
## for Range初始化语句
- 功能：在for的`()`内进行初始化
- 示例
```c++
#include <iostream>
#include <vector>
int main() {
	for (auto vec = std::vector{ 1, 2, 3 }; auto v : vec) {
		std::cout << v << " ";
	}
}
```
