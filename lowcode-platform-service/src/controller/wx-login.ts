import { StatusCode } from './../const/index';
import WxLoginInfoSchema from '../models/wx-login-info';
import { registerAndUpdateWxUser } from './user';
import { generateToken } from '../utils/jwt';
import { fetchJsonPromise } from '../utils/fetch';

interface BaseResp {
  errcode: number;
  errmsg: string;
}

interface TokenResp extends BaseResp {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	openid: string;
	scope: string;
}

interface UserInfoResp extends BaseResp {
  openid: string;
  nickname: string;
  headimgurl: string;
}

// 微信开发 appid
const appid = 'wx410dc45d2e80363d';
// 微信开发密钥
const secret = '115f72118230554d9560db0af2697e75';
// refreshToken 有效时间
const refreshTokenExpires = 30 * 24 * 60 * 60 * 1000;

/**
 * 微信登录
 * @param openId 微信用户 openId
 * @returns 
 */
export async function wxLogin(openId: string) {
  try {
    if(!openId) throw new Error('openId 为空');

    const info = await WxLoginInfoSchema.findOne({ openId, });
    if(!info) throw new Error('不存在已认证信息');

    let { accessToken, accessTokenExpires, refreshToken } = info;

    // 刷新 token
    if(Date.now() >= accessTokenExpires) {
      const refreshData = await refreshAccessToken(openId, refreshToken);
      if(!refreshData) throw new Error('refresh_token 已过期');
      // 更新token
      accessToken = refreshData.access_token;
    };

    // 用户信息
    const userInfo = await getWxUserInfo(openId, accessToken);  
    // 生成 token
    const token = generateToken(
      {
        username: userInfo.username,
        userType: userInfo.userType,
      },
      {
        expiresIn: '7d'
      }
    )

    return {
      code: StatusCode.Success,
      msg: '登录成功',
      data: userInfo,
      token,
    }

  } catch(err: any) {
    // 打印错误日志
    console.log(err);

    return {
      code: StatusCode.Error,
      needToAuth: true,
    }
  }
}

/**
 * 微信登录认证
 * @param code 
 */
export async function wxLoginWithAuth(code: string) {
  const data = await getWxAccessToken(code);
  // 请求旧的，以防生成多个
  await WxLoginInfoSchema.findOneAndDelete({ openId: data.openid });
  await createWxLoginInfo(data);

  // 用户信息
  const userInfo = await getWxUserInfo(data.openid, data.access_token); 
  // 生成 token
  const token = generateToken(
    {
      username: userInfo.username,
      userType: userInfo.userType,
    },
    {
      expiresIn: '7d'
    }
  );

  return {
    code: StatusCode.Success,
    msg: '登录成功',
    data: userInfo,
    token,
  };
}

/**
 * 刷新 token
 * @param openId 微信用户 openId 
 * @param token 公众号请求 token
 * @returns 
 */
export async function refreshAccessToken(openId: string, token: string) {
  const url = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appid}&grant_type=refresh_token&refresh_token=${token}`;
  try {
    const data = await fetchJsonPromise<TokenResp>(url);
    // 刷新失败，清除过期 token
    if(data.errcode && data.errcode !== 0) {
      await WxLoginInfoSchema.findOneAndDelete({ openId, });
      return null;
    };

    await updateToken(data);
    return data;
  
  } catch (err: any) {
    throw new Error(err);
  }
}

/**
 * 获取微信 Token
 * @param code code 凭证
 * @returns 
 */
export async function getWxAccessToken(code: string) {
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
  try {
    const data = await fetchJsonPromise<TokenResp>(url);
    return data;
   
  } catch (err: any) {
    throw new Error(err);
  }
}

/**
 * 获取用户信息
 * @param openId 微信用户 openId 
 * @param token 公众号请求 token
 * @returns 
 */
export async function getWxUserInfo(openId: string, token: string) {
  try {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openId}&lang=zh_CN`;
    const data = await fetchJsonPromise<UserInfoResp>(url);
    if(data.errcode && data.errcode !== 0) {
      throw new Error(data.errmsg);
    };
  
    // 注册并更新用户信息
    return await registerAndUpdateWxUser(data.openid, data.headimgurl, data.nickname);
  } catch(err: any) {
    throw new Error(err);
  }
}

/**
 * 创建新的微信登录信息记录
 * @param data 请求回来的 token 数据包
 * @returns 
 */
function createWxLoginInfo(data: TokenResp) {
  const { openid, refresh_token, access_token, scope, expires_in } = data;

  return WxLoginInfoSchema.create({
    openId: openid,
    accessToken: access_token,
    refreshToken: refresh_token,
    scope,
    accessTokenExpires: (Date.now() + Number(expires_in) * 1000),
    refreshTokenExpires: (Date.now() + Number(refreshTokenExpires)),
  });
}

/**
 * 更新 token
 * @param data 刷新的 token 数据
 * @returns 
 */
async function updateToken(data: TokenResp) {
  const info = await WxLoginInfoSchema.findOne({ openId: data.openid });
  if(!info) {
    await createWxLoginInfo(data);
    return;
  };

  info.accessToken = data.access_token;
  info.accessTokenExpires = (Date.now() + Number(data.expires_in) * 1000);
  info.markModified('accessToken');
  info.markModified('accessTokenExpires');
  await info.save();
};
