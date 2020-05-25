# const和指针的关系
## const和*，**搭配的解释
- [类型一：const 和 int](#类型一：const&nbsp;和&nbsp;int)
- [类型二：const和 int 和 *](#类型二：const和&nbsp;int&nbsp;和&nbsp;*&#42;*)
- [类型三：const 和 int 和 **](#类型三：const&nbsp;和&nbsp;int&nbsp;和&nbsp;**)

*注：以下举例以int作为类型,且new的数据未作delete处理*
## 类型一：const 和 int
```c++
//类型一
	const int i1 = 2;//【Ⅰ】
	// i1 = 3;//error

	int const i2 = 2;//【Ⅱ】等价于【Ⅰ】
	//i2 = 3;//error 
```
## 类型二：const和 int 和 *
```c++
    int* tpi = new  int(1);
	int** tppi = new int* (new int(1));
	
	//类型二
	const int* pi_11{ new int(2) };//【Ⅲ】pi_11指向的值为常量
	//(*pi_11) = 3;//error
	pi_11 = tpi;//success

	int const* pi_12{ new int(2) };//【Ⅳ】等价于【Ⅲ】
	//(*pi_12) = 3;//error
	pi_12 = tpi;//success
	*tpi = 3;
	int* const pi_13{ new int(2) };//Ⅴ】pi_13指针为常量
	(*pi_13) = 3;//success
	//pi_13 = tpi;//error

	const int* const pi{ new int(2) };//【Ⅵ】pi指针为常量，且pi指向的值也为常量
	//pi = tpi;//error
	//(*pi) = 3;//error
```
## 类型三：const 和 int 和 **
```c++
    int* tpi = new  int(1);
	int** tppi = new int* (new int(1));
    const int* pi_11{ new int(2) };
	//类型三
	int* const* const ppi1{ new int* (new int(2)) };//【Ⅶ】ppi1指针为常量，且ppi1指针的指针为常量
	//ppi1 = tppi;//error
	//(*ppi1) = tpi;//error
	(*(*ppi1)) = 3;//success

	const int* const* const ppi2{ new int* (new int(2)) };//【Ⅷ】ppi2指针为常量，且ppi2指针的指针为常量,且ppi2指针的指针指向的值也为常量
	//ppi2 = tppi;//error
	//(*ppi2) = tpi;//error
	//(*(*ppi2)) = 3;//error
	int const * const* const ppi3{ new int* (new int(2)) };//【Ⅸ】等价于【Ⅷ】

	int** const ppi4{ new int* (new int(2)) };//【Ⅹ】ppi5二级指针为常量
	//ppi4 = tppi;//error
	(*ppi4) = tpi;//success
	(*(*ppi4)) = 2;//sucess

	const int** ppi5{ new const int* (new int(2)) };//【ⅩⅠ】ppi5指针的指针指向的值为常量
	ppi5 = &pi_11;//success
	(*ppi5) = pi_11;//success
	//(*(*ppi5)) = 2;//error

	int const** ppi6{ new const int* (new int(2)) };//【ⅩⅡ】等价于【ⅩⅠ】
```
----------------
- [我的GitHub](https://github.com/shuhaiwen "https://github.com/shuhaiwen") 
- [我的CSDN](https://blog.csdn.net/u014140383 "https://blog.csdn.net/u014140383")
- [我的Gitee](https://gitee.com/shuhaiwen "https://gitee.com/shuhaiwen")