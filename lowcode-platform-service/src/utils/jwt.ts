import { sign, verify } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import type { User } from './../models/user';
import { jwtKey } from '../const';

/**
 * 生成 token
 * @param userInfo 用户信息
 * @param key 生成 token 的 key
 * @param signOptions 签名配置
 * @return 生成的 token
 */
export function generateToken(userInfo: object | string, signOptions: SignOptions) {
  return `Bearer ${sign(userInfo, jwtKey, signOptions)}`;
}

/**
 * 验证 token
 * @param token 请求头中的 token
 * @return token 中的 userInfo
 */
export function verifyToken(token: string) {
  if(!token || !/^Bearer /.test(token)) throw new Error('未登录，非法 token');
  try {
    const info = verify(token.split(' ')[1], jwtKey);
    // 只返回 username 即可，查表搜索
    return {
      username: (info as User).username,
      userType: (info as User).userType,
    };
  } catch(err) {
    throw new Error(`未登录，${(err as Error).message}`);
  }
}