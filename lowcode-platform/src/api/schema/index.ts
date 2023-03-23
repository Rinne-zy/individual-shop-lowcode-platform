import axios from 'axios';

import type { BaseResp } from './../type';
import type { Schema } from 'lowcode-platform/store/schema-store';

export interface ShopSchema {
  // schema 的 id
  _id: string;
  // 版本号
  version: number;
  // 组件 schema
  schema: Schema;
  // 最近修改时间
  modified: number;
}

export interface ShopsResp extends BaseResp {
  shopSchema: ShopSchema,
};

/**
 * 根据 id 获取 schema
 * @param id schema id
 * @returns 
 */
export async function getSchemaById(id: string) {
  const res = await axios<ShopsResp>({
    method: 'get',
    url: `schema/get?schemaId=${id}`,
  });

  return res;
}