<template>
  <div>
    <el-collapse v-model="activeName" accordion>
      <!-- 通用属性 -->
      <common-attr />
      <base-attr 
        :simple-control-options="simpleAttr"
        :select-control-options="selectAttr"
      />
      <el-collapse-item title="商品分组管理">
        <div 
          v-for="(groupInfo, groupIndex) in propValue.grouping"
          :key="groupInfo.value"
          class="group"
        >
          <div class="group-top">
            <span class="tip">分组{{ groupIndex + 1 }}</span>
            <div>
              <span class="iconfont icon-up" @click="handleUpGroupingInfo(groupIndex)"/>
              <span class="iconfont icon-down" @click="handleDownGroupingInfo(groupIndex)" />
              <span class="iconfont icon-delete" @click="handleDeleteGroupInfo(groupIndex)" />
              <span class="iconfont icon-more more" @click="expandingIndex[groupIndex] = !expandingIndex[groupIndex]" />
            </div>
          </div>
          <Transition name="collapse">
            <div v-show="expandingIndex[groupIndex]">
              <el-form-item label="分组名称">
                <el-input :disabled="isDefaultGrouping(groupInfo.value)" v-model="groupInfo.name" />
              </el-form-item>
              <el-form-item label="分组排序">
                <el-select v-model="groupInfo.order" placeholder="请选择" :disabled="isDefaultGrouping(groupInfo.value)">
                  <el-option
                    v-for="item in commoditiesOrderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <template v-if="isDefaultGrouping(groupInfo.value)">
                <el-form-item  label="商品显示数量">
                  <el-input type="number" max="10" min="0" v-model="groupInfo.showNumber" />
                </el-form-item>
                <el-form-item  label="商品分类">
                  <el-select v-model="groupInfo.type" placeholder="请选择商品分类">
                    <el-option
                      v-for="item in commoditiesSelectedType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-else>
                <el-button type="primary" :disabled="groupInfo.commodities.length >= maxSelectedNum" @click="handleClickAddGrouping(groupIndex)">点击选择商品</el-button>
                <div class="commodities-preview">
                  <div class="commodities-preview-text">商品预览（{{ groupInfo.commodities.length }} / {{ maxSelectedNum }}）</div>
                  <div>
                    <div
                      v-for="(commodity, index) in commoditiesPreviewByGroupingValue[groupInfo.value].commodities"
                      :key="commodity._id"
                      class="commodities-preview-item"
                    >
                      <img        
                        :src="commodity.imagesSrc[0]"
                        width="80"
                        height="80"
                      >
                      <div class="commodities-preview-item-operation">
                        <span class="iconfont icon-up forward" @click="handleForwardCommodity(index, groupIndex)"/>
                        <span class="iconfont icon-delete delete" @click="handleDeleteCommodity(index, groupIndex)" />
                        <span class="iconfont icon-down after" @click="handleAfterCommodity(index, groupIndex)" />
                      </div>
                    </div>             
                  </div>
                </div>
              </template>
            </div>
          </Transition>
        </div>
        <!-- 添加商品分组操作 -->
        <div class="add-grouping-operation">
          <el-dropdown @command="handleAddGrouping">
            <el-button type="primary">添加商品分组</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="new" :disabled="isHasNewGrouping">最新</el-dropdown-item>
                <el-dropdown-item command="hot" :disabled="isHasHotGrouping">最热</el-dropdown-item>
                <el-dropdown-item command="customize">自定义</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <select-commodity-dialog
    :is-visible="isSelectCommodityDialogVisible"
    :selected-ids="selectedIds"
    @confirm="handleSelectConfirm"
    @close="handleCloseSelect"
  />
</template>

