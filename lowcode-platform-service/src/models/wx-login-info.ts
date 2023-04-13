import { Schema, model } from "mongoose";

export interface WxLoginInfo {
  openId: string;
  accessToken: string;
  refreshToken: string;
  scope: string;
  refreshTokenExpires: number;
  accessTokenExpires: number;
}

const WxLoginSchema = new Schema<WxLoginInfo>({
  openId: String,
  accessToken: String,
  refreshToken: String,
  scope: String,
  refreshTokenExpires: Number,
  accessTokenExpires: Number,
});

export default model('wxLogin', WxLoginSchema);