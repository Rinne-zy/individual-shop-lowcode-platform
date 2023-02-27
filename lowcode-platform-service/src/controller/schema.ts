import { StatusCode } from "../const";
import ShopSchema from '../models/schema';
import type { ShopSchemaType } from '../models/schema';

export interface schema {
  // 编辑器样式
  editor: Record<string, string>;
  // 组件 schema
  components: Array<object>;
}

/**
 * 创建并保存 schema
 * @param username 用户名
 * @param name 商城名
 * @param schema 商城对应的 schema
 * @returns 
 */
export async function createSchema(username: string, name: string, schema: schema) {
  if(!schema || !schema.editor || !schema.components) {
    return  {
      code: StatusCode.Error,
      msg: '保存失败, schema 数据异常',
    }
  };

  // 保存 schema
  await ShopSchema.create({
    username,
    name,
    schema: schema,
    created: Date.now(),
    modified: Date.now(),
  });

  return {
    code: StatusCode.Success,
    msg: '保存成功',
  }
}

/**
 * 根据用户名获取相应的 schema
 * @param username 用户名
 */
export async function getByUsername(username: string) {
 const shopSchema = await ShopSchema.find({
    username,
  });

  return {
    code: StatusCode.Success,
    shops: shopSchema,
    msg: '获取商城成功',
  }
}

/**
 * 根据 id 更新商城 schema
 * @param id 商城 id
 * @param name 商城名称
 * @param schema 商城 schema
 * @returns 
 */
export async function updatedSchemaById(id: string, name: string | undefined, schema: schema | undefined) {
  const newComponentSchema: Partial<ShopSchemaType> = {
    modified: Date.now(),
  };

  if(name) {
    newComponentSchema.name = name;
  };

  if(schema) {
    newComponentSchema.schema = schema;
  };

  await ShopSchema.findByIdAndUpdate(id, newComponentSchema);

  return {
    code: StatusCode.Success,
    msg: '更新成功',
  }
}