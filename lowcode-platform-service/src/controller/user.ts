import { StatusCode } from "../const";
import User from "../models/user";
import { decryptPassword, encryptPassword } from "../utils/crypto-js";

const cryptoKey = 'bG93Y29kZS1wbGF0Zm9ybQ==';

/**
 * 注册用户
 * @param username 用户名
 * @param password 密码
 * @param userType 用户类型
 * @return 注册提示
 */
export async function register(username: string, password: string, userType: number) {
  if (!username) throw new Error('用户名不能为空');

  const user = await User.findOne({ username }).exec();
  if (user) throw new Error('用户名已存在');

  if (!password) throw new Error('密码不能为空');
  if (!userType) throw new Error('用户类型错误');

  await User.create({
    username,
    password: encryptPassword(cryptoKey, password),
    userType,
  })

  return {
    code: StatusCode.Success,
    msg: '保存成功',
  }
}

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @return 登录成功提示
 */
export async function login(username: string, password: string) {

  const user = await User.findOne({ username }).exec();
  if (!user) throw new Error('用户名不存在');

  const { password: encryptedPwd, userType } = user;

  if (!encryptedPwd || decryptPassword(cryptoKey, encryptedPwd) !== password) throw new Error('密码错误');

  return {
    code: StatusCode.Success,
    msg: '登录成功',
    data: {
      username,
      userType,
    }
  }
}