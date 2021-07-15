---
title: Linux技巧
date: 2021-06-21
sidebarDepth: 2
tags:
 - Linux
categories:
 - Linux
---
# Linux技巧
## 文件防误删
### 方法一:ln硬链接备份
- 示例
```shell
ln src dest.link 
```
### 方法二:chattr禁止删除
**注意：需要root权限**
-示例
```shell
chattr +i file
```
## 查看系统相关信息
### 查看内存信息
```shell
cat /proc/meminfo
```
### 查看某一进程系统资源占用信息
- 在`/proc/[PID]`目录下有以下文件(PID是进程号)
```shell
$ ls  /proc/1958076
attr       clear_refs       cpuset   fd       limits     mem         net        oom_score      projid_map  setgroups  statm    timers
autogroup  cmdline          cwd      fdinfo   loginuid   mountinfo   ns         oom_score_adj  root        smaps      status   uid_map
auxv       comm             environ  gid_map  map_files  mounts      numa_maps  pagemap        sched       stack      syscall  wchan
cgroup     coredump_filter  exe      io       maps       mountstats  oom_adj    personality    sessionid   stat       task
```
#### 查看io信息
```shell
$ cat /proc/1958076/io
rchar: 21911
wchar: 1420
syscr: 53
syscw: 5
read_bytes: 0
write_bytes: 4096
cancelled_write_bytes: 0
```
- 参数解释如下：
  - `rchar`:读出的总字节数，read或者pread()中的长度参数总和（pagecache中统计而来，不代表实际磁盘的读入）
  - `wchar`:写入的总字节数，write或者pwrite中的长度参数总和
  - `syscr`:read()或者pread()总的调用次数 
  - `syscw`:write()或者pwrite()总的调用次数 
  - `read_bytes`:实际从磁盘中读取的字节总数   (这里if=/dev/zero 所以没有实际的读入字节数)
  - `write_bytes`:实际写入到磁盘中的字节总数
  - `cancelled_write_bytes`:由于截断pagecache导致应该发生而没有发生的写入字节数（可能为负数）
#### status