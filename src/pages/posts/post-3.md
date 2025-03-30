---
layout: ../../layouts/MarkdownPostLayout.astro
title: "项目的cmake构建"
author: "Mono"
description: "这篇文章会自己出现在列表中！"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

# CMAKE 介绍

cmake是一个跨平台的构建工具，它不负责具体的编译，它根据CMakeLists.txt在不同的平台下生成不同的构建文件，在linux下一般是makefile,使用CMakeLists.txt来指导项目的构建能很轻松地做到跨平台支持

# 一个简单的 CMakeLists.txt

```cmake
# 设置 CMake 的最低版本要求
cmake_minimum_required(VERSION 3.10)

# 设置项目名称
project(MyProject)

# 添加一个可执行文件
# 将 `main.cpp` 编译成名为 `my_executable` 的可执行文件
add_executable(my_executable main.cpp)
```

主要需要设置cmake最低版本要求，设置项目名字，添加可执行文件和链接库

怎么样，CMAKE很简单吧？

现在让我们看到我们项目的CMakeLists.txt

# 项目的 CMakeLists.txt

## 以 GateServer 为例

```cmake
cmake_minimum_required(VERSION 3.10)



project(gateserver LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_CXX_STANDARD 17)

set(CMAKE_CXX_STANDARD_REQUIRED ON)



#mysql-conn相关

find_package(OpenSSL REQUIRED)



set(MYSQL_CPPCONN_LIB "/usr/lib64/libmysqlcppconn.so" CACHE FILEPATH "MySQL Connector/C++ library")

message(STATUS "Using MySQL Connector/C++ library: ${MYSQL_CPPCONN_LIB}")



find_package(jsoncpp REQUIRED)

find_package(Threads REQUIRED)

find_package(Boost 1.82 COMPONENTS system filesystem atomic thread REQUIRED)

set(protobuf_MODULE_COMPATIBLE TRUE)

find_package(Protobuf CONFIG REQUIRED)

message(STATUS "Using protobuf ${Protobuf_VERSION}")

set(_PROTOBUF_LIBPROTOBUF protobuf::libprotobuf)

set(_REFLECTION gRPC::grpc++_reflection)

# Find gRPC installation

# Looks for gRPCConfig.cmake file installed by gRPC's cmake installation.

find_package(gRPC CONFIG REQUIRED)

message(STATUS "Using gRPC ${gRPC_VERSION}")

set(_GRPC_GRPCPP gRPC::grpc++)

# 添加可执行文件和源文件

file(GLOB SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)

file(GLOB PBSOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc)

add_executable(gateserver ${SOURCES}

${PBSOURCES})

target_link_libraries(gateserver

${_REFLECTION}

${_GRPC_GRPCPP}

${_PROTOBUF_LIBPROTOBUF}

Boost::filesystem

Boost::system

Boost::atomic

Boost::thread

jsoncpp

hiredis

redis++

${MYSQL_CPPCONN_LIB}

OpenSSL::SSL

OpenSSL::Crypto

)

#复制config.ii文件到build 目录

set(Targetconfig ${CMAKE_CURRENT_SOURCE_DIR}/src/config.ii)

set(OutPutDir ${CMAKE_BINARY_DIR})

add_custom_command(TARGET gateserver POST_BUILD

COMMAND ${CMAKE_COMMAND} -E copy_if_different

"${Targetconfig}" "${OutPutDir}/config.ii")
```

怎么样，是不是看起来难多了？
放心，我在做这个项目前也就会一点点cmake，只要去参考up主写的cmake和问ai（这是最主要的），你也能写出这样的一个东西。

## 那我问你，每一块是干啥的

最开始介绍的demo可能过于简单，下面是一个涉及到一个第三方库的cmakelists.txt的demo

```cmake
cmake_minimum_required(VERSION 3.10)
project(JsonCppExample)

# 查找 jsoncpp 库
find_package(JsonCpp REQUIRED)

message(STATUS "找到 JsonCpp 库")

    # 添加可执行文件
add_executable(jsoncpp_example main.cpp)

    # 将 jsoncpp 库链接到可执行文件
target_link_libraries(jsoncpp_example PRIVATE JsonCpp::JsonCpp)


```

