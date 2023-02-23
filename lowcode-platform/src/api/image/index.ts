import axios from "axios";
import { BaseResp } from "../type";

export interface Image {
  username: string;
  name: string;
  src: string;
}

export interface ImageResp extends BaseResp {
  images: Image[];
}

/** 上传图片信息 */
export async function uploadImage(formData: FormData) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/image/upload',
    data: formData,
  });

  return res;
}

/** 获取图片列表数据 */
export async function getImages() {
  const res = await axios<ImageResp>({
    method: 'get',
    url: '/image/get',
  });

  return res;
}