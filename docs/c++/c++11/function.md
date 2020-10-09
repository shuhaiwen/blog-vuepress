---
title: std::function
date: 2020-08-05
sidebarDepth: 2
tags:
 - function
categories:
 - C++11
---
# std::function
- 头文件： `functional`
- 功能：类模板 std::function 是通用多态函数封装器。 std::function 的实例能存储、复制及调用任何可调用 (Callable) 目标——函数、 lambda 表达式、 bind 表达式或其他函数对象，还有指向成员函数指针和指向数据成员指针
- 示例
```c++
#include <functional>
struct Foo {
    Foo(int num) : num_(num) {}
    void print_add(int i) const { std::cout << num_ + i << '\n'; }
    int num_;
};

void print_num(int i)
{
    
}

struct PrintNum {
    void operator()(int i) const
    {
        std::cout << i << '\n';
    }
};

int main()
{
    print_num(2);
    // 存储自由函数
    std::function<void(int)> f_display = print_num;
    f_display(-9);

    // 存储 lambda
    std::function<void()> f_display_42 = []() { print_num(42); };
    f_display_42();

    // 存储到 std::bind 调用的结果
    std::function<void()> f_display_31337 = std::bind(print_num, 31337);
    f_display_31337();

    // 存储到成员函数的调用
    std::function<void(const Foo&, int)> f_add_display = &Foo::print_add;
    const Foo foo(314159);
    f_add_display(foo, 1);
    f_add_display(314159, 1);

    // 存储到数据成员访问器的调用
    std::function<int(Foo const&)> f_num = &Foo::num_;
    std::cout << "num_: " << f_num(foo) << '\n';

    // 存储到成员函数及对象的调用
    using std::placeholders::_1;
    std::function<void(int)> f_add_display2 = std::bind(&Foo::print_add, foo, _1);
    f_add_display2(2);

    // 存储到成员函数和对象指针的调用
    std::function<void(int)> f_add_display3 = std::bind(&Foo::print_add, &foo, _1);
    f_add_display3(3);

    // 存储到函数对象的调用
    std::function<void(int)> f_display_obj = PrintNum();
    f_display_obj(18);
}
```
- 源码分析:
  - 模板类`function`通过`_Get_function_impl`模板类作中转，继承自模板类`_Func_class`，其中`_Get_function_impl`的定义由直接定义的模板类和宏函数展开的模板类这2部分组成。当`function`接收函数类型模板参数时会匹配宏函数展开的`_Get_function_impl`类，而当模板参数是非函数类型时，会匹配直接定义的`_Get_function_impl`，且静态检查报错。
  - `_Func_class`中定义了一个函数对象，因此`function`实例对象可以像函数般使用`()`调用。
```c++
//只截取部分重要代码，其它如重载赋值运算符等功能函数不分析

// STRUCT TEMPLATE _Get_function_impl
template <class _Tx>
struct _Get_function_impl {
    static_assert(_Always_false<_Tx>, "std::function does not accept non-function types as template arguments.");
};

#define _GET_FUNCTION_IMPL(CALL_OPT, X1, X2, X3)                                                  \
    template <class _Ret, class... _Types>                                                        \
    struct _Get_function_impl<_Ret CALL_OPT(_Types...)> { /* determine type from argument list */ \
        using type = _Func_class<_Ret, _Types...>;                                                \
    };

_NON_MEMBER_CALL(_GET_FUNCTION_IMPL, X1, X2, X3)
#undef _GET_FUNCTION_IMPL


// CLASS TEMPLATE function
template <class _Fty>
class function : public _Get_function_impl<_Fty>::type { // wrapper for callable objects
private:
    using _Mybase = typename _Get_function_impl<_Fty>::type;

public:
    function() noexcept {}

    function(nullptr_t) noexcept {}

    function(const function& _Right) {
        this->_Reset_copy(_Right);
    }

#if _USE_FUNCTION_INT_0_SFINAE
    template <class _Fx, typename _Mybase::template _Enable_if_callable_t<_Fx&, function> = 0>
#else // ^^^ _USE_FUNCTION_INT_0_SFINAE // !_USE_FUNCTION_INT_0_SFINAE vvv
    template <class _Fx, class = typename _Mybase::template _Enable_if_callable_t<_Fx&, function>>
#endif // _USE_FUNCTION_INT_0_SFINAE
    function(_Fx _Func) {
        this->_Reset(_STD move(_Func));
    }

};
```