对比最简单的版本，基本上就是多了find_package去找到第三方库的位置，然后把第三方库和我们的文件链接到一起。
现在进行讲解

```cmake
#指定cmake的最小版本
cmake_minimum_required(VERSION 3.10)

#指定项目名
project(gateserver LANGUAGES CXX)
#大概是引入当前目录的头文件？
set(CMAKE_INCLUDE_CURRENT_DIR ON)
#设置c++17标准
set(CMAKE_CXX_STANDARD 17)

set(CMAKE_CXX_STANDARD_REQUIRED ON)



#mysql-conn相关

#找到openssl库，这个mysql要用
find_package(OpenSSL REQUIRED)


#这里我强行指定了mysql-connector链接的具体的动态库文件，jdbc风格按理说该链接到这个文件，但是不指定貌似链接器会乱来
set(MYSQL_CPPCONN_LIB "/usr/lib64/libmysqlcppconn.so" CACHE FILEPATH "MySQL Connector/C++ library")

message(STATUS "Using MySQL Connector/C++ library: ${MYSQL_CPPCONN_LIB}")



find_package(jsoncpp REQUIRED)

find_package(Threads REQUIRED)
#这里有boost库需要用的模块
find_package(Boost 1.82 COMPONENTS system filesystem atomic thread REQUIRED)
#下面是grpc和protobuf相关的设置，我直接从up主的博客抄的，具体原理我也不清楚
set(protobuf_MODULE_COMPATIBLE TRUE)

find_package(Protobuf CONFIG REQUIRED
set(_PROTOBUF_LIBPROTOBUF protobuf::libprotobuf)

set(_REFLECTION gRPC::grpc++_reflection)

# Find gRPC installation

# Looks for gRPCConfig.cmake file installed by gRPC's cmake installation.

find_package(gRPC CONFIG REQUIRED)

message(STATUS "Using gRPC ${gRPC_VERSION}")

set(_GRPC_GRPCPP gRPC::grpc++)
```

```cmake
#这里把所有源文件放到了两个变量里面去
file(GLOB SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp)

file(GLOB PBSOURCES ${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc)

#添加可执行文件
add_executable(gateserver ${SOURCES}

${PBSOURCES})

#指定项目要与哪些库链接
target_link_libraries(gateserver

${_REFLECTION}

${_GRPC_GRPCPP}

${_PROTOBUF_LIBPROTOBUF}

Boost::filesystem

Boost::system

Boost::atomic

Boost::thread

jsoncpp

hiredis

redis++

${MYSQL_CPPCONN_LIB}

OpenSSL::SSL

OpenSSL::Crypto

)

#复制config.ii文件到build 目录
#每次执行cmake会检查一遍config.ii有没有变化，有变化就复制到build目录下，但貌似总是出问题（变了也不复制），建议改成qt里面那样直接使用file命令每次执行cmake都复制一次
set(Targetconfig ${CMAKE_CURRENT_SOURCE_DIR}/src/config.ii)

set(OutPutDir ${CMAKE_BINARY_DIR})

add_custom_command(TARGET gateserver POST_BUILD

COMMAND ${CMAKE_COMMAND} -E copy_if_different

"${Targetconfig}" "${OutPutDir}/config.ii")
```

其他几个服务器基本上在这个的基础上改改项目名，可执行文件名就可以了

## 构建

### 手动

```bash
cd /workdir
mkdir build
cd build
cmake .. -G Ninja
ninja
./gateserver
```

这里的操作基本和编译第三方库一样

### 自动

使用VSCode的CMakeTools插件，可以通过ctrl+shift+p搜索cmake相关的操作去构建，也可以在这里指定编译的类型(release or debug or ....)，可以在VSCode的setting里指定ninja做生成器

```json
"cmake.generator": "Ninja"
```
