---
title: Serialization
date: 2021-01-04
sidebarDepth: 2
tags:
 - Serialization
categories:
 - Boost
---
- [Serialization序列化](#serialization序列化)
	- [3种存档文件格式`xml`、`txt`、`binary`](#3种存档文件格式xmltxtbinary)
	- [基本数据的存档和读档](#基本数据的存档和读档)
	- [C++容器（list、string、array ...）的存档和读档](#c容器liststringarray-的存档和读档)
	- [自定义类的存档和读档](#自定义类的存档和读档)
		- [无继承类](#无继承类)
		- [继承类](#继承类)
	- [指针、引用的存档和读档](#指针引用的存档和读档)
	- [扩展](#扩展)
		- [类序列化也可以save和load分离](#类序列化也可以save和load分离)
		- [serialize函数与类分离，可作为类外函数（可声明类友元函数方便访问类使用成员）](#serialize函数与类分离可作为类外函数可声明类友元函数方便访问类使用成员)
		- [添加版本信息](#添加版本信息)
	- [参考资料](#参考资料)
# Serialization序列化
- 功能：将 C++ 应用程序中的对象转换为一个字节序列（binary data, text data, XML）
- 特点：使用`fstream`文件流会生成存档文件，用于保存数据
- **注意事项**：存档时数据顺序与读档是顺序保持一致，否则数据将错误
- 简单示例
```cpp
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include <fstream>
#include <iostream>

void Save()
{
	std::ofstream wf("ser.txt");
	boost::archive::text_oarchive oar(wf);
	int i = 10;
	oar << i;
	wf.close();
}
void Load()
{
	std::ifstream rf("ser.txt");
	boost::archive::text_iarchive iar(rf);
	int i;
	iar >> i;
	std::cout << i << std::endl;
	rf.close();
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
## 3种存档文件格式`xml`、`txt`、`binary`
- 头文件
  - xml
    - `boost/archive/xml_iarchive.hpp`
    - `boost/archive/xml_oarchive.hpp`
  - txt
    - `boost/archive/text_iarchive.hpp`
    - `boost/archive/text_oarchive.hpp`
  - binary
    - `boost/archive/binary_iarchive.hpp`
    - `boost/archive/binary_oarchive.hpp`
- **注意事项**:stream流(如`fstream`)不要在`iarchive`和`oarchive`析构前关闭(即不主动调用`close`)
- 示例
```cpp
#include <boost/archive/binary_iarchive.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/xml_iarchive.hpp>
#include <boost/archive/xml_oarchive.hpp>
#include <fstream>
#include <iostream>
void Save()
{
	std::ofstream wft("ser.txt");
	std::ofstream wfx("ser.xml");
	std::ofstream wfb("ser.binary");
	boost::archive::text_oarchive oart(wft);
	boost::archive::xml_oarchive oarx(wfx);
	boost::archive::binary_oarchive oarb(wfb);	
	int i = 10;
	oart << i;
	oarx << BOOST_SERIALIZATION_NVP(i);
	oarb << i;
}
void Load()
{
	std::ifstream rft("ser.txt");
	std::ifstream rfx("ser.xml");
	std::ifstream rfb("ser.binary");
	boost::archive::text_iarchive rart(rft);
	boost::archive::xml_iarchive rarx(rfx);
	boost::archive::binary_iarchive rarb(rfb);
	int it=0,ix=0,ib = 0;
	rart >> it;
	rarx >> BOOST_SERIALIZATION_NVP(ix);
	rarb >> ib;
	std::cout << "rart >> it =" << it << std::endl;
	std::cout << "rarx >> ix =" << ix << std::endl;
	std::cout << "rarb >> ib =" << ib << std::endl;
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
- 输出结果
```console
rart >> it =10
rarx >> ix =10
rarb >> ib =10
```
## 基本数据的存档和读档
- 基本类型如`int`、`bool`、`char`等可以直接调用适当的`oarchive`存档和`iarchive`读档
- 示例
```cpp
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include <fstream>
#include <iostream>

void Save()
{
	std::ofstream wf("ser.txt");
	boost::archive::text_oarchive oar(wf);
	int i = 10;
	char c = '1';
	bool b = false;
	oar << i;
	oar << c;
	oar << b;
	wf.close();
}
void Load()
{
	std::ifstream rf("ser.txt");
	boost::archive::text_iarchive iar(rf);
	char c;
	int i;
	bool b;
	//读档顺序与存档时保持一致
	iar >> i;
	iar >> c;
	iar >> b;
	std::cout <<"i=" << i << std::endl;
	std::cout <<"c="<< c << std::endl;
	std::cout <<std::boolalpha<< "b=" << b << std::endl;
	rf.close();
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
- 输出结果
```cpp
i=10
c=1
b=false
```
## C++容器（list、string、array ...）的存档和读档
STL容器与基本类型唯一不同是需要添加对应的头文件，如vector添加`#include<boost/serialization/vector.hpp>`
- 头文件
  - `string`添加头文件`boost/serialization/string.hpp`
  - `vector`添加头文件`boost/serialization/vector.hpp`
  - `list`添加头文件`boost/serialization/list.hpp`
  - `array`添加头文件`boost/serialization/array.hpp`
  - `map`添加头文件`boost/serialization/map.hpp`
  - `stack`添加头文件`boost/serialization/stack.hpp`
  - 其它...
- 示例
```cpp
#include<vector>
#include<iostream>
#include<fstream>
#include<boost/serialization/vector.hpp>
#include<boost/archive/text_iarchive.hpp>
#include<boost/archive/text_oarchive.hpp>
void Save()
{
	std::ofstream wf("ser.txt");
	boost::archive::text_oarchive oar(wf);
	std::vector<std::string> v = { "Hello","World","!" };
	oar << v;
}
void Load()
{
	std::ifstream rf("ser.txt");
	boost::archive::text_iarchive iar(rf);
	std::vector<std::string> v;
	iar >> v;
	for (const std::string& str:v)
	{
		std::cout << str << " ";
	}
	std::cout << std::endl;
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
- 输出结果
```console
Hello World !
```
## 自定义类的存档和读档
- 声明友元类`friend class boost::serialization::access;`
- 类中实现`template <typename Archive> void serialize(Archive &ar, const unsigned int version) `模板函数
### 无继承类
- 示例
```cpp
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include<boost/serialization/map.hpp>
#include <fstream>
#include <iostream>
#include<map>
#include<string>
using namespace std;
class Base
{
public:
	Base() :m_i(0), m_pb(NULL), m_mp({}) {}
	Base(int i, Base* pb, std::map<string, int> mp) :m_i(i),m_pb(pb),m_mp(mp){}
private:
	friend class boost::serialization::access;
	
	template<class Archive>
	void serialize(Archive& ar, const unsigned int version)
	{
		ar& m_i;
		ar& m_pb;
		ar& m_mp;
	}
	int m_i;
	Base* m_pb;
	std::map<string,int> m_mp;
};

void Save()
{
	std::ofstream wf("ser.txt");
	boost::archive::text_oarchive oar(wf);
	Base b(2, nullptr, { {"1",1},{"2",2} });
	oar << b;
}
void Load()
{
	std::ifstream rf("ser.txt");
	boost::archive::text_iarchive iar(rf);
	Base b;
	//读档顺序与存档时保持一致
	iar >> b;
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
### 继承类
- 在无继承类基础上增加以下几点
  - 添加头文件`#include<boost/serialization/base_object.hpp>`
  - 在serialize函数中增加序列化基类代码，例如`ar& boost::serialization::base_object<Base>(*this);`
- 示例
```cpp
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include<boost/serialization/base_object.hpp>
#include<boost/serialization/map.hpp>
#include <fstream>
#include <iostream>
#include<map>
#include<string>
using namespace std;
class Base
{
public:
	Base() :m_i(0), m_pb(NULL), m_mp({}) {}
	Base(int i, Base* pb, std::map<string, int> mp) :m_i(i),m_pb(pb),m_mp(mp){}
private:
	friend class boost::serialization::access;
	
	template<class Archive>
	void serialize(Archive& ar, const unsigned int version)
	{
		ar& m_i;
		ar& m_pb;
		ar& m_mp;
	}
	int m_i;
	Base* m_pb;
	std::map<string,int> m_mp;
};

class Derived :public Base
{
public:
	Derived() = default;
	Derived(string str) :Base(),m_str(str) {}
private:
	friend class boost::serialization::access;
	template<class Archive>
	void serialize(Archive& ar, const unsigned int version)
	{
		ar& boost::serialization::base_object<Base>(*this);
		ar& m_str;
	}
	string m_str;

};

void Save()
{
	std::ofstream wf("ser.txt");
	boost::archive::text_oarchive oar(wf);
	Base b(2, nullptr, { {"1",1},{"2",2} });
	Derived d("hello");
	oar << b;
	oar << d;
}
void Load()
{
	std::ifstream rf("ser.txt");
	boost::archive::text_iarchive iar(rf);
	Base b;
	Derived d;
	//读档顺序与存档时保持一致
	iar >> b;
	iar >> d;
}
int main()
{
	//存档
	Save();
	//读档
	Load();
}
```
## 指针、引用的存档和读档
- 指针与对象使用一样，但引用需要转换成相应的指针
- 示例
```cpp
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include<boost/serialization/map.hpp>
#include <fstream>

using namespace std;
class object;
class my_class {
private:
	friend class boost::serialization::access;
	int member1;
	object& member2;
	template<class Archive>
	friend void serialize(Archive& ar, const unsigned int file_version);
public:
	my_class(int m, object& o) :
		member1(m),
		member2(o)
	{}
};
template<class Archive>
inline void save_construct_data(
	Archive& ar, const my_class* t, const unsigned int file_version
) {
	// save data required to construct instance
	ar << t.member1;
	// serialize reference to object as a pointer
	ar << &t.member2;
}

template<class Archive>
inline void load_construct_data(
	Archive& ar, my_class* t, const unsigned int file_version
) {
	// retrieve data from archive required to construct new instance
	int m;
	ar >> m;
	// create and load data through pointer to object
	// tracking handles issues of duplicates.
	object* optr;
	ar >> optr;
	// invoke inplace constructor to initialize instance of my_class
	::new(t)my_class(m, *optr);
}
```
## 扩展
### 类序列化也可以save和load分离
1. 添加头文件`boost/serialization/split_member.hpp`
2. 在类中使用`BOOST_SERIALIZATION_SPLIT_MEMBER()`函数宏
- 示例
```cpp
#include <boost/serialization/string.hpp>
#include<boost/serialization/access.hpp>
#include <boost/serialization/split_member.hpp>
class Base
{
private:
	friend class boost::serialization::access;
	std::string m_str;
	template<class Archive>
	void save(Archive& ar, const unsigned int version)const
	{
		ar << m_str;
	}
	template<class Archive>
	void load(Archive& ar, const unsigned int version)
	{
		ar >> m_str;
	}
	BOOST_SERIALIZATION_SPLIT_MEMBER()
public:
	Base() :m_str("") {}
	Base(std::string str) :m_str(str) {}
};
```
### serialize函数与类分离，可作为类外函数（可声明类友元函数方便访问类使用成员）
1. 类成员函数`void serialize(Archive& ar, const unsigned int version)`改成类外函数，如` void serialize(Archive& ar, Base& base, const unsigned int version)`
- 示例
```cpp
#include<boost/serialization/map.hpp>
#include<map>
#include<string>
using namespace std;
class Base
{
public:
	Base() :m_i(0), m_pb(NULL), m_mp({}) {}
	Base(int i, Base* pb, std::map<string, int> mp) :m_i(i), m_pb(pb), m_mp(mp) {}
private:
	friend class boost::serialization::access;

	template<class Archive>
	friend void serialize(Archive& ar, Base& base, const unsigned int version);
	int m_i;
	Base* m_pb;
	std::map<string, int> m_mp;
};
template<class Archive>
void serialize(Archive& ar, Base& base,const unsigned int version)
{
	ar& base.m_i;
	ar& base.m_pb;
	ar& base.m_mp;
}
```
### 添加版本信息
1. 添加头文件`boost/serialization/version.hpp`
2. 类外使用`BOOST_CLASS_VERSION`函数宏
```cpp
#include <boost/serialization/string.hpp>
#include<boost/serialization/access.hpp>
#include <boost/serialization/version.hpp>
class Base
{
private:
	friend class boost::serialization::access;
	std::string m_str;
	template<class Archive>
	void serialize(Archive& ar, const unsigned int version)
	{
		if (version > 0)
			ar& m_str;
	}
public:
	Base():m_str("") {}
	Base(std::string str) :m_str(str) {}
};
BOOST_CLASS_VERSION(Base, 1)
```
## 参考资料
- [官网文档boost.serialization](https://www.boost.org/doc/libs/1_75_0/libs/serialization/doc/index.html)