<script setup lang="ts">
import {
  ElCollapse,
  ElCollapseItem,
  ElButton,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from 'element-plus';
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import deepcopy from 'deepcopy';


import CommonAttr  from '../common/index.vue';
import BaseAttr from '../base/index.vue';
import SelectCommodityDialog from 'lowcode-platform/components/select-commodity-dialog/index.vue';
import { ControlType, SelectControlOption } from '../base/type';
import type { BaseControlOption } from '../base/type';
import { useSchemaStore } from 'lowcode-platform/store/schema-store';
import { useCommodityStore } from 'lowcode-platform/store/commodity-store';
import type { Commodity } from 'lowcode-platform/store/commodity-store';
import { swap } from 'lowcode-platform/utils/array';
import { execShapePointsForceUpdate } from 'lowcode-platform/hooks/use-shape-points-hook';
import { useEditorStatusStore } from 'lowcode-platform/store/editor-status-store';
import { CommoditiesOrder, GroupingPropValue } from 'lowcode-platform/packages/components/grouping/type';
import type { CommodityGrouping } from 'lowcode-platform/packages/components/grouping/type';
import { getCommoditiesSelectType } from 'lowcode-platform/api/type/index';
import { StatusCode } from 'lowcode-platform/api/type';
interface CommodityPreviewInfo {
  order: CommoditiesOrder,
  commodities: Commodity[],
}

const props = defineProps({
  style:{
    type: Object,
    default: () => {},
  },
  propValue: {
    type: Object as PropType<GroupingPropValue>,
    default: () => {},
  }
});

const schemaStore = useSchemaStore();
const commodityStore = useCommodityStore();
const editorStatusStore = useEditorStatusStore();

// 商品排序选项
const commoditiesOrderOptions = [
  {
    label: '默认布局',
    value: CommoditiesOrder.Default,
  },
  {
    label: '按时间排序',
    value: CommoditiesOrder.Time,
  },
  {
    label: '按销量排序',
    value: CommoditiesOrder.Sale,
  },
];
// 默认分组信息
const defaultGroupingByCommand: Record<string, CommodityGrouping> = {
  new: {
    name: "最新",
    value: "new",
    order: 1,
    commodities: [],
    showNumber: 5,
  },
  hot: {
    name: "最热",
    value: "hot",
    order: 2,
    commodities: [],
    showNumber: 5,
  }
}
// 简单属性（文本输入框、开关）
const simpleAttr: Partial<Record<keyof GroupingPropValue, BaseControlOption>> = {
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
const selectAttr: Partial<Record<keyof GroupingPropValue, SelectControlOption>> = {
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
      }
    ]
  }
};
// 最大选择的商品数目
const maxSelectedNum = 10;
// 激活的 tab
const activeName = ref('style');
// 选择商品对话框是否可见
const isSelectCommodityDialogVisible = ref(false);
// 正在选择商品的下标
const operatingGroupIndex = ref(-1);
// 分组展开的下标
const expandingIndex = ref(props.propValue.grouping.map((value, index) => index === 0));
// 可选择的商品分类
const commoditiesSelectedType = ref<{
  label: string;
  value: string;
}[]>([]);
// 商品预览
const commoditiesPreviewByGroupingValue = ref({} as Record<string, CommodityPreviewInfo>);
// 是否已经添加最新分组
const isHasNewGrouping = computed(() => props.propValue.grouping.findIndex((info) => info.value === 'new') !== -1);
// 是否已经添加最热分组
const isHasHotGrouping = computed(() => props.propValue.grouping.findIndex((info) => info.value === 'hot') !== -1);
// 已经选择的商品 id
const selectedIds = computed(() => {
  if(operatingGroupIndex.value === -1) return [];
  const grouping = props.propValue.grouping[operatingGroupIndex.value];

  if(!grouping) return [];
  return grouping.commodities;
});

// 处理添加商品分类
const handleAddGrouping = (command: string | number | object) => {
  const propValue = (schemaStore.getSelectedComponentSchema()?.propValue as unknown as GroupingPropValue);
  
  if(command === 'customize') {
    const groupInfo = {
      name: "自定义分类",
      value: uuidv4(),
      order: CommoditiesOrder.Default,
      commodities: [],
      showNumber: -1,
      type: undefined
    };

    propValue.grouping.push(groupInfo);
    // 添加商品预览
    handleAddCommoditiesPreview(groupInfo, []);
    expandingIndex.value.push(true);
    // 记录快照
    schemaStore.recordSnapshot();
    return;
  }

  const key = command as unknown as keyof typeof defaultGroupingByCommand;
  propValue.grouping.push(deepcopy(defaultGroupingByCommand[key]));
  expandingIndex.value.push(true);
  // 记录快照
  schemaStore.recordSnapshot();
}
// 处理点击添加商品按钮
const handleClickAddGrouping = (index: number) => {
  operatingGroupIndex.value = index;
  isSelectCommodityDialogVisible.value = true;
};

// 处理选择商品关闭
const handleCloseSelect = () => {
  isSelectCommodityDialogVisible.value = false;
  operatingGroupIndex.value = -1;
}

// 处理商品选择
const handleSelectConfirm = (commodities: Commodity[]) => { 
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || operatingGroupIndex.value === -1) return;
  // 分组信息
  const groupingInfo = (selectedComponent.propValue as unknown as GroupingPropValue).grouping[operatingGroupIndex.value];
  
  // 需要添加的商品
  const needToAddCommodities = commodities.slice(0, maxSelectedNum - groupingInfo.commodities.length)
  if(needToAddCommodities.length === 0) return;
 
  // 向 store 添加
  commodityStore.addCommodities(needToAddCommodities);
  const ids = needToAddCommodities.map((commodity) => commodity._id);

  // 分组信息添加
  groupingInfo.commodities.push(...ids);
  // 处理商品预览
  handleAddCommoditiesPreview(groupingInfo, needToAddCommodities);

  schemaStore.recordSnapshot();
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);

  isSelectCommodityDialogVisible.value = false;
  operatingGroupIndex.value = -1;
}

