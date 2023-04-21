import axios from 'axios';

import type { CascaderOption } from 'element-plus';
import type { BaseResp } from './../type';

export interface CascaderOptionsResp extends BaseResp {
  id: string,
  labels: Record<string, string>
  options: CascaderOption[],
};

interface typeResp extends BaseResp {
  types: {
    label: string;
    value: string;
  }[]
}

/**
 * 获取分类相关的级联选择器选项
 * @param type 分类类型（商品/图片）
 * @returns 
 */
export async function getCascaderType(type: string) {
  const res = await axios<CascaderOptionsResp>({
    method: 'get',
    url: `type/${type}/get`,
  });

  return res;
};

/**
 * 更新分类相关的级联选择器选项
 * @param id 该分类的 object_id
 * @param options 最新的分类类型选项
 * @returns 
 */
export async function updateCascaderType(id: string, options: CascaderOption[]) {
  const res = await axios<BaseResp>({
      method: 'post',
      url: '/type/update',
      data: {
        options,
        id,
      }
  });

  return res;
};

/**
 * 删除分类相关的级联选择器选项
 * @param id 该分类的 object_id
 * @param options 最新的分类类型选项
 * @param value 删除分类字段
 * @param type 分类类型（商品/图片）
 * @returns 
 */
export async function deleteCascaderType(id: string, options: CascaderOption[], value: string, type: string) {
  const res = await axios<BaseResp>({
      method: 'post',
      url: `type/${type}/delete`,
      data: {
        type: value,
        options,
        id,
      }
  });

  return res;
};

/**
 * 获取商品可选择分类
 * @returns 
 */
export async function getCommoditiesSelectType() {
  const res = await axios<typeResp>({
    method: 'get',
    url: '/type/commodity/select',
  });

  return res;
}