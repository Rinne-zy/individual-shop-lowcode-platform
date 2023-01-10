import mongoose from 'mongoose';

/** mongodb 连接配置 */
export interface MongodbConfig {
  // 用户名
  username: string;
  // 密码
  pwd: string;
  // 表名
  dbName: string;
  // 数据库连接地址
  dbConnectHost: string;
}

/**
 * 初始化 mongodb 连接
 * @param config mongodb 连接配置
 */
export default async function initConnect(config: MongodbConfig) {
  mongoose.set('strictQuery', false)
  const { username, pwd, dbName, dbConnectHost } = config;
  const connectUrl = `mongodb://${username}:${pwd}@${dbConnectHost}/${dbName}?authMechanism=DEFAULT&authSource=${dbName}`;
  try {
    await mongoose.connect(connectUrl, {
      autoCreate: true,
    });
    console.log('数据库连接成功');
  } catch (err) {
    console.error('数据库连接失败：', err);
  }
}