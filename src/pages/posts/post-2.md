---
layout: ../../layouts/MarkdownPostLayout.astro
title: "基于docker的linux开发环境配置"
author: "mono"
description: "这是一个一个Linux的开发环境配置"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

---


# 简介
	本文将简要介绍聊天室后端的开发环境的搭建，主要包括第三方库的手动编译，必要的开发组件安装，主要参考资料为llfc的博客，本文中的大部分操作都可以直接封装在dockerfile里实现

# 让我们搞开发

## 必要组件

	首先，咱们起一个ubuntu22.04容器（up主使用的18.04容器在编译mysql-connector库的时候会遇到编译依赖的依赖的依赖的套娃问题，别问我怎么知道的...)
```bash
docker run -itd --name uun -p 8080:8080 -v mycode:/root/code ubuntu:22.04
```

	简单介绍参数：
	- `-itd` it 以交互模式模拟一个终端运行 d 后台行为 如果不加这个容器启发以后就没有默认的行为，会直接关闭
	- '-p'  端口映射 把宿主机的8080端口映射到容器里的8080端口上，注意，容器里的网络和宿主机的网络是两个网络，各自的localhost实际上是不同的，这里映射8080主要是为后面的gateserver准备的，不过，其实整个项目不只需要这一个端口（坏笑.jpg)
	- '-v' 卷挂载，容器的设计理念是每次重启数据都会清空（目前发现Mysql是这样）,这里使用具名卷持久化我们的代码文件夹，方便多个容器共享代码，注意 **mycode** 这个具名卷需要用`docker volumes create mycode`提前创建
	- 这里的 -p -v 都是前面的宿主机的资源 后面是容器里的资源

	可能的问题：
	- 容器一直重启  见itd说明
	- 容器提示bind端口的被占用之类的
		- 其他容器占用了宿主机的端口，可以改成宿主机的映射端口
		- 部分端口让windows给保留了，就是不让用，拷打ai让它告诉你怎么暂时关闭win net之类的东西，然后就可以绑定这个端口了  或者  使用命令解除对某个端口的占用

	 接着使用
	 `docker -it exec uun /bin/bash`
	 或者使用VSCode的远程开发进入到容器里，开始安装开发依赖吧

1. 更新软件源
```bash
apt-get update
```

2. 安装必要的包
```bash
apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gdb \
    git \
    curl \
    wget \
    vim \
    ninja-build \
    libssl-dev
    ca-certificates
```

简单解释：
	- build-essential  gcc g++工具包
	- gdb  调试器  vscode远程调试需要这个
	- git 版本管理工具
	- curl / wget 下载工具
	- vim 文本编辑器
	- ninja-build 并行化编译工具，和make是一个层级的，能大幅加速编译
	- libssl-dev  ssl库 后面会用到
	- ca-certificates 应该是一些证书的秘钥 下在源码的时候需要做验证

	另外，推荐使用clangd做vscode的代码补全插件， 这个插件会弹窗提示你下载clang,
clangd是和gcc一个层级的编译器，编译快，效率高，但是不要使用这个东西来编译整个项目的第三方库和项目，因为linux上大部分库都是基于gcc编译的，在没有搞清楚依赖的情况下使用clang可能会遇到严重的编译链接错误（别问我怎么知道的....)

	下载不下来请考虑换源和魔法

3. 测试g++版本和命令
```bash
1. `echo '#include <iostream>' > test.cpp`
2. `echo 'int main() { std::cout << __cplusplus << std::endl; return 0; }' >> test.cpp`
3. `g++ -std=c++17 test.cpp -o test`
4. `./test`
```

## 第三方库
1. 从源码安装编译boost库
```bash
wget https://archives.boost.io/release/1.82.0/source/boost_1_82_0.tar.gz
tar zxvf boost_1_82_0.tar.gz && \
    cd boost_1_82_0 && \
    ./bootstrap.sh --prefix=/usr/ && \
    ./b2 install -j$(nproc)
```

	- boost源码从官网下载，出于兼容问题（包括对llfc的asio网络编程的兼容）使用1.82版本。
	- ./bootstrap.sh是make文件生成配置脚本  --prefix=指定了库的文件的安装目录 
	 - ./b2 install 开始编译  -j$(nproc)  按cpu核心数并行编译 这个应该是make的参数
	 
