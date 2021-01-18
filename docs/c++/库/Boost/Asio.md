---
title: Asio
date: 2021-01-11
sidebarDepth: 2
tags:
 - Asio
categories:
 - Boost
---
- [Asio网络库](#asio网络库)
	- [同步通讯](#同步通讯)
		- [客户端](#客户端)
		- [服务端](#服务端)
	- [测试示例](#测试示例)
	- [文档资料](#文档资料)
# Asio网络库
## 同步通讯
### 客户端
- 基本步骤：
  1. 建立io上下文
  2. 创建服务端和客户端端口
  3. 创建套接字socket
  4. 绑定自定义客户端端口号
  5. 连接服务端
  6. 处理服务端响应信息
- 注意事项：
	- 客户端可以自定义端口号，也可以由库随机指定
- 示例
```cpp
#include <boost/asio.hpp>
#include <string>
void client()
{
	try
	{
		//1.建立io上下文
		io_service io;
		//2.创建服务端和客户端端口
		ip::tcp::endpoint epServer(ip::address::from_string("127.0.0.1"), 8888);
		ip::tcp::endpoint epClien(ip::tcp::v4(), 6666);
		//3.创建socket套接字
		ip::tcp::socket socket(io);
		//4.绑定客户端端口
		socket.open(ip::tcp::v4());
		socket.bind(epClien);
		//5.连接服务端		
		socket.connect(epServer);
		//6.处理服务端发送来的信息
		{
			std::array<char, 128> msg = { '\0' };
			size_t len = socket.read_some(buffer(msg));
			std::cout << "[client]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "服务端响应数据：" << msg.data() << std::endl;
		}
	}
	catch (const std::exception& e)
	{
		std::cout << "[client]" << e.what() << std::endl;
	}
}
```
### 服务端
- 基本步骤：
  1. 建立io上下文
  2. 创建服务端
  3. 创建接收器
  4. 创建套接字socket
  5. 等待客户端连接请求
  6. 处理服务端响应信息
- 示例
```cpp
#include <boost/asio.hpp>
#include <string>
void server()
{
	try
	{
		//1.建立io的上下文
		io_service io;
		//2.创建端口
		ip::tcp::endpoint ep(ip::tcp::v4(), 8888);
		//3.创建接收器
		ip::tcp::acceptor acceptor(io, ep);
		while (true)
		{
			//4.创建socket套接字
			ip::tcp::socket socket(io);
			//5.等待客户端连接,会阻塞直到有连接到来
			acceptor.accept(socket);
			//6.添加响应客户端操作
			std::string infoRead, infoWrite = "hello, 客户端";
			boost::system::error_code ec;
			//socket.read_some(buffer(infoRead), ec);
			socket.write_some(buffer(infoWrite), ec);
			//服务端以完成发送
			sentFlag.store(true);
			if (ec)
			{
				std::cout << ec.message() << std::endl;
				break;
			}
			//循环等待下一客户端的连接
		}
	}
	catch (const std::exception& e)
	{
    std::cout << "[server]" << e.what() << std::endl;
	}
}
## 异步通讯
### 服务端
```cpp
#include <boost/asio.hpp>
#include<boost/bind.hpp>
using namespace boost::asio;
//AsyncServer
class AsyncServer
{
private:
	ip::tcp::acceptor acceptor;
	io_service& io;
	
public:
	AsyncServer(io_service& _io,const ip::tcp::endpoint& _ep):io(_io),acceptor(_io,_ep)
	{
		start();
	}
	void start()
	{
		std::shared_ptr<ip::tcp::socket> socket(new ip::tcp::socket(io));
		acceptor.async_accept(*socket, boost::bind(&AsyncServer::accept_handle,this,socket,placeholders::error));
	}
	void accept_handle(std::shared_ptr<ip::tcp::socket> socket,const boost::system::error_code& ec)
	{
		if (ec)
			return;
		socket->async_write_some(buffer("hello, 客户端"), boost::bind(&AsyncServer::write_handle, this, placeholders::error));
		start();
	}
	void write_handle(const boost::system::error_code& ec)
	{
		std::cout << "send msg complete!" << std::endl;
	}
};
```
## 测试示例
下面示例代码可以在一个进程中模拟客户端服务器收发信息
```cpp
#include <iostream>
#include <thread>
#include<memory>
#include <boost/asio.hpp>
#include<string>
#include<atomic>
#include<mutex>
std::mutex printMutex;
//线程安全io
#define PRINT(arg)								\
{												\
	std::lock_guard<std::mutex> lg(printMutex);	\
	arg											\
}
std::atomic<bool> sentFlag = false;//服务端以发送标志
std::atomic<bool> readyFlag(false);//服务端以准备接收客户端标志
using namespace boost::asio;
void server()
{
	try
	{
		//1.建立io的上下文
		io_service io;
		//2.创建端口
		ip::tcp::endpoint ep(ip::tcp::v4(), 8888);
		//3.创建接收器
		ip::tcp::acceptor acceptor(io, ep);
		while (true)
		{
			//4.创建socket套接字
			PRINT(std::cout << "[server]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "已建立服务端ip端口号[" << acceptor.local_endpoint().address() <<" "<< acceptor.local_endpoint().port() <<"]开始监听客户端请求..." << std::endl;)
			ip::tcp::socket socket(io);
			//服务端以准备接收客户端
			readyFlag.store(true);			
			PRINT(std::cout << "[server]" << "[threadID]=[" << std::this_thread::get_id() << "]开始监听客户端请求..."<<std::endl;)
			//5.等待客户端连接,会阻塞直到有连接到来
			acceptor.accept(socket);
			PRINT(std::cout << "[server]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "已连接客户端口号[" << socket.remote_endpoint().address() << " " << socket.remote_endpoint().port() << "]" << std::endl;)
			//6.添加响应客户端操作
			std::string infoRead, infoWrite = "hello, 客户端";
			boost::system::error_code ec;
			//socket.read_some(buffer(infoRead), ec);
			socket.write_some(buffer(infoWrite), ec);
			//服务端以完成发送
			sentFlag.store(true);
			if (ec)
			{
				PRINT(std::cout << ec.message() << std::endl;)
				break;
			}

			//循环等待下一客户端的连接
		}
	}
	catch (const std::exception& e)
	{
		PRINT(std::cout << "[server]" << e.what() << std::endl;)
	}

}
void client()
{
	try
	{
		//1.建立io上下文
		io_service io;
		//2.创建服务端和客户端端口
		ip::tcp::endpoint epServer(ip::address::from_string("127.0.0.1"), 8888);
		ip::tcp::endpoint epClien(ip::tcp::v4(), 6666);
		//3.创建socket套接字
		ip::tcp::socket socket(io);
		//4.绑定客户端端口
		socket.open(ip::tcp::v4());
		socket.bind(epClien);
		//等待服务端准备接收连接
		while (!readyFlag.load())
		{
			std::this_thread::sleep_for(std::chrono::milliseconds(2000));
		}
		//5.连接服务端		
		socket.connect(epServer);
		//PRINT(std::cout << "[client]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "正在连接服务端ip端口号[" << socket.remote_endpoint().address().to_string() << " " << socket.remote_endpoint().port() << "]..." << std::endl;)
		PRINT(std::cout << "[client]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "已连接服务端ip端口号[" << socket.remote_endpoint().address().to_string() << " " << socket.remote_endpoint().port() << "]" << std::endl;)
		//等待服务端发送完信息
		while (!sentFlag.load())
		{
			PRINT(std::this_thread::sleep_for(std::chrono::milliseconds(100));)
		}
		//6.处理服务端发送来的信息
		{
			std::array<char, 128> msg = { '\0' };
			size_t len = socket.read_some(buffer(msg));
			PRINT(std::cout << "[client]" << "[threadID]=[" << std::this_thread::get_id() << "]" << "服务端响应数据：" << msg.data() << std::endl;)
		}
	}
	catch (const std::exception& e)
	{
		PRINT(std::cout << "[client]" << e.what() << std::endl;)
	}
}
void start()
{
	PRINT(std::cout << "************start************" << std::endl;)
	std::thread tserver(server);
	for (size_t i = 0; i < 1; ++i)
	{
		client();
	}	
	//因为服务器一直阻塞等待客户端连接，只能强制中止线程，但不到万不得已不使用，因为有些资源不会释放
	TerminateThread(tserver.native_handle(),0);
	PRINT(std::cout << "*************end************" << std::endl;)
}
int main() {
	start();
}
```
## 文档资料
- [Boost.Asio C++ 网络编程](https://mmoaay.gitbooks.io/boost-asio-cpp-network-programming-chinese/content/)
- [Boost.Asio](https://www.boost.org/doc/libs/1_75_0/doc/html/boost_asio/overview.html)