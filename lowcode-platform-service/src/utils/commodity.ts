import type { ComponentSchema } from "../models/schema";

const relativeCommoditiesComponents: Record<string, boolean> = {
  Commodity: true,
}

/**
 * 获取 schema 中的所有商品 ids
 * @param schema 
 * @returns 
 */
export function findCommoditiesFromSchema(schema: ComponentSchema | undefined) {
  const ids = new Set<string>();
  if(!schema) return ids;

  // 获取具有商品信息的组件
  const commodityComponents = schema.components.filter((component) => relativeCommoditiesComponents[component.key]);
  commodityComponents.forEach((component: any) => {
    traverse(component.propValue, ids);
  });

  return ids;
}

/**
 * 递归遍历
 * @param value 
 * @param ids 
 * @returns 
 */
function traverse(value: any, ids: Set<string>) {
  if(typeof value !== 'object' || !value) return;

  for(const k in value) {
    // 当 key 为 commodities 时处理
    if(k === 'commodities') {
      if(!Array.isArray(value[k])) return;
      value[k].forEach((id: string) => ids.add(id));
      return;
    }
    traverse(value[k], ids);
  };
};