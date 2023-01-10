import { AES, enc } from "crypto-js";

/**
 * 加密
 * @export
 * @param key 加密的 key
 * @param password 原始密码
 * @return 加密后密码
 */
export function encryptPassword(key: string, password: string): string {
  return AES.encrypt(password, key).toString();
}

/**
 * 解密
 * @export
 * @param key 加密的 key
 * @param password 加密后密码
 * @return 原始密码
 */
export function decryptPassword(key: string, password: string): string {
  return AES.decrypt(password, key).toString(enc.Utf8);
}