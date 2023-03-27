<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr 
        :simple-control-options="simpleAttr"
        :select-control-options="selectAttr"
      >
      </base-attr>
      <el-collapse-item title="商品选择">
        <div class="select-commodity-area">
          <div class="select-commodity-area-top">
            <el-radio-group v-model="commodityOrder">
              <el-radio :label="true" size="large">自动排序</el-radio>
              <el-radio :label="false" size="large">手动排序</el-radio>
            </el-radio-group>
          </div>
          <div class="select-commodity-area-bottom">
            <div class="select-commodity-area-bottom-text"> {{ selectedText }} </div>
            <div
              ref="draggableWrapper"
              class="draggable-commodity"
              @dragend="handleDragEnd"
              @dragover="handleDragOver"
            >
              <div
                class="draggable-commodity-image"
                v-for="(image, index) in images"
                :key="image.id"
                @dragstart="(e) => handleDragStart(e, index)"
                :style="{ marginLeft: getMarinLeftByIndex(index) }"
              >
                <img
                  :draggable="!commodityOrder"
                  :src="image.src"
                  :width="imagesAttribute.width"
                  :height="imagesAttribute.height"
                  :data-id="image.id"
                  >
                  <span 
                    class="delete iconfont icon-delete" 
                    @click="deleteSelectedCommodity(index)"
                  />
              </div>
            </div>
          </div>
          <el-button 
            type="primary"
            @click="isSelectCommodityDialogVisible = true"
          >
            点击选择商品
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <select-commodity-dialog
      :is-visible="isSelectCommodityDialogVisible"
      :selected-ids="ids"
      @confirm="handleSelectConfirm"
      @close="isSelectCommodityDialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem, ElRadio, ElRadioGroup, ElButton } from 'element-plus';
import { computed, onUnmounted, ref, watch } from 'vue';
import type { PropType } from 'vue';

import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import SelectCommodityDialog from 'lowcode-platform/components/select-commodity-dialog/index.vue';
import type { CommodityPropValue } from 'lowcode-platform/packages/components/commodity/type';
import { ControlType, SelectControlOption } from '../base/type';
import type { BaseControlOption } from '../base/type';
import { useImagesDrag } from 'lowcode-platform/hooks/use-images-drag-hook';
import type { DraggableImage } from 'lowcode-platform/hooks/use-images-drag-hook';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useCommodityStore } from 'lowcode-platform/store/commodity-store';
import type { Commodity } from 'lowcode-platform/store/commodity-store';
import { swap } from 'lowcode-platform/utils/array';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points-hook';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';

defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<CommodityPropValue>,
    default: () => {},
  }
});

const schemaStore = useSchemaStore();
const commodityStore = useCommodityStore();
const editorStatusStore = useEditorStatusStore();

// 最大选择的商品数目
const maxSelectedNum = 20;
// 激活的 tab
const activeName = ref('style');
// 商品排序模式
const commodityOrder = ref(false);
// 选择商品对话框是否可见
const isSelectCommodityDialogVisible = ref(false);

// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof CommodityPropValue, BaseControlOption>> = {
  padding: {
    type: ControlType.Slider,
    label: '商品间隔',
    options: {
      min: 0,
      max: 20,
      step: 1,
    },
  },
  isRound: {
    type: ControlType.Switch,
    label: "是否为圆角" 
  },
  isShowDesc: {
    type: ControlType.Switch,
    label: "是否展示详细信息"
  },
  isShowOriginPrice: {
    type: ControlType.Switch,
    label: "是否显示原始价格（非一行多个可用）"
  }
};

// 选择器属性
const selectAttr: Partial<Record<keyof CommodityPropValue, SelectControlOption>> = {
  layout: {
    type: ControlType.Select,
    label: '商品布局',
    options: [
      {
        value: 'one-line-one-commodity',
        label: '一行一个'
      },
      {
        value: 'one-line-two-commodity',
        label: '一行两个'
      },
      {
        value: 'inline-commodity',
        label: '一行多个'
      }
    ]
  }
};

// 选中的 id
const ids = computed(() => (schemaStore.getSelectedComponentSchema()?.propValue as unknown as CommodityPropValue).commodities);
// 选择按钮文本
const selectedText = computed(() => `已选商品${ids.value.length}/${maxSelectedNum}`);

// 拖拽图片
const images = ref([] as DraggableImage[]);
// 监听 id 的变化更新图片
const unWatch = watch(
  ids.value,
  async () => {
    const commodities = await commodityStore.getCommoditiesByIds(ids.value);
    const newImages = commodities.map((commodity, index) => ({
      src: commodity.imagesSrc[0],
      id: index,
    }));
    images.value.splice(0, images.value.length);
    images.value.push(...newImages);
  },
  {
    deep: true,
    immediate: true,
  }
);

// 拖拽图片的属性
const imagesAttribute = {
  width: 80,
  height: 80,
  column: 4,
  margin: 12
};

// 拖拽开始回调
const dragStartCallback = (e: DragEvent) => {
  (e.target as HTMLElement).classList.add('draggingItem');
};
// 拖拽结束回调
const dragEndCallback = (e: DragEvent) => {
  (e.target as HTMLElement).classList.remove('draggingItem');
  // 当拖拽结束才记录快照
  schemaStore.recordSnapshot();
};
// 拖拽悬浮回调
const dragOverCallback = (e: DragEvent, draggingIndex: number, currentIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent) return;

  swap((selectedComponent.propValue as unknown as CommodityPropValue).commodities, draggingIndex, currentIndex);
};
// 拖拽图片 hook
const {
  draggableWrapper,
  handleDragStart,
  handleDragEnd,
  getMarinLeftByIndex,
  handleDragOver,
} = useImagesDrag(
  images.value,
  imagesAttribute,
  {
    dragStartCallback,
    dragEndCallback,
    dragOverCallback,
  }
);

// 处理商品选择
const handleSelectConfirm = (commodities: Commodity[]) => { 
  // 向 store 添加
  commodityStore.addCommodities(commodities);
  const ids = commodities.map((commodity) => commodity._id);
  
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent) return;

  // 添加选中的 id
  (selectedComponent.propValue as unknown as CommodityPropValue).commodities.push(...ids);
  schemaStore.recordSnapshot();
  isSelectCommodityDialogVisible.value = false;
}

// 删除选中的商品
const deleteSelectedCommodity = (index: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent) return;
  (selectedComponent.propValue as unknown as CommodityPropValue).commodities.splice(index, 1);
  schemaStore.recordSnapshot();
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

onUnmounted(() => {
  unWatch();
})
</script>

<style lang="scss" scoped src="./index.scss"></style>