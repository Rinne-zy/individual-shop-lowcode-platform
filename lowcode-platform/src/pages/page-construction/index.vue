<template>
  <div class="construction-panel">
    <!-- 左侧物料区 -->
    <div class="construction-panel-left">
      <components-materials-area 
        @handle-drag-start="handleDragStart"
        @handle-component-material-click="handleComponentsMaterialClick"
      />
      <RealtimeComponents />
    </div>   
    <!-- 右侧属性控制区 -->
    <div class="construction-panel-right">
      <components-attribute-area />
    </div>
    <!-- 画布区域 -->
    <div class="construction-panel-container">
      <div class="construction-panel-container-canvas">
        <operation-menu />
        <div 
          :class="editorClassName" 
          ref="canvasContentRef"
          :style="editorStyle"
          @dragend="dragEnd"
          @mousedown="handleCanvasMouseDown"
          @contextmenu="handleContextMenu"
        >
          <components-editor />
        </div>
      </div>
    </div>
    <create-shop-dialog 
      :is-visible="isVisible"
      @cancel="isVisible = false"
      @confirm="handleSaveConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';

import ComponentsAttributeArea from 'lowcode-platform/components/attribute-area/index.vue';
import ComponentsMaterialsArea from 'lowcode-platform/components/materials-area/index.vue';
import ComponentsEditor from 'lowcode-platform/components/editor-area/index.vue';
import OperationMenu from 'lowcode-platform/components/operation-menu/index.vue';
import RealtimeComponents from 'lowcode-platform/components/realtime-components/index.vue';
import CreateShopDialog from 'lowcode-platform/components/create-shop-dialog/index.vue';
import { useComponentsMaterialDrag } from 'lowcode-platform/hooks/use-material-drag-hook';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { useComponentsMaterialClick } from 'lowcode-platform/hooks/use-material-click-hook';
import { showConfirmMessage, showSuccessMessage } from 'lowcode-platform/utils/toast';
import { StatusCode } from 'lowcode-platform/api/type';
import type { ShopInfo } from 'lowcode-platform/api/shop';
import { createShop, updateShopSchema } from 'lowcode-platform/api/shop';

const schemaStore = useSchemaStore();
const editorStatusStore = useEditorStatusStore();
// 画布 DOM
const canvasContentRef = ref<HTMLElement>();
// 编辑器画布类名
const editorClassName = 'construction-panel-container-canvas-content';

// 使用拖拽 hooks
const { dragStart, dragEnd } = useComponentsMaterialDrag(canvasContentRef as Ref<HTMLElement>);
// 拖拽开始
const handleDragStart = (key: string) => {
  dragStart(key);
};

// 处理组件物料区点击
const { handleComponentsMaterialClick } = useComponentsMaterialClick();

// 编辑器样式
const editorStyle = computed(() => {
  const { width, height } = schemaStore.schema.editor;
  return {
    width,
    height,
  }
})

// 点击画布空白处取消选中
const handleCanvasMouseDown = (e: MouseEvent) => {
  e.stopPropagation();
  editorStatusStore.selectedComponentSchemaId = '';
  editorStatusStore.isShowMenu = false;
}

// 处理右键菜单
const handleContextMenu = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  if(!editorStatusStore.selectedComponentSchemaId) return;

  // 计算菜单相对于组件的位移
  let target = (e.target) as HTMLElement;
  let top = e.offsetY;
  let left = e.offsetX;

  // 循环获取距离编辑器的定位
  while (target && !target.className.includes(editorClassName)) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = (target.parentNode) as HTMLElement;
  };

  editorStatusStore.showMenu(`${left}px`, `${top}px`);
}

// 路由
const router = useRouter();
// 商城创建对话框是否可见
const isVisible = ref(false);
// 路由记录
let pathRouterTo: RouteLocationNormalized | null = null;

// 路由离开判断用户是否保存并进行相应保存更新操作
onBeforeRouteLeave(async (to, from) => {
  // 取消
  const cancelCallback = () => {
    schemaStore.reset();
    return true;
  };

  // 确认
  const confirmCallback = async () => {
    if(!schemaStore.id) {
      pathRouterTo = to;
      isVisible.value = true;
      return false;
    };

    // 当处于编辑商城状态（非新商场）
    const { data } = await updateShopSchema(schemaStore.id, schemaStore.schema);
    if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
    showSuccessMessage(data.msg);
    // 保存操作
    schemaStore.reset(); 
    return true;
  };

  if(!schemaStore.isSavedSchema()){
    return await showConfirmMessage(confirmCallback, cancelCallback);
  } else {
    // 已保存则直接清除
    schemaStore.reset(); 
  }
});

/**
 * 处理确认保存回调
 * @param name 
 */
const handleSaveConfirm = async (formData: ShopInfo) => {
  const { data } = await createShop(formData, schemaStore.schema);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  schemaStore.reset();
  isVisible.value = false;
  // 路由控制
  if(pathRouterTo) {;
    router.push(pathRouterTo as RouteLocationNormalized);
    pathRouterTo = null;
  };
}
</script>

<style src="./index.scss" scoped></style>