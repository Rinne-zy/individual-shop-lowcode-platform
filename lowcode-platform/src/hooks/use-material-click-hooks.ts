import deepcopy from "deepcopy";

import { useComponentsMaterialStore } from "lowcode-platform/store/material-store";
import { useSchemaStore } from "lowcode-platform/store/schema-store";
import { transformPxToNumber } from 'lowcode-platform/utils/unit';

// 宽高相等组件
const ratioComponent = ['Image']

/** 处理组件物料区点击 */
export function useComponentsMaterialClick() {
  const materialStore = useComponentsMaterialStore();
  const schemaStore = useSchemaStore();

  function handleComponentsMaterialClick(key: string) {
    if(!key) return;
    const schema = deepcopy(materialStore.schemaByMaterialKey[key]);
    const { editor }  = schemaStore.schema;

    schema.style.width = transformPxToNumber(editor.width);
    // 处理宽高相等的组件
    if(ratioComponent.includes(key)) {
      schema.style.height = schema.style.width;
    }
    schemaStore.addComponentSchema(schema);
    // 保存快照
    schemaStore.recordSnapshot();
  }

  return {
    handleComponentsMaterialClick,
  }
}