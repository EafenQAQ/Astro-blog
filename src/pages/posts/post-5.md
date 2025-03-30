---
layout: ../../layouts/MarkdownPostLayout.astro
title: "CICD集成-高度可复用的github action脚本"
author: "Mono"
description: "这也是一个一个CICD啊啊啊"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

# 介绍
	在对所有服务器做了dockerfile封装后，可以很轻松的做到CI/CD集成，本文设计的github actions脚本简单，高度可复用

# 脚本
	在github仓库的Actions里面创建脚本，内容如下
```yaml
name: ci/cd Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    name: build and cache docker image 
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write 
    
    steps:
      - name: checkout code
        uses: actions/checkout@v4
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build and cache image (GHCR)
        uses: docker/build-push-action@v5
        id: docker_build_push_final
        with:
          context: .
          file: ./Dockerfile
          target: final
          push: true
          cache-from: type=registry,ref=ghcr.io/${{ github.repository }}-final:cache
          cache-to: type=registry,ref=ghcr.io/${{ github.repository }}-final:cache,mode=max
          tags: ghcr.io/${{ github.repository }}-final:latest
                  # 构建并推送test镜像
      - name: Build and push test image
        uses: docker/build-push-action@v5
        id: docker_build_push_test
        with:
          context: .
          file: ./Dockerfile
          target: test  # 这里指定test阶段
          push: true
          cache-from: type=registry,ref=ghcr.io/${{ github.repository }}-test:cache
          cache-to: type=registry,ref=ghcr.io/${{ github.repository }}-test:cache,mode=max
          tags: ghcr.io/${{ github.repository }}-test:latest

  deploy:
      name: Deploy to Server
      needs: build
      runs-on: ubuntu-latest
      steps:
        - name: SSH Deploy
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.SSH_HOST }}
            username: ${{ secrets.SSH_USER }}
            key: ${{ secrets.SSH_PRIVATE_KEY }}
            script: |
              echo "Pulling latest Docker image..."
              cd chatPro
              docker-compose pull
              docker-compose up -d
```

	一个github action应该包括触发时机，任务。
	这个脚本在代码push后，执行两个任务
	- 拉取新的源码构建镜像，推送到ghrc仓库（github提供的类似dockerhub）的仓库
	- ssh到服务器更新实例

	下面做简单讲解
```yaml
name: ci/cd Pipeline
on:
  push:
    branches: [main]

```

	定义这个workflow的名字叫“ci/cd Pipeline"，定义main分支的Push操作为触发器

```yaml
jobs:
  build:
    name: build and cache docker image 
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write 
    
    steps:
      - name: checkout code
        uses: actions/checkout@v4
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build and cache image (GHCR)
        uses: docker/build-push-action@v5
        id: docker_build_push_final
        with:
          context: .
          file: ./Dockerfile
          target: final
          push: true
          cache-from: type=registry,ref=ghcr.io/${{ github.repository }}-final:cache
          cache-to: type=registry,ref=ghcr.io/${{ github.repository }}-final:cache,mode=max
          tags: ghcr.io/${{ github.repository }}-final:latest
                  # 构建并推送test镜像
```

	定义要做的工作，第一个工作是`build`,给了它读写的权限。
	首先，登录到ghrc仓库，`github.repository_owner和secrets.GITHUB_TOKEN`是github提供的宏，不用去设置，按理说后面你推送到这个仓库的同名ghcr仓库的话，这一步登录都不需要做，但是我肯定是遇到了奇怪的情况...

	接着，根据仓库根目录里的dockfile构建镜像，把镜像缓存到ghcr.io/${{ github.repository }}-final:cache，把最终生成的final镜像推送到ghcr.io/${{ github.repository }}-final:latest，这里的也是github提供的宏，会自动替换成我们的仓库名，也不用手动设置


```yaml
deploy:
      name: Deploy to Server
      needs: build
      runs-on: ubuntu-latest
      steps:
        - name: SSH Deploy
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.SSH_HOST }}
            username: ${{ secrets.SSH_USER }}
            key: ${{ secrets.SSH_PRIVATE_KEY }}
            script: |
              echo "Pulling latest Docker image..."
              cd chatPro
              docker-compose pull
              docker-compose up -d
```

	部署任务，给github我们的服务器host，ssh秘钥，用户名，这些要在仓库的设置里`secrets and varibles`里提供，github的虚拟机会拿着我们的秘钥登录到服务器，然后执行`docker-compose`脚本，自动完成服务的更新，脚本内容如下


```yaml
services:
  chatserver:
    image: ghcr.io/github-newstar/chatserver-final:latest
    container_name: chatserver1
    ports:
      - "8091:8091"
    restart: always
    networks:
    - chat-net
  gateserver:
    image: ghcr.io/github-newstar/gateserver-final:latest
    container_name: gateServer
    ports:
      - "8080:8080"
    restart: always
    networks:
    - chat-net

  statusserver:
    image: ghcr.io/github-newstar/statusserver-final:latest
    container_name: statusServer
    restart: always
    networks:
    - chat-net
  varifyserver:
    image: jojo114514/varifyserver
    container_name: varifyServer
    restart: always
    networks:
    - chat-net
  mysql:
    image: mysql:8.0
    container_name: mq
    ports:
        - "3306:3306"
    volumes:
        - "myconf:/etc/mysql/my.cnf"
        - "mydata:/var/lib/mysql"
        - "mylog:/logs"
    environment:
        - "MYSQL_ROOT_PASSWORD=123456"

    restart: always
    networks:
    - chat-net

networks:
  chat-net:
    driver: bridge
volumes:
  myconf:
    # 你可以在这里指定卷的驱动等选项，例如：
     driver: local
  mydata:
     driver: local
  mylog:
     driver: local
```
	这里相当于通过配置文件的方式，把docker run的那些命令固定下来了，自己开发的话吧把image里面的镜像替换成自己的ghrc仓库的镜像。
	主要是文件挂载和网络编排，把mysql的数据和配置做持久化。
	然后让几个服务器和mysql、redis加入同一个docker network,这里是chat-net，在同一个docker network里的容器可以直接通过容器名访问彼此，也就是host字段写容器名就可以了，docker会自动为我们做域名解析。这样的好处是在本地开发和云端开发可以保持config.ii里面的host字段不用修改。
	如果本地我们在一个容器里开发几个服务器的话，我们可以直接修改host文件，让这些容器名映射到127.0.0.1，这样他们也可以通过名字相互访问到，非常地方便啊~~~

# 总结
	自此，服务端的CI/CD 基本全部完成，快提交代码试试吧！