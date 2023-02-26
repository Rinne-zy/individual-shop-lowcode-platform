import axios from "axios";
import { BaseResp } from "../type";

export interface Image {
  _id:string;
  username: string;
  name: string;
  src: string;
  modified: Date;
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

/** 获取图片列表数据 */
export async function deleteImage(id: string) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/image/delete',
    data: {
      id,
    }
  });

  return res;
}

/**
 * 更新图片信息
 * @param id 图片 id
 * @param formData 图片其余信息
 * @returns 
 */
export async function updateImage(id: string, formData: FormData) {
  formData.append('id', id);
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/image/update',
    data: formData,
  });

  return res;
}

/**
 * 批量删除图片信息
 * @param ids 所需删除的所有的图片的 id
 * @returns 
 */
export async function deleteImageByIds(ids: string[]) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/image/deleteMany',
    data: {
      ids,
    },
  });

  return res;
}