2. 编码测试
```bash
vim ./boosthello.cpp
```
```cpp
1. `#include <iostream>`
2. `#include <boost/version.hpp>`
3. `using namespace std;`
4. `int main() {`
5. `cout << "Boost 版本" << BOOST_VERSION << endl;`
6. `return 0;`
7. `}`
```
```bash
g++ -o boosthello ./boosthello.cpp
./boosthello
```

3. 安装jsoncpp

```bash
apt install -y libjsoncpp-dev
```

	最简单的一集，当时就是被这个东西骗到了，以为linux所有库的安装都这么简单.....
	`注意，由于jsoncpp的头文件安装在`/usr/include/jsoncpp/json/`下，出于对up主源码的兼容，把`json`文件夹放到了`/usr/include`文件夹下
```bash
mv /usr/include/jsoncpp/json  /usr/include/json
```

4. 下载编译cmake 3.27
```bash
wget https://github.com/Kitware/CMake/releases/download/v3.27.0/cmake-3.27.0.tar.gz && \
    tar -zxvf cmake-3.27.0.tar.gz && \
    cd cmake-3.27.0 && \
    ./bootstrap && \
    make -j$(nproc) && \
    make install && \
    cmake --version

```

	- 这里使用cmake3.27的原因仅仅是因为up主的配置是这样，其他版本我没有做过兼容性检查

5. 下载编译grpc（最困难的一集）
```bash
git clone -b v1.34.0 https://gitee.com/mirrors/grpc-framework.git grpc && \
    cd grpc && \
    git submodule update --init 

```
	这里下载会很慢，grpc使用了很多子仓库，在做submodule update的时候，会把子仓库也更新

```bash
cd grpc && mkdir build && \
    cd build && \
    sed -i '1i#include <limits>' ../third_party/abseil-cpp/absl/synchronization/internal/graphcycles.cc && \
    sed -i 's/std::max(SIGSTKSZ, 65536)/std::max(SIGSTKSZ, static_cast<long int>(65536))/g' ../third_party/abseil-cpp/absl/debugging/failure_signal_handler.cc && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr -G Ninja  && \
    ninja && \
    ninja install
```

	- 所有能使用cmake编译的库的编译思路都是在根目录下创建一个build目录，到这个目录里使用cmake生成配置文件然后编译
	- 这里的两个sed是因为在编译的过程中会提示两个错误，一个某个文件缺少<limitx>头文件，另一个是类型问题，不使用sed你自己编译的时候出错了去改对于的文件也许
	- cmake ..表示CMakeLists.txt在父目录中， -DCMAKE_BUILD_TYPE=Release 表示使编译release版本 -DCMAKE_INSTALL_PREFIX=/usr 表示安装目录在/usr下 -G Ninja 表示使用ninja做生成器  注意  ninja远比make快，我们的项目也会使用ninja加速编译
	- ninja && ninja install 用法类似make

6. 安装hiredis和redis-plus-plus
```bash
git clone https://github.com/redis/hiredis.git && \
    cd hiredis && \
    mkdir build && \
    cd build && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install

#安装 redis-plus-plux
git clone https://github.com/sewenew/redis-plus-plus.git && \
    cd redis-plus-plus && \
    mkdir build && \
    cd build && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install

```
	公式化安装，没啥好说的

7. 安装mysql-connector-c++（最糊涂的一集）
```bash
wget  https://downloads.mysql.com/archives/get/p/20/file/mysql-connector-c%2B%2B-8.3.0-src.tar.gz && \
    tar -zxvf mysql-connector-c++-8.3.0-src.tar.gz && \
    cd mysql-connector-c++-8.3.0-src && \
    mkdir build && \
    cd build && \
    apt install libmysqlclient-dev -y && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DWITH_JDBC=ON -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install
```

	- mysql-connector-c++默认不会开启jdbc风格库的编译，需要手动指定-WITH_JDBC=ON 
	- 这个库编译的时候需要Mysql客户端相关的库，所以libmysqlclient-dev是必要的
	- 头文件的安装路径大体都在/usr/include下，动态库文件安装位置完全没搞懂，甚至我现在还是不是很笃定到底使用了哪个具体的动态库文件
```bash
echo "/usr/lib64" >> /etc/ld.so.conf.d/mysql-connector-cpp.conf && \
    ldconfig
```
	mysql-connector的动态库文件基本在/usr/lib64下，为了能正确链接，把这个写入到连接器的目录里并更新


	恭喜你，完成了整个聊天室后端的环境搭建，如果你不是很闲的话（且不需要再ubuntu里开发qt的话），下面的内容就可以不用看了。

