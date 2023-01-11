import axios from "axios";

import { UserType } from 'lowcode-platform/store/user-store';
import { BaseResp } from "../type";

interface LoginResp extends BaseResp {
  data?: {
    username: string,
    userType: UserType,
  }
}

export async function login(username: string, password: string) {
  const res = await axios<LoginResp>({
    method: 'post',
    url: '/user/login',
    data: {
      username,
      password,
    }
  });

  return res;
}