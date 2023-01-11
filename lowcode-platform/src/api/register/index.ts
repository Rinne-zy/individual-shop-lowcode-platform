import axios from "axios";

import type { UserType } from 'lowcode-platform/store/user-store';
import type { BaseResp } from "../type";

export async function register(username: string, password: string, userType: UserType) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/user/register',
    data: {
      username,
      password,
      userType,
    }
  });

  return res;
}