## Docker里的qt编译环境搭建
	
	能看到这，说明你也是一个不怕折腾的人。
	既然喜欢折腾，就折腾个够吧。
	所以下面的内容不会特别详细。

### 搭建的目的和思路
	 我个人主要出于出qt creator的嫌弃和希望能保持所有的代码编写行为都在VSCode中完成，做了这个事。
	 最终的效果是，在VSCode里编辑ubuntu容器里的qt代码，代码变更实时反馈的windows 上的qt代码上，可以在ubuntu里编译代码，也可以带windows上编译，在windows上做ui编辑等操作

1. windows上安装qt creator
	建议使用5.15版本的库，可以去找国内的镜像源的存档，具体过程在网上有大量教学。
	
2. 起一个ubuntu容器专门做qt编辑编译
	 正常起一个ubuntu:22.04,网上也有带桌面环境的容器，可以在容器中完成所有开发操作，个人认为没必要用带桌面的，起容器的同时使用docker 的卷挂载把windows 上创建的qt 项目的目录挂载到容器里
```bask
docker windows上的qt项目路径：容器里的路径
```
	这样就做到代码实时反馈和更新了
	
3. ubuntu里安装qt
	 强烈建议使用5.15.9或者更后面的5.15版本，我几次编译5.15.0都遇到了缺少符号的问题
	 
4. 配置lsp和cmake
	 clangd默认也只能读到include文件夹下面的头文件，可以通过.clangd设置qt库的位置，也可以使用`compile_commands.json`，这个文件指定了对源文件的编译规则，cmake能生成这个，也可以使用VSCode的设置指定clangd使用的编译命令文件夹为工作目录下的build:
```json
"clangd.compilationDatabasePath": "${workspaceFolder}/build",
```

5. qt前端的cmake文件编写
```cmake
cmake_minimum_required(VERSION 3.5)

project(chatPro LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)



find_package(Qt5 COMPONENTS Widgets REQUIRED Network)
file(GLOB CPP_SRC "./*.cpp")
file(GLOB H_SRC "./*.h")
file(GLOB UI_SRC "./*.ui")

  add_executable(chatPro
      ${CPP_SRC}
      ${H_SRC}
      ${CHARPRO_UIS}
      ${UI_SRC}  )

target_link_libraries(chatPro PRIVATE Qt5::Widgets Qt5::Network)
# set(TargetConfig "${CMAKE_SOURCE_DIR}/config.ii")
# # 指定目标配置文件
# # 将路径中的 / 转换为 Windows 风格的 \\
# #string(REPLACE "/" "\\" TargetConfig ${TargetConfig})

# # 设置输出目录
# set(OutputDir "${CMAKE_BINARY_DIR}")

# if(NOT UNIX)
#     # 将路径中的 / 转换为 Windows 风格的 \\
#     string(REPLACE "/" "\\" TargetConfig ${TargetConfig})
#     string(REPLACE "/" "\\" OutputDir ${OutputDir})

#     add_custom_command(TARGET chatPro POST_BUILD
#         COMMAND ${CMAKE_COMMAND} -E copy_if_different
#         "${TargetConfig}" "${OutputDir}"
#     )
# endif()

if(NOT UNIX)
    file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/config.ii DESTINATION ${CMAKE_BINARY_DIR})
    file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/res DESTINATION ${CMAKE_BINARY_DIR})
    file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/style DESTINATION ${CMAKE_BINARY_DIR})
    file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/static DESTINATION ${CMAKE_BINARY_DIR})
endif()

```

	简单说明，这里基本就是用cmake去配置整个项目，把.h .cpp .ui文件都添加到项目里，然后使用file命令把项目的一些素材和配置文件拷贝到build文件夹下面。
	 注意，qt开发时，涉及到ui操作，先用creator build一下，把新的ui文件生成，linux里才能识别到新的ui文件或者文件的变更


# 更大的折腾方向

	使用conan做依赖管理，可以做到每个项目定制一个环境，比手动编译的方式更加方便和清晰。
	问题是，我不会....
	conan官方提供的包都很新，大概率得我们自己搭建conan服务器
	留给更勇敢的少年去探索吧~
?
