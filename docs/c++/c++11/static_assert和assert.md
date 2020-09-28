---
title: static_assert和assert
date: 2020-09-28
sidebarDepth: 2
tags:
 - static_assert
 - assert
categories:
 - C++11
---

# static_assert和assert
- 功能:
  - static_assert进行编译时断言检查
- 区别：
  - static_assert是关键字，而assert是宏
  - assert进行运行期检查，而static_assert在编译期检查
- 示例
```c++
#include<assert.h>
int main()
{
    //assert不会在编译期报错，只有运行程序时，执行到这一步采取检查assert中表达式的值
    assert(1 + 2 < 2);
    //static_assert会在编译期检查，如vs会立即报错提示
    static_assert(1 + 2 < 2, "1+2>2");    
}
```
- assert源码分析:当在程序中定义NDEBUG宏时，assert宏辉展开成`(void)0`,这可以使assert不产生任何断言作用。assert展开后先执行`!!(expression)`表达式，如果真，则得`(void)true`,否则，执行`(_wassert(_CRT_WIDE(#expression), _CRT_WIDE(__FILE__), (unsigned)(__LINE__)), 0)`,其中`_wassert`函数作用是将错误信息打印在控制台，并调用`std::abort()`终止程序。`,0`的作用是利用逗号表达式的特性使assert宏执行后产生`(void)0`结果
```c++
#ifdef NDEBUG

    #define assert(expression) ((void)0)

#else

    _ACRTIMP void __cdecl _wassert(
        _In_z_ wchar_t const* _Message,
        _In_z_ wchar_t const* _File,
        _In_   unsigned       _Line
        );

    #define assert(expression) (void)(                                                       \
            (!!(expression)) ||                                                              \
            (_wassert(_CRT_WIDE(#expression), _CRT_WIDE(__FILE__), (unsigned)(__LINE__)), 0) \
        )

#endif
```
-----------------------------
*注意：*`(void)0`的作用使表达式仅仅可执行，却不能作为左值或右值，如`int i=(void)(1+2);`将会报错，表达式`1+2`会执行得到3，但这个值经过`void`强制转为不完整类型，因此不能给`int`变量。