---
title: any
date: 2020-12-03
sidebarDepth: 2
tags:
 - any
categories:
 - C++17
---
- [std::any](#stdany)
  - [功能及示例](#功能及示例)
  - [源码分析](#源码分析)
# std::any
## 功能及示例
- 功能：用来存储任意类型数据的类型安全容器
  - 当储存的是指针时，any内保存了指针数据(把指针当作一个数据)，外部指针所指的数据改变会影响any内部存储的指针所指向的数据，外部指针被重新赋值，不会影响any内储存的指针数据
  - 当储存的是对象时，外部对象数据改变不影响any内存储数据。
- 示例
```c++
#include <any>
#include <iostream>

using namespace std;
int main()
{

    std::cout << std::boolalpha;

    // any 类型
    std::any a = new int(2);
    std::cout << a.type().name() << ": " << *std::any_cast<int*>(a) << '\n';
    a = 3.14;
    std::cout << a.type().name() << ": " << std::any_cast<double>(a) << '\n';
    a = true;
    std::cout << a.type().name() << ": " << std::any_cast<bool>(a) << '\n';

    // 有误的转型
    try
    {
        a = 1;
        std::cout << std::any_cast<float>(a) << '\n';
    }
    catch (const std::bad_any_cast& e)
    {
        std::cout << e.what() << '\n';
    }

    // 拥有值
    a = 1;
    if (a.has_value())
    {
        std::cout << a.type().name() << '\n';
    }

    // 重置
    a.reset();
    if (!a.has_value())
    {
        std::cout << "no value\n";
    }

    // 指向所含数据的指针
    a = 1;
    int* i = std::any_cast<int>(&a);
    std::cout << *i << "\n";
}
//输出结果
//int *: 2
//double: 3.14
//bool: true
//Bad any_cast
//int
//no value
//1
```
## 源码分析
any是一个普通类（非模板类），它构造实现可以匹配任意类型对象或指针，然后内部会重新分配一块内存用来保存数据。它内部有一个`_Storage_t`类型成员变量`_Storage`,这个`_Storage`拥有并管理数据（保存数据的类型，数据值）。当any生命周期结束时，会将`_Storage`中分配的资源删除。
- 部分源码及分析
```c++
//value 可以是任意类型，包括指针
  template <class _ValueType, enable_if_t<conjunction_v<negation<is_same<decay_t<_ValueType>, any>>,
        negation<_Is_specialization<decay_t<_ValueType>, in_place_type_t>>,
        is_copy_constructible<decay_t<_ValueType>>>,
        int> = 0>
        any(_ValueType&& _Value) { // initialize with _Value
        //调用any内部的_Emplace函数
        _Emplace<decay_t<_ValueType>>(_STD forward<_ValueType>(_Value));
    }
    template <class _Ty, class... _Types>
void _Construct_in_place1(_Ty& _Obj, _Types&&... _Args) noexcept(is_nothrow_constructible_v<_Ty, _Types...>) {
	::new (const_cast<void*>(static_cast<const volatile void*>(_STD addressof(_Obj))))
		_Ty(_STD forward<_Types>(_Args)...);
}
//_Emplace函数中有3个分支，分支主要通过对象所占内存大小，以及字节对齐大小条件来区分
 template <class _Decayed, class... _Types>
    _Decayed& _Emplace(_Types&&... _Args) { // emplace construct _Decayed
        if constexpr (_Any_is_trivial<_Decayed>) {
            // using the _Trivial representation
            //_Storage._TrivialData是数组，预先分配好了空间
            auto& _Obj = reinterpret_cast<_Decayed&>(_Storage._TrivialData);
            //_Construct_in_place内部调用new的布置参数将_Obj空间分配给了any所要管理的数据，这样适当类型转换_Storage._TrivialData就可以得到所要管理的数据
            _Construct_in_place(_Obj, _STD forward<_Types>(_Args)...);
            _Storage._TypeData =
                reinterpret_cast<uintptr_t>(&typeid(_Decayed)) | static_cast<uintptr_t>(_Any_representation::_Trivial);
            return _Obj;
        }
        else if constexpr (_Any_is_small<_Decayed>) {
            // using the _Small representation
            auto& _Obj = reinterpret_cast<_Decayed&>(_Storage._SmallStorage._Data);
            _Construct_in_place(_Obj, _STD forward<_Types>(_Args)...);
            _Storage._SmallStorage._RTTI = &_Any_small_RTTI_obj<_Decayed>;
            _Storage._TypeData =
                reinterpret_cast<uintptr_t>(&typeid(_Decayed)) | static_cast<uintptr_t>(_Any_representation::_Small);
            return _Obj;
        }
        else {
          //这个分支会使内部new块空间，由 _Storage._BigStorage._Ptr保存，当any生命周期结束会执行delete操作
            // using the _Big representation
            _Decayed* const _Ptr = ::new _Decayed(_STD forward<_Types>(_Args)...);
            _Storage._BigStorage._Ptr = _Ptr;
            _Storage._BigStorage._RTTI = &_Any_big_RTTI_obj<_Decayed>;
            _Storage._TypeData =
                reinterpret_cast<uintptr_t>(&typeid(_Decayed)) | static_cast<uintptr_t>(_Any_representation::_Big);
            return *_Ptr;
        }
    }
```
- 以上源码中有几个重要的实现:
  - `auto& _Obj = reinterpret_cast<_Decayed&>(_Storage._TrivialData);`
    - 当 _Decayed是指针时，_Obj会是`*&`指针的引用类型，即`&_Obj`与`_Storage._TrivialData`的地址是相同的。
  - `::new (const_cast<void*>(static_cast<const volatile void*>(_STD addressof(_Obj))))_Ty(_STD forward<_Types>(_Args)...);`
    - 这使用布置new实现，从`_Obj`中分配内存给`_Ty`数据，从而达到给`_Obj`赋值功能
