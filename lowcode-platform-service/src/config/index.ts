import dotenv from 'dotenv';
dotenv.config();

const config = {
  // node 服务配置
  server: {
    port: Number(process.env.SERVER_PORT) || 3300,
  },
  // mongodb 配置
  mongodb: {
    // 连接主机
    dbConnectHost: process.env.DB_CONNECT_HOST || '127.0.0.1:27017',
    // 用户名
    username: process.env.DB_USER_NAME,
    // 密码
    pwd: process.env.DB_PWD,
    // 数据库表名
    dbName: process.env.DB_NAME,
  }
};

export default config;