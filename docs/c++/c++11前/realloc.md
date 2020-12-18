---
title: realloc
date: 2020-12-10
sidebarDepth: 2
tags:
 - realloc
 - 内存管理
categories:
 - C++
---
# realloc
- 功能：在原先内存分配地址上重新分配内存大小
- 函数声明：`void* realloc( void* ptr, std::size_t new_size );`
  - `ptr`是传入的指针,`std::malloc()`、`std::calloc()` 或 `std::realloc()` 先前分配的，且仍未被 `std::free()` 释放
  - new_size是需要分配的内存大小
- 示例
```c++
int main()
{
    int* p = new int(2);
    //重新分配2个int大小内存
    void* pv = realloc(p, 2*sizeof(int));
    p = static_cast<int*>(pv);
    //给第2个int赋值3
    p[1]=3;
    int* p2 = p + 1;
    //释放资源
    free(p);
}
```