---
title: googletest教程
date: 2021-01-26
sidebarDepth: 2
tags:
 - googletest
categories:
 - C++库
---
# googletest教程
## 编译安装
1. 执行以下指令下载安装
```shellsession
git clone https://github.com/google/googletest.git
cd googletest        # 仓库代码主目录.
mkdir build          # Create a directory to hold the build output.
cd build
cmake ..             # 只生成GoogleTest不生成GoogleMock
```
**注意：`cd googletest`是进入主目录下，而不是googletest/googletest目录**
2. 在windows下build目录会生成.sln文件，使用visual studio打开
3. 生成gtest、gtest_main项目的静态库
## googletest的使用
上面的编译安装默认会生成googletest的静态库lib。
1. 包含lib库
   1. 使用`#pragma comment`添加lib库
   2. 或在vs上配置lib库路径和lib名
2. 包含头文件路径：将googletest/googletest/include添加到vs包含目录中
3. 包含头文件gtest.h：在使用googletest的地方首先包含gtest.h文件
```cpp
#include "gtest/gtest.h"

#ifdef _DEBUG
#pragma comment(lib,"gtest_maind.lib")
#pragma comment(lib,"gtestd.lib")
#else
#pragma comment(lib,"gtest_main.lib")
#pragma comment(lib,"gtest.lib")
#endif

TEST(TestCaseName, TestName) {
	EXPECT_EQ(1, 1);
	EXPECT_TRUE(true);
}

//int main(int argc, char* argv[]) {
//	testing::InitGoogleTest(&argc, argv);
//	return RUN_ALL_TESTS();
//}
```
输出结果
```
[==========] Running 1 test from 1 test suite.
[----------] Global test environment set-up.
[----------] 1 test from TestCaseName
[ RUN      ] TestCaseName.TestName
[       OK ] TestCaseName.TestName (0 ms)
[----------] 1 test from TestCaseName (1 ms total)

[----------] Global test environment tear-down
[==========] 1 test from 1 test suite ran. (3 ms total)
[  PASSED  ] 1 test.
```
**注意：在我们的程序中不需要提供mian函数，googletest会提供，当然我们也可以自己提供**
- 自定义main函数，需要以下内容
```cpp
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
	testing::InitGoogleTest(&argc, argv);
	return RUN_ALL_TESTS();
}
```
## TEXT和TEXT_F
googletest中有2类测试方式，基本测试TEXT和测试夹具TEXT_F，TEXT_F是用来复用同一测试数据，避免冗余的。具体使用可参考官方文档 
- https://github.com/google/googletest/blob/master/docs/primer.md