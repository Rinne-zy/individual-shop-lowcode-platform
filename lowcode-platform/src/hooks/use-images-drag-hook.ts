import { ref } from 'vue';
// 拖拽图片
export interface DraggableImage {
  // 编号
  id: number;
  // 图片链接
  src: string;
};

// 拖拽图片元素属性
export interface DraggableImageAttribute {
  // 图片宽度
  width: number;
  // 图片高度
  height: number;
  // 列数
  column: number;
  // 图片之间的间距
  margin: number;
}

// 拖拽回调函数
export interface DraggableImageCallbacks {
  /**
   * 拖拽开始回调
   * @param e 拖拽事件
   * @returns 
   */
  dragStartCallback?: (e: DragEvent) => void;
  /**
   * 拖拽结束回调
   * @param e 拖拽事件
   * @returns 
   */
  dragEndCallback?: (e: DragEvent) => void;
  /**
   * 拖拽悬浮
   * @param e 拖拽事件
   * @param draggingIndex 当前拖拽的元素下标
   * @param currentIndex 当前鼠标悬浮的元素下标
   * @returns 
   */
  dragOverCallback?: (e: DragEvent, draggingIndex: number, currentIndex: number) => void
}

// 图片拖拽
export function useImagesDrag(
  images: DraggableImage[], 
  attribute: DraggableImageAttribute,
  callbacks: DraggableImageCallbacks,
) {
  // 拖拽的图片索引
  const draggingImageIndex = ref<number>(-1);
  // 图片容器
  const draggableWrapper = ref<HTMLElement>();

  /**
   * 处理拖拽开始
   * @param e 拖拽事件
   * @param imageIndex 拖拽元素的下标
   */
  const handleDragStart = (e: DragEvent, imageIndex: number) => {
    draggingImageIndex.value = imageIndex;
    callbacks.dragStartCallback?.(e);
  };

  // 处理拖拽结束
  const handleDragEnd = (e: DragEvent) => {
    callbacks.dragStartCallback?.(e);
    draggingImageIndex.value = -1;
  };

  // 根据 index 计算 margin 的值
  const getMarinLeftByIndex = (index: number) => {
    return index % attribute.column ? `${ attribute.margin }px` : 0
  };

  // 处理拖拽悬浮
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'move';
    if(draggingImageIndex.value === -1) return;

    const dropRect = draggableWrapper.value?.getBoundingClientRect();
    if(!dropRect) return;

    const offsetX = e.clientX - dropRect.left;
    const offsetY = e.clientY - dropRect.top;

    // 超出拖动区域
    if (
      offsetX < 0 
      || offsetX > dropRect.width 
      || offsetY < 0
      || offsetY > dropRect.height
    ) {
      return;
    }

    const col = Math.floor(offsetX / (attribute.width + attribute.margin));
    const row = Math.floor(offsetY / attribute.height);
    let currentIndex = row * attribute.column + col;
    const len = images.length;

    // 避免越界
    if(currentIndex >= len) {
      currentIndex = len - 1;
    };
    // 相同则不需要交换
    if(currentIndex === draggingImageIndex.value) return;
    callbacks.dragOverCallback?.(e, draggingImageIndex.value, currentIndex);
    draggingImageIndex.value = currentIndex;
  };

  return {
    draggableWrapper,
    handleDragStart,
    handleDragEnd,
    getMarinLeftByIndex,
    handleDragOver,
  }
}