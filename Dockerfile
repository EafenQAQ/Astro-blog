# 使用 Node.js 作为基础镜像来构建 Astro 站点
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件
COPY . .

# 构建 Astro 站点
RUN npm run build

CMD ["npm","run", "dev"]