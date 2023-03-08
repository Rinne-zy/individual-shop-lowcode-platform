<template>
  <div class="commodity-manage">
    <div class="commodity-manage-top">
      <!-- 搜索框 -->
      <el-input
        v-model="search"
        placeholder="搜索商品名称"
        class="input-with-select"
      >
        <template #prepend>
          <el-button><i class='iconfont icon-search'/></el-button>
        </template>
      </el-input>
      <!-- 操作按钮 -->
      <div>
        <el-button type="primary" @click=" isVisible = true">新增商品</el-button>
        <el-popconfirm 
            title="确定要删除选中的商品吗？"
            width="300"
            @confirm="handleDeleteSelectedIds"
          >
            <template #reference>
              <el-button type="danger">批量删除</el-button>
            </template>
        </el-popconfirm>
      </div>
    </div>
    <el-table
      ref="table"
      style="width: 100%;"
      height="630"
      :data="commoditiesNeedToShow"
    >
      <el-table-column type="selection" width="65" />
      <el-table-column prop="name" label="商品名称" width="300" >
        <template #default="scope">
          <div class="commodity-name">
            <img :src="scope.row.imagesSrc[0]" width="100" height="100">
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="商品"
        width="150"
        :filters="filterType"
        :filter-method="handleFilter"
      >
        <template #default="scope">
          {{ typeLabels[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="200">
        <template #default="scope">
          <div v-if="scope.row.discount !== 100" class="discount-price">折扣价：${{ (scope.row.price * scope.row.discount * 0.01).toFixed(2) }}</div>
          <div class="price" :class="{'original-price': scope.row.discount !== 100 }">原价：${{ scope.row.price.toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="销量" width="120" />
      <el-table-column prop="stock" label="库存数量" width="120" />
      <el-table-column
        prop="status"
        label="状态"
        width="150"
        :filters="filterStatus"
        :filter-method="handleFilter"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">仓库中</el-tag>
          <el-tag v-else-if="scope.row.status === 1">已上架</el-tag>
          <el-tag v-else type="danger">已售罄</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="创建时间" width="200">
        <template #default="scope">
          {{ getDate(scope.row.addTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button 
            v-if="scope.row.status !== 1"
            size="small"
            type="success"
            :disabled="scope.row.stock <= 0"
            @click="handlePutCommodityOnShelves(scope.row._id)"
          >
            上架
          </el-button>
          <el-button 
            v-else
            size="small"
            type="warning"
            @click="handlePutCommodityOffShelves(scope.row._id)"
          >
            下架
          </el-button>
          <el-button 
            size="small"
            type="primary"
            @click="handleEdit(scope.row, scope)"
          >
            编辑
          </el-button>
          <el-popconfirm 
            title="确定要删除该商品吗？"
            width="300"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm> 
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建商品对话框 -->
    <create-commodity-dialog
      ref="dialog"
      :is-visible="isVisible"
      :is-editing="isEditing"
      :cascader-options="cascaderOptions"
      :labels="typeLabels"
      @update-cascader-options="handleUpdateCascaderOptions"
      @confirm="handleConfirm"
      @cancel=" isVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElButton, ElPopconfirm, ElInput, ElTag } from 'element-plus';
import { computed, ref } from 'vue';

import CreateCommodityDialog from 'lowcode-platform/components/create-commodity-dialog/index.vue';
import { StatusCode } from 'lowcode-platform/api/type';
import {  deleteCommodity, getCommodities, putCommodityOffShelves, putCommodityOnShelves } from 'lowcode-platform/api/commodity';
import { getDate } from 'lowcode-platform/utils/time';
import { showErrorMessage, showSuccessMessage } from 'lowcode-platform/utils/toast';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { useElTableHooks } from 'lowcode-platform/hooks/use-el-table-hook';
import { Type } from 'lowcode-platform/store/type-store';
import { useCommodityStore, CommodityStatus } from 'lowcode-platform/store/commodity-store';
import type { Commodity } from 'lowcode-platform/store/commodity-store';

// 商品
const commodities = ref([] as Commodity[]);
// 新建商品对话框是否可见
const isVisible = ref(false);
// 新建商品对话框实例
const dialog = ref<InstanceType<typeof CreateCommodityDialog> | null>(null);

// 是否处于编辑数据状态
const isEditing = ref(false);
// 正在编辑状态的下标
let isEditingIndex = -1;

// 类型级联选择框 hook
const {
  cascaderOptions,
  typeLabels,
  getCascaderOptions
} = useCascaderType(Type.Commodity);

// 获取类型级联选项
getCascaderOptions();

// 使用 el-table 的 hook
const {
  // 表格实例
  table,
  // 搜索关键字
  search,
  // 处理过滤
  handleFilter,
} = useElTableHooks<Commodity>();

// 需要展示的商品
const commoditiesNeedToShow = computed(() => {
  if(!search.value) {
    return commodities.value;
  }

  return commodities.value.filter((commodity) => commodity.name.includes(search.value));
});

// 筛选类型
const filterType = computed(() => {
  const types: string[] = []
  commodities.value.forEach((commodity) => {
    if(types.includes(commodity.type)) return;
    types.push(commodity.type);
  })

  return types.map((type) => ({
    text: typeLabels.value[type],
    value: type,
  }))
});
// 筛选状态
const filterStatus = [
  {
    text: '仓库中',
    value: `${CommodityStatus.OnStore}`,
  },
  {
    text: '已上架',
    value: `${CommodityStatus.OnSale}`,
  },
  {
    text: '已售罄',
    value: `${CommodityStatus.SoldOut}`,
  },
]

// 获取商城
const getCommoditiesFromNetWork = async () => {
  const commodityStore = useCommodityStore();
  const { data } = await getCommodities();
  if (!data || data.code !== StatusCode.Success || !data.commodities) throw new Error(data.msg);
  commodities.value = data.commodities;
  commodityStore.addCommodities(data.commodities);
};
getCommoditiesFromNetWork();

// 处理更新级联选择框
const handleUpdateCascaderOptions = async () => {
 await getCascaderOptions();
 await getCommoditiesFromNetWork();
 if(isEditingIndex === -1) return;
 const commodity = commodities.value[isEditingIndex];
 dialog.value?.setUploadForm(commodity);
};

// 处理确认新增商品或者更新商品
const handleConfirm = () => {
  isVisible.value = false;
  getCommoditiesFromNetWork();
};

// 处理点击编辑按钮
const handleEdit = (commodity: Commodity, scope: any) => {
  dialog.value?.setUploadForm(commodity);
  isEditingIndex = scope.$index;
  isEditing.value = true;
  isVisible.value = true;
};

// 处理删除
const handleDelete = async (commodity: Commodity) => {
  const { data } = await deleteCommodity(commodity._id);
  if (!data || data.code !== StatusCode.Success) {
    throw new Error(data.msg);
  };
  showSuccessMessage(data.msg);
  // 获取商品
  getCommoditiesFromNetWork();
};
// 处理批量删除
const handleDeleteSelectedIds = async () => {
  const selectedRows = table.value?.getSelectionRows() as Commodity[];
  if(!selectedRows || !selectedRows.length) {
    showErrorMessage('未选中需要批量删除的商品');
    return;
  }

  const ids = selectedRows.map((commodity) => commodity._id);
  const { data } = await deleteCommodity(ids);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  getCommoditiesFromNetWork();
};

// 上架商品
const handlePutCommodityOnShelves = async (id: string) => {
  const { data } = await putCommodityOnShelves(id);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  getCommoditiesFromNetWork();
};
// 下架商品
const handlePutCommodityOffShelves = async (id: string) => {
  const { data } = await putCommodityOffShelves(id);
  if (!data || data.code !== StatusCode.Success) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  getCommoditiesFromNetWork();
};
</script>

<style lang="scss" scoped src="./index.scss"></style>