import axios from 'axios';

import type { BaseResp } from './../type';
import type { Schema } from 'lowcode-platform/store/schema-store';

export interface Shop {
  _id: string,
  username: string,
  name: string,
  schema: Schema,
  created: number,
  modified: number,
}

export interface SchemaResp extends BaseResp {
  shops: Shop[],
};

/**
 * 保存 schema
 * @param schema 需要保存的 schema 
 * @returns 
 */
export async function saveSchema(name: string, schema: Schema) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/schema/create',
    data: {
      schema,
      name
    }
  });

  return res;
}

/**
 * 更新商城信息
 * @param id 商城 id
 * @param name 商城名
 * @param schema 商城 schema
 * @returns 
 */
export async function updateSchema(id: string, name: string | undefined, schema: Schema | undefined) {
  const res = await axios<BaseResp>({
    method: 'post',
    url: '/schema/updateById',
    data: {
      id,
      schema,
      name
    }
  });

  return res;
}


/**
 * 获取当前用户下所有商城 schema
 * @param username 用户名
 * @returns 
 */
export async function getSchema() {
  const res = await axios<SchemaResp>({
    method: 'get',
    url: '/schema/get',
  });

  return res;
}