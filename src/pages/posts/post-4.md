---
layout: ../../layouts/MarkdownPostLayout.astro
title: "CICD集成-dockerfile封装"
author: "Mono"
description: "这是一个一个CICD啊啊啊"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

# 介绍
	本文将把服务器的所有基础环境封装成docker image,并使用多阶段构建的技术，抛弃生产镜像所不需要的依赖，大幅减少最终部署在云服务器上的镜像大小。CICD脚本见下一节
	整体效果为：
	代码push到github->触发cicd工作流->自动白嫖github的虚拟机完成源码编译和生产镜像的构建和推送->自动化部署到云服务器上
	涉及到的知识包括：dockerfile, docker-compose, github actions
	强烈建议学习完整个项目的Linux环境配置后再看

# 环境准备
1. 使用git管理代码，并且绑定到github上的仓库
2. 呃，基本没了

# dockerfile构建

### 共用的基础编译镜像

```dockerfile
#-------------------构建基础编译镜像
#server共用的编译环境
FROM ubuntu:22.04 AS base-image

#设置工作目录
WORKDIR /app

#必要的包
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gdb \
    git \
    curl \
    wget \
    vim \
    ninja-build

#boost库相关
RUN apt-get install -y  autotools-dev libicu-dev build-essential libbz2-dev libboost-all-dev

#更新证书
RUN apt-get  install -y ca-certificates --no-install-recommends

#下载boost源码
RUN wget https://archives.boost.io/release/1.82.0/source/boost_1_82_0.tar.gz


RUN tar zxvf boost_1_82_0.tar.gz && \
    cd boost_1_82_0 && \
    ./bootstrap.sh --prefix=/usr/ && \
    ./b2 install -j$(nproc)

#下载安装cmake
RUN wget https://github.com/Kitware/CMake/releases/download/v3.27.0/cmake-3.27.0.tar.gz && \
    apt install libssl-dev -y && \
    tar -zxvf cmake-3.27.0.tar.gz && \
    cd cmake-3.27.0 && \
    ./bootstrap && \
    make -j$(nproc) && \
    make install && \
    cmake --version
    
#jsoncpp安装
RUN apt-get install -y libjsoncpp-dev

#调整jsoncpp的位置和项目所使用的路径相同
RUN mv /usr/include/jsoncpp/json /usr/include/json

#grpc安装相关
RUN git clone -b v1.34.0 https://gitee.com/mirrors/grpc-framework.git grpc && \
    cd grpc && \
    git submodule update --init 

#编译
RUN cd grpc && mkdir build && \
    cd build && \
    sed -i '1i#include <limits>' ../third_party/abseil-cpp/absl/synchronization/internal/graphcycles.cc && \
    sed -i 's/std::max(SIGSTKSZ, 65536)/std::max(SIGSTKSZ, static_cast<long int>(65536))/g' ../third_party/abseil-cpp/absl/debugging/failure_signal_handler.cc && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr -G Ninja  && \
    ninja && \
    ninja install

#安装 hiredis
WORKDIR /app
RUN git clone https://github.com/redis/hiredis.git && \
    cd hiredis && \
    mkdir build && \
    cd build && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install

#安装 redis-plus-plux
RUN git clone https://github.com/sewenew/redis-plus-plus.git && \
    cd redis-plus-plus && \
    mkdir build && \
    cd build && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install

#安装 mysql-connector-c++
RUN wget  https://downloads.mysql.com/archives/get/p/20/file/mysql-connector-c%2B%2B-8.3.0-src.tar.gz && \
    tar -zxvf mysql-connector-c++-8.3.0-src.tar.gz && \
    cd mysql-connector-c++-8.3.0-src && \
    mkdir build && \
    cd build && \
    apt install libmysqlclient-dev -y && \
    cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DWITH_JDBC=ON -DCMAKE_BUILD_TYPE=Release && \
    ninja && \
    ninja install

#更新环境变量
RUN echo "/usr/lib64" >> /etc/ld.so.conf.d/mysql-connector-cpp.conf && \
    ldconfig

```

	不难发现，这不就是把之前配置环境的命令写到dockerfile里面了吗？
	没错，就这么简单~
	怎么样，linux很神奇吧~~~

	这个文件编译出来的dockerfile体积是比较大的，原因是docker的缓存机制
	docker会按命令，自上而下的缓存每次命令执行的结果。
	
	在我们手动编写dockerfile的时候，利用这个缓存机制，把不怎么变动的部分写到前面，然后再不停地写一点，生成一个镜像实例化来debug,具体表现就是把第三方库的下载和编译拆开（说的就是你的grpc!)

	但是，当我们在后面的命令中把前面下面的文件做清除，则只是标记为不可见，后面的命令没办法影响前面的缓存，所以写完整个dockerfile之后，我们需要把能合并的命令镜像合并，在一条命令里下载代码，构建，清理现场

	呃，这里好像只有boost库和grpc没合并，盲猜是我忘记了，这个任务交给你罢（赞赏）

	编写好以后用`docker build  -t  image-name  .`来构建镜像
	测试完毕后用`docker tag`给本地的镜像打个标签，然后发布到dockerhub上，我的是
	`jojo114514/base-image`,这样每次github都可以直接拉这个镜像来编译了。

	你也不想每次触发CICD都花30分钟在构建环境上吧~
	
## 多阶段构建的定制

