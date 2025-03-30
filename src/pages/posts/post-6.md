---
layout: ../../layouts/MarkdownPostLayout.astro
title: "单元测试和性能测试集成"
author: "Mono"
description: "这是一个一个测试思路啊啊啊"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

# 介绍
	服务器的CICD和docker封装是整个流程中最难的部分，下面可以往里面集成py性能测试脚本和用gTest编写测试用例，参考前面的流程，只需要对dockerfile做修改就可以。
	代码见：
	https://github.com/github-newstar/pytest

## 思路
	用py的request编写业务测试的流程，主要是拿验证码，注册，用户登录，起多个线程做数据库的压力测试。对于验证码接口，用wrk做极限性能测试。验证码直接从redis里面拿。
	代码实现不做详细讲解，我自己也不是很熟，其实有思路以后，让ai给你写就行了。
	做压力测试的时候，数据库的性能表现非常差，主要优化思路是：
	- 降低隔离等级为读提交
	- 修改事务利用主键自增
	- 修改缓存池，连接量的设置
	- 一些别的设置的修改
	注意，py做性能测试的时候，不要起一堆连接同时去测试，短时间内这样的压力太大了，后端会直接崩掉，应该加入一定的随机间隙。
	wrk用可以用lua做定制，也让ai写好了。
	单元测试用gTest编写，说实话基本上是一个体力活，我也是让ai给我写的。其中很多类由于用了单例模式，没法直接用gMock模拟出来。所以最终这个gTest封装好的实例在服务器上连接了真实的redis跑的测试。


	本地写完脚本以后，封装成dockfile，直接把之前的github action脚本粘贴到仓库里，啥都不用改（复用性很强吧）。在服务器上的docker-compose做简单的配置，就完成自动化测试了。

	最终，做本地修改测试的参数然后提交，代码就会自动封装成新的测试镜像，部署到服务器上测试。
	更详细的测试方案在这套流程的基础上添加即可。

