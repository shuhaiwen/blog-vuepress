---
title: std::hash
date: 2020-11-23
sidebarDepth: 2
tags:
 - hash
categories:
 - C++11
---
# std::hash
## hash 结构组成
**hash类的实现主要由以下3类组成**
- hash模板类前置声明
- hash错误编译警告辅助类
- hash模板类具体化
## 源码分析
**源码如下**
```c++
// 前置声明，为了后面_Conditionally_enabled_hash使用
template <class _Kty>
struct hash;
//辅助类，用于对使用hash的类检查
template <class _Kty, bool _Enabled>
struct _Conditionally_enabled_hash { // conditionally enabled hash base
    _CXX17_DEPRECATE_ADAPTOR_TYPEDEFS typedef _Kty _ARGUMENT_TYPE_NAME;
    _CXX17_DEPRECATE_ADAPTOR_TYPEDEFS typedef size_t _RESULT_TYPE_NAME;
    //重载运算符(),并在内部调用hash中的_Do_hash函数
    _NODISCARD size_t operator()(const _Kty& _Keyval) const
        noexcept(noexcept(hash<_Kty>::_Do_hash(_Keyval))) /* strengthened */ {
        return hash<_Kty>::_Do_hash(_Keyval);
    }
};
//对没具体化hash的类删除构造，道州无法实例化，故产生编译警告
template <class _Kty>
struct _Conditionally_enabled_hash<_Kty, false> { // conditionally disabled hash base
    _Conditionally_enabled_hash()                                   = delete;
    _Conditionally_enabled_hash(const _Conditionally_enabled_hash&) = delete;
    _Conditionally_enabled_hash(_Conditionally_enabled_hash&&)      = delete;
    _Conditionally_enabled_hash& operator=(const _Conditionally_enabled_hash&) = delete;
    _Conditionally_enabled_hash& operator=(_Conditionally_enabled_hash&&) = delete;
};
//利用类型特性is_const_v is_integral_v 等限制此类可以对数值类型如bool char int long等进行hash，当为false时匹配_Conditionally_enabled_hash<_Kty, false>，因此类中构造等函数被删除，无法实例，就会报错，当为true是匹配 _Conditionally_enabled_hash
// STRUCT TEMPLATE hash
template <class _Kty>
struct hash
    : _Conditionally_enabled_hash<_Kty,
          !is_const_v<_Kty> && !is_volatile_v<_Kty> && (is_enum_v<_Kty> || is_integral_v<_Kty> || is_pointer_v<_Kty>)> {
    // hash functor primary template (handles enums, integrals, and pointers)
    //_Do_hash函数供匹配的_Conditionally_enabled_hash类中重载的运算符()调用
    static size_t _Do_hash(const _Kty& _Keyval) noexcept {
        //_Hash_representation是hash的计算过程
        return _Hash_representation(_Keyval);
    }
};
//hash具体化，标准库有float double等等
template <>
struct hash<float> {
    _CXX17_DEPRECATE_ADAPTOR_TYPEDEFS typedef float _ARGUMENT_TYPE_NAME;
    _CXX17_DEPRECATE_ADAPTOR_TYPEDEFS typedef size_t _RESULT_TYPE_NAME;
    _NODISCARD size_t operator()(const float _Keyval) const noexcept {
        return _Hash_representation(_Keyval == 0.0F ? 0.0F : _Keyval); // map -0 to 0
    }
};
```
## 自定义hash
自定义hash的实现有2种方式，一种是定义独立的函数对象，另一种是具体化`hash`，使注入如`std::hash`中
### 方式一:独立函数对象
```c++
// 自定义散列函数能是独立函数对象：
struct MyHash
{
    std::size_t operator()(S const& s) const 
    {
        std::size_t h1 = std::hash<std::string>{}(s.first_name);
        std::size_t h2 = std::hash<std::string>{}(s.last_name);
        return h1 ^ (h2 << 1); // 或使用 boost::hash_combine （见讨论）
    }
};
```
### 方式二:注入`std::hash`中
```c++
// std::hash 的自定义特化能注入 namespace std
namespace std
{
    template<> struct hash<S>
    {
        typedef S argument_type;
        typedef std::size_t result_type;
        result_type operator()(argument_type const& s) const
        {
            result_type const h1 ( std::hash<std::string>{}(s.first_name) );
            result_type const h2 ( std::hash<std::string>{}(s.last_name) );
            return h1 ^ (h2 << 1); // 或使用 boost::hash_combine （见讨论）
        }
    };
}
```