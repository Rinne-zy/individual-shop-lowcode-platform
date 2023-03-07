<template>
  <div class="commodity-select">
    <div class="commodity-select-top">
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
        :filter-method="handlerFilter"
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
        :filter-method="handlerFilter"
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
import { ElTable, ElTableColumn, ElButton, ElInput, ElTag } from 'element-plus';
import type { TableColumnCtx, CascaderOption } from 'element-plus';
import { computed, ref } from 'vue';

import CreateCommodityDialog from 'lowcode-platform/components/create-commodity-dialog/index.vue';
import { getCascaderType } from 'lowcode-platform/api/type/index';
import { StatusCode } from 'lowcode-platform/api/type';
import { CommodityStatus, getCommodities } from 'lowcode-platform/api/commodity';
import type { Commodity } from 'lowcode-platform/api/commodity';
import { getDate } from 'lowcode-platform/utils/time';

// 搜索关键字
const search = ref('');
const isVisible = ref(false);
const commodities = ref([] as Commodity[]);
// 类型标签
const typeLabels = ref<Record<string, string>>({});
// 级联选择框选项
const cascaderOptions = ref({} as {id: string, options: CascaderOption[]});
const dialog = ref<InstanceType<typeof CreateCommodityDialog> | null>(null);
const table = ref<InstanceType<typeof ElTable> | null>(null);
// 是否处于编辑数据状态
const isEditing = ref(false);
// 正在编辑状态的下标
let isEditingIndex = -1;
// 需要展示的商品
const commoditiesNeedToShow = computed(() => {
  if(!search.value) {
    return commodities.value;
  }

  return commodities.value.filter((commodity) => commodity.name.includes(search.value));
})
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

// 获取级联选项
const getCascaderOptions = async () => {
  const { data } = await getCascaderType('commodity');
  if (!data || data.code !== StatusCode.Success || !data.options) throw new Error(data.msg);
  cascaderOptions.value.id = data.id;
  cascaderOptions.value.options = data.options;
  typeLabels.value = data.labels;
};
getCascaderOptions();
// 获取商城
const getCommoditiesFromNetWork = async () => {
  const { data } = await getCommodities();
  if (!data || data.code !== StatusCode.Success || !data.commodities) throw new Error(data.msg);
  commodities.value = data.commodities;
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
// 处理表格筛选
const handlerFilter = <T>(
  value: string | number,
  row: T,
  column: TableColumnCtx<T>
) => {
  const property = column['property'] as keyof T;
  // 由于 filter 必须为 string，因此需要转换类型为字符串
  return `${row[property]}`=== value
};
</script>

<style lang="scss" scoped src="./index.scss"></style>