### builder阶段
```dockerfile
#base-image编译了基础的环境，已经发布到dockerhub省得每次都要编译

#--------------------编译gateserver

#gateserver的编译
FROM jojo114514/base-image AS builder
WORKDIR /root/code/gateserver
#COPY目录下的最新代码
COPY . .
#构建
RUN mkdir build && \
cd build && \
cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
ninja
```

	非常的简单啊，我们认为这个dockerfile在源码的同级目录下，它拉取了我们的基础构建环境，在这个环境的基础上，把源码复制到容器里，并且编译成二进制文件。

### final阶段

```dockerfile
#-------------------构建最终发布镜像
FROM ubuntu:22.04 AS final
WORKDIR /root
RUN apt-get update && apt-get install -y --no-install-recommends \
ca-certificates \
libicu70 \
libssl3 \
libstdc++6 \
libmysqlclient21 \
&& rm -rf /var/lib/apt/lists/*
# 从构建阶段复制必要的库文件
# Boost库
COPY --from=builder /usr/lib/libboost_*.so* /usr/lib/
# JsonCpp库
COPY --from=builder /usr/lib/x86_64-linux-gnu/libjsoncpp* /usr/lib

# gRPC及相关库
COPY --from=builder /usr/lib/libgrpc*.so* /usr/lib/
COPY --from=builder /usr/lib/libprotobuf.so* /usr/lib/
COPY --from=builder /usr/lib/libabsl*.so* /usr/lib/
COPY --from=builder /usr/lib/libupb*.so* /usr/lib/
COPY --from=builder /usr/lib/libaddress_sorting.so* /usr/lib/
COPY --from=builder /usr/lib/libgpr.so* /usr/lib/
# Redis相关库
COPY --from=builder /usr/lib/x86_64-linux-gnu/libredis* /usr/lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libhiredis* /usr/lib/
COPY --from=builder /usr/lib/libredis++.so* /usr/lib/
# MySQL C++ 连接器
COPY --from=builder /usr/lib64/libmysqlcppconn*.so* /usr/lib64/
# 拷贝二进制文件
COPY --from=builder /root/code/gateserver/build/gateserver /root/gateserver/gateserver
COPY --from=builder /root/code/gateserver/build/config.ii /root/gateserver/config.ii
# 更新动态链接器配置
RUN echo "/usr/lib64" >> /etc/ld.so.conf.d/mysql-connector-cpp.conf && \
ldconfig

WORKDIR /root/gateserver
CMD ["/root/gateserver/gateserver"]
```

	非常的简单啊，主要工作就是起了一个新的ubuntu:22.04，下载一些必要的依赖，然后从build阶段的镜像里面把动态库和服务器的二进制文件拷贝过来，最后指定了容器启动的默认行为，也是运行gateserver。最终的这个final镜像体积只有100多M

### 完整的dockerfile

	就是把builder和final拼接到一起了
```dockerfile
#base-image编译了基础的环境，已经发布到dockerhub省得每次都要编译

#--------------------编译gateserver

#gateserver的编译
FROM jojo114514/base-image AS builder
WORKDIR /root/code/gateserver
#COPY目录下的最新代码
COPY . .
#构建
RUN mkdir build && \
cd build && \
cmake .. -G Ninja -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Release && \
ninja
#-------------------构建最终发布镜像

FROM ubuntu:22.04 AS final
WORKDIR /root
RUN apt-get update && apt-get install -y --no-install-recommends \
ca-certificates \
libicu70 \
libssl3 \
libstdc++6 \
libmysqlclient21 \
&& rm -rf /var/lib/apt/lists/*
# 从构建阶段复制必要的库文件
# Boost库
COPY --from=builder /usr/lib/libboost_*.so* /usr/lib/
# JsonCpp库
COPY --from=builder /usr/lib/x86_64-linux-gnu/libjsoncpp* /usr/lib

# gRPC及相关库
COPY --from=builder /usr/lib/libgrpc*.so* /usr/lib/
COPY --from=builder /usr/lib/libprotobuf.so* /usr/lib/
COPY --from=builder /usr/lib/libabsl*.so* /usr/lib/
COPY --from=builder /usr/lib/libupb*.so* /usr/lib/
COPY --from=builder /usr/lib/libaddress_sorting.so* /usr/lib/
COPY --from=builder /usr/lib/libgpr.so* /usr/lib/
# Redis相关库
COPY --from=builder /usr/lib/x86_64-linux-gnu/libredis* /usr/lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libhiredis* /usr/lib/
COPY --from=builder /usr/lib/libredis++.so* /usr/lib/
# MySQL C++ 连接器
COPY --from=builder /usr/lib64/libmysqlcppconn*.so* /usr/lib64/
# 拷贝二进制文件
COPY --from=builder /root/code/gateserver/build/gateserver /root/gateserver/gateserver
COPY --from=builder /root/code/gateserver/build/config.ii /root/gateserver/config.ii
# 更新动态链接器配置
RUN echo "/usr/lib64" >> /etc/ld.so.conf.d/mysql-connector-cpp.conf && \
ldconfig

WORKDIR /root/gateserver
CMD ["/root/gateserver/gateserver"]
```
	通过这个dockerfile可以很轻松的用docker build构建出我们需要的镜像

## varifyserver
	这个使用node.js编写，用npm运行，所以简单地多，注意，最好不要把config.json文件封装到dockerfile里，这里面有你的邮箱秘钥
	
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 50051
#下面的这个命令按你自己配置来
CMD [ "npm","run", "server"]

```

	很快啊，就起了一个varifyserver

