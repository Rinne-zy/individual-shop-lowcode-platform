import type { Ref } from "vue";

// 当前选择的物料 key
let currentSelectComponentMaterialKey = '';

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
function dragLeave() {

}

// 放置
function drop(e: DragEvent) {
  // 禁用拖动的图标
  e.dataTransfer!.dropEffect = 'none'
}

// 拖拽开始
function dragStart(domRef: Ref<HTMLElement>, key: string) {
  console.log('key', key);
  console.log('ref', domRef.value);
  currentSelectComponentMaterialKey = key;
  // 进入元素中
  domRef?.value.addEventListener('dragenter', dragEnter);
    // 在目标元素中经过，必须阻止默认行为，否则不能触发 drop
  domRef?.value.addEventListener('dragover', dragOver);
  // 离开元素时，需要有禁用标识
  domRef?.value.addEventListener('dragleave', dragLeave);
  // 松手的时候，根据拖拽的组件添加一个组件
  domRef?.value.addEventListener('drop', drop);
}

// 拖拽结束
function dragEnd(domRef: Ref<HTMLElement>) {
  domRef?.value.removeEventListener('dragenter', dragEnter);
  // 在目标元素中经过，必须阻止默认行为，否则不能触发 drop
  domRef?.value.removeEventListener('dragover', dragOver);
  // 离开元素时，需要有禁用标识
  domRef?.value.removeEventListener('dragleave', dragLeave);
  // 松手的时候，根据拖拽的组件添加一个组件
  domRef?.value.removeEventListener('drop', drop);
}

/**
 * 使用组件物料拖拽 hooks
 * @param ref 画布区域 dom 应勇
 * @returns 拖拽相关函数
 */
export function useComponentsMaterialDrag() {
  return {
    dragStart,
    dragEnd
  }
}