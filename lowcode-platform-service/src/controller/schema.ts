import { Schema } from 'mongoose';
import ShopSchema, { SchemaType } from '../models/schema';
import type { ComponentSchema } from '../models/schema';
import { findCommoditiesFromSchema } from '../utils/commodity';

// 默认的商城 schema
const defaultShopSchema: ComponentSchema = {
  editor: {},
  components: [],
}

/**
 * 创建商城 schema
 * @param schema schema
 * @returns 
 */
export async function createShopSchema(schema: ComponentSchema | undefined, type = SchemaType.Develop) {
  let commodities: string[] | undefined = undefined;
  if(type === SchemaType.Deploy) {
    const ids = findCommoditiesFromSchema(schema);
    commodities = ids.size ? Array.from(ids) : undefined;
  };

  const newShopSchema = await ShopSchema.create({
    schema: schema || defaultShopSchema,
    modified: Date.now(),
    version: 1,
    type,
    commodities,
  });

  return newShopSchema;
};

/**
 * 更新 schema
 * @param schemaId schemaId
 * @param schema 最新的 schema
 * @returns 
 */
export async function updateShopSchemaById(schemaId: string, schema: ComponentSchema, type = SchemaType.Develop) {
  let commodities: string[] | undefined = undefined;
  if(type === SchemaType.Deploy) {
    const ids = findCommoditiesFromSchema(schema);
    commodities = ids.size ? Array.from(ids) : undefined;
  };
  
  const shopSchema = await ShopSchema.findByIdAndUpdate(schemaId, {
    schema,
    modified: Date.now(),
    $inc: { version: + 1 }, 
    commodities,
  });

  return shopSchema;
};

/**
 * 根据 id 删除商城 schema
 * @param schemaId 商城 schema ID
 * @returns 
 */
export async function deleteShopSchemaById(schemaId: string) {
  return await ShopSchema.findByIdAndDelete(schemaId);
};

/**
 * 根据 id 获取商城 schema
 * @param schemaId 商城 schema ID
 * @returns 
 */
export async function getShopSchemaById(schemaId: string, isIncludeSchema = true) {
  if(!isIncludeSchema) {
    return await ShopSchema.findById(schemaId, { schema: 0 });
  }

  return await ShopSchema.findById(schemaId);
};