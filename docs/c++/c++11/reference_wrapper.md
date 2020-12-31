---
title: std::reference_wrapper
date: 2020-11-17
sidebarDepth: 2
tags:
 - reference_wrapper
 - Function Object
categories:
 - C++11
---

# std::reference_wrapper
- 头文件： `<functional>`
- 功能：`std::reference_wrapper` 是包装引用于可复制、可赋值对象的类模板。它常用作将引用存储入无法正常保有引用的标准容器（类似 `std::vector` ）的机制。
- 源码分析
```cpp
template <class _Ty>
class reference_wrapper
#if !_HAS_CXX20
    : public _Weak_types<_Ty>
#endif // !_HAS_CXX20
{
public:
    //静态断言_Ty是否是函数或对象
    static_assert(is_object_v<_Ty> || is_function_v<_Ty>,
        "reference_wrapper<T> requires T to be an object type or a function type.");

    using type = _Ty;
    //_Uty&&是模板万能引用，构造隐式接受_Uty类型的数据
    template <class _Uty, enable_if_t<conjunction_v<negation<is_same<_Remove_cvref_t<_Uty>, reference_wrapper>>,
                                          _Refwrap_has_ctor_from<_Ty, _Uty>>,
                              int> = 0>
    _CONSTEXPR20 reference_wrapper(_Uty&& _Val) noexcept(noexcept(_Refwrap_ctor_fun<_Ty>(_STD declval<_Uty>()))) {
        _Ty& _Ref = static_cast<_Uty&&>(_Val);
        _Ptr      = _STD addressof(_Ref);//将数据指针保存
    }
    //隐式类型转换，用于隐式转换_Ty类型
    _CONSTEXPR20 operator _Ty&() const noexcept {
        return *_Ptr;
    }
    //作用同隐式类型转换，得到保存的数据
    _NODISCARD _CONSTEXPR20 _Ty& get() const noexcept {
        return *_Ptr;
    }

private:
    _Ty* _Ptr{};

public:
    template <class... _Types>
    _CONSTEXPR20 auto operator()(_Types&&... _Args) const
        noexcept(noexcept(_STD invoke(*_Ptr, static_cast<_Types&&>(_Args)...))) // strengthened
        -> decltype(_STD invoke(*_Ptr, static_cast<_Types&&>(_Args)...)) {
        return _STD invoke(*_Ptr, static_cast<_Types&&>(_Args)...);
    }
};
```
- 示例
```cpp
#include <functional>
#include<vector>
int main(){
    std::vector<std::reference_wrapper<int>> v;
    int i1 = 1, i2 = 2;
    v.emplace_back(i1);
    v.emplace_back(i2); //现在v中{1，2}
    i1 = 3;//现在v中{3，2}
}
```