---
title: mysql
date: 2021-04-01
sidebarDepth: 2
tags:
 - mysql
categories:
 - SQL
---
- [mysql](#mysql)
  - [数据库](#数据库)
    - [登录数据库](#登录数据库)
    - [显示数据库](#显示数据库)
    - [创建数据库](#创建数据库)
    - [删除数据库](#删除数据库)
    - [使用数据库](#使用数据库)
    - [备份数据库](#备份数据库)
      - [mysqldump](#mysqldump)
      - [方式一：备份单个数据库中的指定的表](#方式一备份单个数据库中的指定的表)
      - [方式二：备份多个数据库](#方式二备份多个数据库)
      - [方式三：备份所有数据库](#方式三备份所有数据库)
    - [还原备份数据库](#还原备份数据库)
    - [查看数据库支持引擎](#查看数据库支持引擎)
  - [账号管理](#账号管理)
    - [新建用户](#新建用户)
    - [删除用户](#删除用户)
  - [表](#表)
    - [完整性约束条件](#完整性约束条件)
    - [创建表](#创建表)
    - [查看表](#查看表)
    - [显示所有表](#显示所有表)
    - [修改表](#修改表)
      - [修改表名](#修改表名)
      - [修改表字段数据类型](#修改表字段数据类型)
      - [修改表字段名](#修改表字段名)
      - [增加字段](#增加字段)
      - [删除字段](#删除字段)
      - [删除表的外键](#删除表的外键)
      - [创建表后增加主键外键](#创建表后增加主键外键)
    - [删除表](#删除表)
  - [查询](#查询)
    - [查询条件关键字](#查询条件关键字)
# mysql
SQL(Structured Query Language)结构化查询语言,语言分3个部分，如下：
- 数据定义语言(Data Definition Language,简称DDL)，如创建删除表、视图
  - DROP：删除数据库和表等对象
  - CREATE：创建数据库和表等对象
  - ALTER：修改数据库和表等对象的结构
- 数据操作语言(Data Manipulation Language,简称DML),如查询、插入、删除、更新数据
  - SELECT：查询表中的数据
  - INSERT：向表中插入新数据
  - UPDATE：更新表中的数据
  - DELETE：删除表中的数据
- 数据控制语言(Data Contral Language,简称DCL),如控制用户访问权限，
  - GRANT：赋予用户操作权限
  - REVOKE：取消用户的操作权限
  - COMMIT：确认对数据库中的数据进行的变更
  - ROLLBACK：取消对数据库中的数据进行的变更

::: warning
- SQL语法不区分大小写，如，关键字create,数据库名、表名和列名；
- 插入的数据是区分大小写的
- SQL语句以分号`;`结尾，可以多行输入
:::
## 数据库
### 登录数据库
- 关键字
  - `mysql`
  - `-h`指定服务器IP地址，本地`127.0.0.1`
  - `-u`指定数据库用户名，如`root`
  - `-P`指定mysql服务端口号，默认3306
  - `-p`指定数据库密码
- 语法
```sql
mysql -h 127.0.0.1 -u root -p
```
- 示例
```sql
mysql -u root -p
Enter password: ******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 20
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```
### 显示数据库
- 关键字
  - `show`
  - `databases`
- 语法
```sql
show databases;
```
- 示例
```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sakila             |
| sys                |
| world              |
+--------------------+
6 rows in set (0.10 sec)
```
### 创建数据库
- 关键字
  - `create`
  - `database`
- 语法
```sql
create database 数据库名;
```
- 示例
```sql
mysql> create database test_db;
Query OK, 1 row affected (0.09 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sakila             |
| sys                |
| test_db            |
| world              |
+--------------------+
7 rows in set (0.00 sec)
```
### 删除数据库
- 关键字
  - `drop`
  - `database`
- 语法
```sql
drop database 数据库名;
```
- 示例
```sql
mysql> drop database test_db;
Query OK, 0 rows affected (0.14 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sakila             |
| sys                |
| world              |
+--------------------+
6 rows in set (0.00 sec)
```
### 使用数据库
- 关键字
  - `use`
- 语法
```sql
use 数据库名;
```
- 示例
```sql
mysql> use test_db
Database changed
```
### 备份数据库
#### mysqldump
- 原理：将待备份数据库的表结构，数据内容转成sql语句存储；还原数据时按顺序执行备份文本中的sql语句。
#### 方式一：备份单个数据库中的指定的表
- 语法
```sql
mysqldump [-h 服务器IP] -u 用户名 -p 数据库名 [表名,...,表名] > 备份文件名
- 主要事项：
  - 表名省略时，表示备份整个数据库
```
- 示例
```sql
C:\Users\shuhaiwen>mysqldump -u root -p test_db >2.sql
Enter password: ******
```
::: warning
1. 语句后不要加结束符`;`
2. 备份时不要进入数据库中
:::
#### 方式二：备份多个数据库
- 语法
```sql
mysqldump [-h 服务器IP] -u 用户名 -p --databases 数据库名 [数据库名...] > 备份文件名
```
- 示例
```sql
C:\Users\shuhaiwen>mysqldump -u root -p --databases test_db >D:\1.sql
Enter password: ******
```
#### 方式三：备份所有数据库
- 语法
```sql
mysqldump -u 用户名 -p --all-databases > 备份文件名
```
- 示例
```sql
mysqldump -u root -p --all_databases >D:\all.sql
Enter password: ******
```
### 还原备份数据库
- 语法
```sql
mysql -u 用户名 -p [数据库名] < 备份数据库名
```
- 示例
```sql
mysql -u root -p test_db <D:\1.sql
Enter password: ******
```
::: warning
当不指定数据库名时，备份的文件中需要有创建数据库语句。比如通过备份数据库方法中的方法二和方法三备份的文件中就含有创建数据库语句。
:::
### 查看数据库支持引擎
- 关键字
  - `show`
  - `engines`
- 语法
```sql
show engines;
```
- 示例
```sql
mysql> show engines;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
```
## 账号管理
### 新建用户
- 使用`create user`命令：
- 关键字
  - `create user`:创建用户
  - `identified by`:指定设置密码
  - `password`:指定密码，当密码不是特殊字符可以省略
- 语法:
```sql
create user 新用户名 [identified by [password] '密码'];
``` 
- 示例
```sql
mysql> create user 'test'@'localhost' identified by '123456';
Query OK, 0 rows affected (0.11 sec)
mysql> use mysql
Database changed
mysql> select User,Host from user;
+------------------+-----------+
| User             | Host      |
+------------------+-----------+
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
| test             | localhost |
+------------------+-----------+
5 rows in set (0.00 sec)
```
::: tip
1. 新用户可以没有密码
:::
### 删除用户
- 使用`drop`命令
- 语法
```sql
drop user 用户名
```
- 示例
```sql
mysql> drop user 'test'@'localhost';
Query OK, 0 rows affected (0.16 sec)

mysql> use mysql
Database changed
mysql> select User from user;
+------------------+
| User             |
+------------------+
| mysql.infoschema |
| mysql.session    |
| mysql.sys        |
| root             |
+------------------+
4 rows in set (0.00 sec)

```
## 表
### 完整性约束条件
|完整性约束条件|说明|
|----|----|
|FOREIGN KEY|外键，关联其它表的主键|
|PRIMARY KEY|主键|
|NOT NULL|不为空|
|UNIQUE|唯一|
|AUTO_INCREMENT|自动增加
|DEFAULT|默认值|
### 创建表
- 关键字
  - `table`
  - `create`
- 语法
```sql
crate table 表名(
属性名 数据类型 [完整性约束条件],
...
...
属性名 数据类型 [完整性约束条件]
);
```
- 示例
```sql
mysql> create table table1(
    -> id int,
    -> name varchar(20),
    -> age tinyint);
Query OK, 0 rows affected (1.40 sec)

mysql> describe table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.08 sec)
```
### 查看表
- 关键字
  - `table`
  - `describe`或`desc`
- 语法
```sql
describe 表名;
```
- 示例
```sql
mysql> describe table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.08 sec)
```
查找更详细的信息
- 语法
```sql
show create table 表名;
```
- 示例
```sql
mysql> show create table table1;
+--------+---------------------------------------------------------+
| Table  |CreateTable                                              |
+--------+---------------------------------------------------------+
| table1 | CREATE TABLE `table1` (
  `id` int DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `age` tinyint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |
+--------+---------------------------------------------------------+
1 row in set (0.13 sec)
```
### 显示所有表
- 关键字
  - `show tables`
- 语法
```sql
show tables;
```
- 示例
```sql
mysql> show tables;
+-------------------+
| Tables_in_test_db |
+-------------------+
| table1            |
+-------------------+
1 row in set (0.02 sec)
```
### 修改表
- 关键字
  - `alter`
  - `table`
#### 修改表名
- 关键字
  - `rename`
- 语法
```sql
alter table 表名 rename 新表名;
```
- 示例
```sql
mysql> alter table table1 rename table2;
Query OK, 0 rows affected (0.75 sec)

mysql> desc table1;
ERROR 1146 (42S02): Table 'test_db.table1' doesn't exist
mysql> desc table2;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.06 sec)
```
#### 修改表字段数据类型
- 关键字
  - `modify`
- 语法
```sql
alter table 表名 modify 属性名 新数据类型; 
```
- 示例
```sql
mysql> alter table table2 rename table1;
Query OK, 0 rows affected (0.44 sec)

mysql> alter table table1 modify id tinyint;
Query OK, 0 rows affected (3.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | tinyint     | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.02 sec)
```
#### 修改表字段名
- 关键字
  - `change`
- 语法
```sql
alter table 表名 change 原属性名 新属性名 新数据类型;
```
- 示例
```sql
mysql> alter table table1 change id ID tinyint;
Query OK, 0 rows affected (0.13 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| ID    | tinyint     | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.06 sec)
```
#### 增加字段
- 关键字
  - `add`
- 语法
```sql
alter table 表名 add 新属性名 数据类型 [完整性约束条件] [first|after 原属性名];
```
- 示例
```sql
mysql> alter table table1 add sex enum('男','女');
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc table1;
+-------+-----------------+------+-----+---------+-------+
| Field | Type            | Null | Key | Default | Extra |
+-------+-----------------+------+-----+---------+-------+
| ID    | tinyint         | YES  |     | NULL    |       |
| name  | varchar(20)     | YES  |     | NULL    |       |
| age   | tinyint         | YES  |     | NULL    |       |
| sex   | enum('男','女') | YES  |     | NULL    |       |
+-------+-----------------+------+-----+---------+-------+
4 rows in set (0.04 sec)
```
#### 删除字段
- 关键字
  - `drop`
- 语法
```sql
alter table 表名 drop 属性名;
```
- 示例
```sql
mysql> alter table table1 drop sex;
Query OK, 0 rows affected (2.90 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| ID    | tinyint     | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.02 sec)
```
#### 删除表的外键
- 关键字
  - `drop`
  - `foreign key`
- 语法
```sql
alter table 表名 drop foreign key 外键别名; 
```
#### 创建表后增加主键外键
- 语法
```sql
alter table 表名 add primary key (字段名)
```
- 示例
```sql
mysql> alter table table1 add primary key(id);
Query OK, 0 rows affected (3.71 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc table1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
| age   | tinyint     | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
3 rows in set (0.05 sec)
- 语法
```
```sql
alter table 表名 add CONSTRAINT 外键约束名称 foreign key (字段名) references 参考的表名 (字段名);
```
```sql
mysql> create table table2(
    -> id int,
    -> primary key(id));
Query OK, 0 rows affected (0.67 sec)

mysql> desc table2;
+-------+------+------+-----+---------+-------+
| Field | Type | Null | Key | Default | Extra |
+-------+------+------+-----+---------+-------+
| id    | int  | NO   | PRI | NULL    |       |
+-------+------+------+-----+---------+-------+
1 row in set (0.06 sec)

mysql> alter table table1 add constraint pk1 foreign key (id) references table2 (id);
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

```
### 删除表
- 关键字
  - `drop`
- 语法
  - `drop table 表名;`
- 示例
```sql
mysql> drop table table1;
Query OK, 0 rows affected (0.53 sec)

mysql> desc table1;
ERROR 1146 (42S02): Table 'test_db.table1' doesn't exist
``` 
## 查询
- 关键字
  - `select from`：查询
  - `where`：通过指定条件查询
  - `group by`：通过指定字段分组
  - `having`：表示满足某条件
  - `order by`：通过指定字段进行排序
  - `asc`或`desc`:降序或升序
- 语法
```sql
select 属性列表 
from 表名或视图名
[where 条件表达式]
[group by 属性名 [having 条件表达式]]
[order by 属性名 [asc|desc]]
```
### 查询条件关键字
- 关键字
  - `in`:指定集合
  - `between and`：指定范围区间
  - `like`：用于模糊匹配字符串
    - `%`:匹配任意长度
    - `_`:匹配单个字符
  - `is null`:判断属性值是否为空
  - `and`或`or`：与和或连接
  - `distinct`:限定查询结果唯一
  - `limit`:限定查询结果记录数
- 语法
```sql
select 属性名集 from 表名 where 属性名 in (值1,...值n);
select 属性名集 from 表名 where 属性名 between 值1 and 值2;
select 属性名集 from 表名 where 属性名 like '字符串';
select 属性名集 from 表名 where 属性名 is null;
select 属性名集 from 表名 where 条件1 and|or 条件2;
select distinct 属性名集 from 表名;
select 属性名集 from 表名 limit 数量;
select 属性名集 from 表名 limit 起始位置,数量;
```
