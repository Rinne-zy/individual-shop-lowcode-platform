import { FETCH_URL_PREFIX } from 'lowcode-platform-h5-renderer/const/index';
import type { SchemaStore } from 'lowcode-platform-h5-renderer/store/schema';

/**
 * 根据商城 id 获取商城 schema
 * @param id 商城 id
 * @returns 
 */
export async function getSchemaById(id: string) {
  const resp = await fetch(`${FETCH_URL_PREFIX}schema/getById?id=${id}`);
  if(resp.status !== 200 || !resp.ok) throw new Error('获取商城出错');

  const { code, shop } = await resp.json();
  if(code) return {} as SchemaStore;
  
  return shop as SchemaStore;
}