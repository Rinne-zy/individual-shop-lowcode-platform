import deepCopy from 'deepcopy';
import type { Ref } from "vue";

import { useComponentsMaterialStore } from "lowcode-platform/store/material-store";
import { useSchemaStore } from "lowcode-platform/store/schema-store";
import { calcPositionOffset, isPositionOutOfCanvasRight } from "lowcode-platform/utils/position";
import { getWidthPxNumber } from 'lowcode-platform/utils/unit';

// 当前选择的物料 key
let currentDraggedComponentMaterialKey = '';

/**
 * 使用组件物料拖拽 hooks
 * @param ref 画布区域 dom 应勇
 * @returns 拖拽相关函数
 */
export function useComponentsMaterialDrag(domRef: Ref<HTMLElement>) {

  const materialStore = useComponentsMaterialStore();
  const schemaStore = useSchemaStore();

  // 画布 DOM 
  const canvasRef = domRef;

  // 拖拽开始
  function dragStart(key: string) {
    currentDraggedComponentMaterialKey = key;
    // 进入元素中
   canvasRef?.value.addEventListener('dragenter', dragEnter);
      // 在目标元素中经过，必须阻止默认行为，否则不能触发 drop
   canvasRef?.value.addEventListener('dragover', dragOver);
    // 离开元素时，需要有禁用标识
   canvasRef?.value.addEventListener('dragleave', dragLeave);
    // 松手的时候，根据拖拽的组件添加一个组件
   canvasRef?.value.addEventListener('drop', drop);
  }

  // 拖拽结束
  function dragEnd() {
   canvasRef?.value.removeEventListener('dragenter', dragEnter);
    // 在目标元素中经过，必须阻止默认行为，否则不能触发 drop
   canvasRef?.value.removeEventListener('dragover', dragOver);
    // 离开元素时，需要有禁用标识
   canvasRef?.value.removeEventListener('dragleave', dragLeave);
    // 松手的时候，根据拖拽的组件添加一个组件
   canvasRef?.value.removeEventListener('drop', drop);
  }

  // 放置
  function drop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()

    if(!currentDraggedComponentMaterialKey) return;

    // 鼠标点击距离物料左上角的距离
    const offsetX = +(e.dataTransfer?.getData('offsetX') || 0);
    const offsetY = +(e.dataTransfer?.getData('offsetY') || 0);
    // 画布信息
    const { width, x , y } = canvasRef.value.getBoundingClientRect();

    // 修正偏移后的位置
    const left = calcPositionOffset(e.clientX - x, offsetX);
    const top = calcPositionOffset(e.clientY - y, offsetY);

    const schema = deepCopy(materialStore.schemaByMaterialKey[currentDraggedComponentMaterialKey]);

    // 设置定位
    schema.style.top = top;
    // 判断是否超出右侧
    if(isPositionOutOfCanvasRight(left, schema.style.width, width)) {
      schema.style.left = Math.floor(width - getWidthPxNumber(schema.style.width));
    } else {
      schema.style.left = left;
    }

    schemaStore.addComponentSchema(schema);
    currentDraggedComponentMaterialKey = '';
    // 保存快照
    schemaStore.recordSnapshot();
  }

  return {
    dragStart,
    dragEnd,
    dragOver
  }
}

// 拖拽进入
function dragEnter(e: DragEvent) {
  // h5 拖动的图标
  e.dataTransfer!.dropEffect = 'move'
}

// 拖拽经过
function dragOver(e: DragEvent) {
  e.preventDefault();
}

// 拖拽离开
function dragLeave(e: DragEvent) {
  // 禁用拖动的图标
  e.dataTransfer!.dropEffect = 'none'
}