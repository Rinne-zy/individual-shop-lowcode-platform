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
      @current-change="handleCurrentChange"
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
    </el-table>
    <!-- 新建商品对话框 -->
    <create-commodity-dialog
      ref="dialog"
      :is-visible="isVisible"
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
import { computed, ref } from 'vue';

import CreateCommodityDialog from 'lowcode-platform/components/create-commodity-dialog/index.vue';
import { StatusCode } from 'lowcode-platform/api/type';
import { CommodityStatus, getCommodities } from 'lowcode-platform/api/commodity';
import type { Commodity } from 'lowcode-platform/api/commodity';
import { getDate } from 'lowcode-platform/utils/time';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { useElTableHooks } from 'lowcode-platform/hooks/use-el-table-hook';
import { Type } from 'lowcode-platform/store/type-store';

// 商品
const commodities = ref([] as Commodity[]);
// 新建商品对话框是否可见
const isVisible = ref(false);
// 新建商品对话框实例
const dialog = ref<InstanceType<typeof CreateCommodityDialog> | null>(null);
// 使用 el-table 的 hook
const {
  // 表格实例
  table,
  // 搜索关键字
  search,
  // 当前单选选中行
  currentRow,
  // 处理单选
  handleCurrentChange,
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

// 类型级联选择框 hook
const {
  // 级联选择框选项
  cascaderOptions,
  // 类型标签
  typeLabels,
  // 获取级联选择框相关数据
  getCascaderOptions
} = useCascaderType(Type.Commodity);

getCascaderOptions();

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
  const { data } = await getCommodities();
  if (!data || data.code !== StatusCode.Success || !data.commodities) throw new Error(data.msg);
  commodities.value = data.commodities;
};
getCommoditiesFromNetWork();

// 处理更新级联选择框
const handleUpdateCascaderOptions = async () => {
 await getCascaderOptions();
 await getCommoditiesFromNetWork();
};

// 处理确认新增商品或者更新商品
const handleConfirm = () => {
  isVisible.value = false;
  getCommoditiesFromNetWork();
};
</script>

<style lang="scss" scoped src="./index.scss"></style>