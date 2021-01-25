---
title: spdlog教程
date: 2021-01-16
sidebarDepth: 2
tags:
 - Spdlog
categories:
 - C++库
---
- [spdlog教程](#spdlog教程)
	- [编译安装](#编译安装)
	- [入门](#入门)
		- [使用默认logger记录器](#使用默认logger记录器)
		- [设置默认日志记录器属性](#设置默认日志记录器属性)
		- [设置默认日志记录器的记录器](#设置默认日志记录器的记录器)
	- [基础](#基础)
		- [sink和logger](#sink和logger)
		- [使用工厂函数创建logger](#使用工厂函数创建logger)
		- [手动创建logger](#手动创建logger)
		- [从注册器中获取logger](#从注册器中获取logger)
		- [一个logger绑定对个sink](#一个logger绑定对个sink)
		- [spdlog支持的sink](#spdlog支持的sink)
		- [sink的线程安全版`_mt`和线程不安全版`_st`](#sink的线程安全版_mt和线程不安全版_st)
	- [进阶](#进阶)
		- [formater格式化日志之set_pattern](#formater格式化日志之set_pattern)
		- [formater格式化日志之set_formatter](#formater格式化日志之set_formatter)
# spdlog教程
日志库重要涉及3个重要模块；sink是日志最终流向的目的地，如文件，控制台；logger是日志信息数据，临时保存着要输出到sink的信息；formater是由来格式化日志信息的，使日志信息按一定的格式输出到sink中，比如使日志带时间信息。
- sink 日志输出目标
- logger 日志信息源
- formater 日志信息格式化
## 编译安装
spdlog只含头文件，不需要额外编译，使用时直接包含apdlog库中的include目录就行。
## 入门
### 使用默认logger记录器
- 使用方式：
  - 头文件：`#include<spdlog/spdlog.h>`
  - `spdlog::info()`等
- 默认的记录器特点
  - 写到stdout（控制台）
  - 带颜色
  - 多线程
```cpp
#include<spdlog/spdlog.h>
int main()
{
	spdlog::info("Hello,{}", "world!");
	spdlog::error("这时错误信息");
}
```
### 设置默认日志记录器属性
```cpp
#include<spdlog/spdlog.h>
int main()
{
  //设置日志过滤等级
	spdlog::set_level(spdlog::level::level_enum::err);
  //设置日志输出模式
	spdlog::set_pattern("*** [%H:%M:%S %z] [thread %t] %v ***");
	spdlog::info("Hello,{}", "world!");
	spdlog::error("这时错误信息");
}
```
- 输出结果如下,过滤了error等级以下的日志信息，并且输出自定义的模式
```
*** [11:09:36 +08:00] [thread 18772] 这时错误信息 ***
```
### 设置默认日志记录器的记录器
同样也可以给默认的记录器设置一个记录器
```cpp
#include<spdlog/spdlog.h>
#include<spdlog/sinks/basic_file_sink.h>

int main()
{
	auto mylog=spdlog::basic_logger_mt("mylog", "1.log");
	mylog->set_level(spdlog::level::level_enum::info);
	spdlog::set_default_logger(mylog);
	spdlog::info("info");
	spdlog::debug("debug");
	spdlog::error("error");
}
```
- 默认记录器使用了mylog记录器，最终生成日志文件1.log，1.log数据如下
```
[2021-01-16 11:17:45.262] [mylog] [info] info
[2021-01-16 11:17:45.832] [mylog] [error] error
```
- 注意事项：当设置了默认日志记录器后再去设置默认记录器的属性，也将会生效，而在设置默认记录器前设置的属性将会失效，因为默认记录器会被新记录器替换
## 基础
### sink和logger
- 要使用日志需要一个sink和一个logger(当然formater格式化器也需要，但这主要其美化作用，不影响日志主要功能)，logger可以关联多个sink，sink同样可以关联多个logger。
  - `sink`槽指日志最终输出的目标，比如文件，stdout等
  - `logger`记录器是临时记录信息的载体，这些日志信息最终需要流向`sink`
- *spdlog*提供了工厂函数便于创建日志，也可以手动创建*logger*再关联*sink*，然后选择注册。
### 使用工厂函数创建logger
- 在每一个sink头文件中都有响应的工厂函数，包含线程安全`_mt`,线程不安全`st`版
```cpp
#include<spdlog/spdlog.h>
#include<spdlog/sinks/basic_file_sink.h>
int main()
{
	//工厂函数
	auto mylog=spdlog::basic_logger_mt("mylog", "1.log");
	mylog->info("hello 我是由工厂函数创建");
}
```
### 手动创建logger
- 手动创建logger主要涉及3步
  - 创建sink
  - 创建logger并关联sink
  - 注册logger[可选]
```cpp
#include<spdlog/spdlog.h>
#include<spdlog/sinks/basic_file_sink.h>
int main()
{
	//手动注册
	//1. 创建sink
	auto sink_file = std::make_shared<spdlog::sinks::basic_file_sink_mt>("1.log");
	//2. 创建logger并关联sink
	auto file_log = std::make_shared<spdlog::logger>("file_log", sink_file);
	//3. 可选注册logger
	spdlog::register_logger(file_log);
	file_log->info("hello 我是手动创建的");
}
```
### 从注册器中获取logger
当我们使用了工厂函数创建logger时，如`auto mylog=spdlog::basic_logger_mt("mylog", "1.log");`,或者手动注册，如`spdlog::register_logger(file_log);`,logger将会被保存，当我们调用`spdlog::get`函数可以获取logger
```cpp
#include<spdlog/spdlog.h>
#include<spdlog/sinks/stdout_color_sinks.h>
int main()
{
	{
    //名mylog的logger会被注册 
		auto mylog = spdlog::stdout_color_st("mylog");
	}	
  //spdlog::get查找logger，查找失败会返回nullptr
	if (auto mylog = spdlog::get("mylog"); mylog != nullptr)
	{
		mylog->info("hello");
	}
}
```
- 输出结果
```
[2021-01-16 16:05:50.559] [mylog] [info] hello
```
### 一个logger绑定对个sink
在工作中，可能会出现即想输出到文件，又想输出到控制台的情况，这是使用一个logger绑定多个sink将很好解决这类问题
```cpp
#include<vector>
#include<spdlog/spdlog.h>
#include<spdlog/sinks/basic_file_sink.h>
#include<spdlog/sinks/stdout_color_sinks.h>
int main()
{
	//1. 创建sink
	auto sink_file = std::make_shared<spdlog::sinks::basic_file_sink_mt>("1.log");
	auto sink_stdout = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
	
	//2. 创建logger并关联sink
	std::vector<spdlog::sink_ptr> sinks = { sink_file ,sink_stdout };
	auto file_log = std::make_shared<spdlog::logger>("file_log", std::begin(sinks), std::end(sinks));
	//3. 可选注册logger
	spdlog::register_logger(file_log);
	file_log->info("hello 我是手动创建的");	
}
```
上例中logger绑定sink使用了容器区间，但这样比较繁琐，我们也可以使用c++11中initializer_list来实现
```cpp
	//使用c++11中initializer_list
	auto file_log = std::make_shared<spdlog::logger>("file_log", spdlog::sinks_init_list({sink_file,sink_stdout}));
```
### spdlog支持的sink
spdlog支持许多sink，经常使用的有`basic_file_sink`,如下列举了它们所在的头文件
```
android_sink.h     hourly_file_sink.h    stdout_color_sinks.h
ansicolor_sink.h   msvc_sink.h           stdout_sinks.h
base_sink.h        null_sink.h           syslog_sink.h
basic_file_sink.h  ostream_sink.h        systemd_sink.h
daily_file_sink.h  ringbuffer_sink.h     tcp_sink.h
dist_sink.h        rotating_file_sink.h  win_eventlog_sink.h
dup_filter_sink.h  sink.h                wincolor_sink.h
```
### sink的线程安全版`_mt`和线程不安全版`_st`
模板类base_sink匹配一个类型`mutex`的类型，`_mt`版sink继承自base_sink<mutex>，而`_st`版sink继承自`base_sink<null_mutex>`,也就是说，线程安全版是上了锁的，而线程不安全版是没上锁的。看如下源码
```cpp
using basic_file_sink_mt = basic_file_sink<std::mutex>;
using basic_file_sink_st = basic_file_sink<details::null_mutex>;
```
- 注意：`_mt`正确理解是线程安全的意思，支持多线程环境中使用；`_st`正确理解是线程不安全的，适用于单线程中
## 进阶
### formater格式化日志之set_pattern
set_pattern函数使用spdlog支持的`%flag`格式组合字符串来格式化日志，具体格式标志查阅[https://github.com/gabime/spdlog/wiki/3.-Custom-formatting]
- 示例
```cpp
#include<spdlog/spdlog.h>
#include<spdlog/sinks/stdout_color_sinks.h>
int main()
{
	auto mylog=spdlog::stdout_color_sink_mt("mylog");
	mylog->set_pattern("%^[+++}%v[+++]%$");
	mylog->info("hello 我是手动创建的");
}
```
- 输出结果
```
[+++}hello 我是手动创建的[+++]
```
### formater格式化日志之set_formatter
- [参考官方文档](https://github.com/gabime/spdlog/wiki/3.-Custom-formatting 'spdlog')