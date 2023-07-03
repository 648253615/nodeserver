# nodeserver

这是一个基于 Node.js 和 Express 框架构建的 RESTful API Web 应用程序。

## 功能特点

- 使用 jsonwebtoken 提供用户认证和授权功能
- 使用 cors 处理跨域请求
- 使用 mongoose 进行 MongoDB 存储数据
- 使用 multer 实现文件上传功能
- 使用 node-schedule 实现定时任务调度
- 使用 nodemailer 发送电子邮件通知
- 使用 winston 进行日志记录应用程序运行情况

## 安装和运行

```
// 安装依赖项
npm install
// 启动应用程序
npm run start
// 全局安装pm2
npm install pm2 -g
// 使用pm2启动应用程序并进行管理
pm2 start ecosystem.config.js
```