// 处理商品预览
const handleAddCommoditiesPreview = (groupInfo: CommodityGrouping, commodities: Commodity[]) => {
  const preview = commoditiesPreviewByGroupingValue.value[groupInfo.value];
  // 若不存在则创建
  if(!preview) {
    commoditiesPreviewByGroupingValue.value[groupInfo.value] = {
      order: groupInfo.order,
      commodities: sortCommoditiesByGroupingOrder(groupInfo.order, commodities),
    }
    return;
  }

  // 合并新旧
  const newCommodities = sortCommoditiesByGroupingOrder(groupInfo.order, [...preview.commodities, ...commodities]);
  commoditiesPreviewByGroupingValue.value[groupInfo.value].commodities = newCommodities;
};

// 前移商品
const handleForwardCommodity = (index: number, groupIndex: number) => {
  if(index === 0) return;

  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1) return;

  // 交换分组中的商品的位置
  const groupingInfo = (selectedComponent.propValue as unknown as GroupingPropValue).grouping[groupIndex];
  swap(groupingInfo.commodities, index, index - 1);

  // 交换预览图位置
  const preview = commoditiesPreviewByGroupingValue.value[groupingInfo.value];
  swap(preview.commodities, index, index - 1);

  schemaStore.recordSnapshot();
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

// 后移商品
const handleAfterCommodity = (index: number, groupIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1) return;

  // 交换分组中的商品的位置
  const groupingInfo = (selectedComponent.propValue as unknown as GroupingPropValue).grouping[groupIndex];
  if(index >= groupingInfo.commodities.length -1) return;

  swap(groupingInfo.commodities, index, index + 1);
  // 交换预览图位置
  const preview = commoditiesPreviewByGroupingValue.value[groupingInfo.value];
  swap(preview.commodities, index, index + 1);

  schemaStore.recordSnapshot();
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

// 删除选中的商品
const handleDeleteCommodity = (index: number, groupIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1) return;

  // 删除分组中的商品
  const groupingInfo = (selectedComponent.propValue as unknown as GroupingPropValue).grouping[groupIndex];
  groupingInfo.commodities.splice(index ,1);

  // 删除预览中的商品
  const preview = commoditiesPreviewByGroupingValue.value[groupingInfo.value];
  preview.commodities.splice(index, 1);

  schemaStore.recordSnapshot();
  execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
}

// 删除商品分组
const handleDeleteGroupInfo = (groupIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1) return;

  // 删除分组中的商品
  const grouping = (selectedComponent.propValue as unknown as GroupingPropValue).grouping;

  grouping.splice(groupIndex, 1);
  expandingIndex.value.splice(groupIndex, 1);

  schemaStore.recordSnapshot();
  setTimeout(() => {
    execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
  }, 100)
}

// 处理分组信息上移
const handleUpGroupingInfo = (groupIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1 || groupIndex === 0) return;

  const grouping = (selectedComponent.propValue as unknown as GroupingPropValue).grouping;
  swap(grouping, groupIndex, groupIndex - 1);
  swap(expandingIndex.value, groupIndex, groupIndex - 1);

  schemaStore.recordSnapshot();
  setTimeout(() => {
    execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
  }, 100)
}

// 处理分组信息下移
const handleDownGroupingInfo = (groupIndex: number) => {
  const selectedComponent = schemaStore.getSelectedComponentSchema();
  if (!selectedComponent || groupIndex === -1) return;

  const grouping = (selectedComponent.propValue as unknown as GroupingPropValue).grouping;

  if(groupIndex >= grouping.length -1) return;
  swap(grouping, groupIndex, groupIndex + 1);
  swap(expandingIndex.value, groupIndex, groupIndex - 1);

  schemaStore.recordSnapshot();
  setTimeout(() => {
    execShapePointsForceUpdate(editorStatusStore.selectedComponentSchemaId);
  }, 100)
}

// 根据分组顺序排序
const sortCommoditiesByGroupingOrder = (order: CommoditiesOrder, commodities: Commodity[]) => {
  if(order === undefined || order === CommoditiesOrder.Default || commodities.length === 0) {
    return commodities;
  };

  return commodities.sort((c1, c2) => {
    if(order === CommoditiesOrder.Time) {
      return c2.addTime - c1.addTime;
    }

    return c2.sales - c1.sales;
  });
}

// 判断是否为默认分组
const isDefaultGrouping = (value: string) => (value === 'new' || value === 'hot');

//获取商品分类
const getCommoditiesType = async () => {
  const { data } = await getCommoditiesSelectType();
  if (!data || data.code !== StatusCode.Success || !data.types) return;
  commoditiesSelectedType.value = data.types;
}

// 初始化商品预览
const initCommoditiesPreview = async () => {
  const { grouping } = props.propValue;
  const ids: string[] = []
  grouping.forEach((info) => {
    ids.push(...info.commodities);
    handleAddCommoditiesPreview(info, []);
  })

  if(ids.length === 0) return;

  await commodityStore.getCommoditiesByIds(ids);

  grouping.forEach((info) => {
    const { commodities } = info;
    handleAddCommoditiesPreview(info, commodities.map((id) => commodityStore.commoditiesById[id]))   
  })
}

// 初始化
const init = async () => {
  getCommoditiesType();
  initCommoditiesPreview();
};
init();
</script>

<style lang="scss" scoped src="./index.scss"></style>