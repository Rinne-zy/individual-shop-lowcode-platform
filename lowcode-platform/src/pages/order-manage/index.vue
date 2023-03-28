<template>
  <div class="order-manage">
    <div class="order-manage-top">
      <!-- 搜索框 -->
      <el-input
        v-model="search"
        :placeholder="placeholderText"
        class="input-with-select"
      >
        <template #prepend>
          <el-button><i class='iconfont icon-search'/></el-button>
        </template>
        <template #append>
          <el-select v-model="selectedInputType" style="width: 150px;">
            <el-option
              v-for="(value, key) in textByInputType"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </template>
      </el-input>
    </div>
      <el-table :data="filteredOrderForms" border style="width: 100%" height="600">
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.commodities" class="commodity-table">
              <el-table-column label="商品 id" prop="_id" width="300" />
              <el-table-column label="商品封面" prop="number" width="200">
                <template #default="scope">
                  <img :src="scope.row.cover" :width="50" :height="50">
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="name" width="250" />
              <el-table-column label="商品件数" prop="number" width="250" />
              <el-table-column label="商品价格" prop="price" width="250" />
              <el-table-column
                prop="type"
                label="商品分类"
                width="200"
              >
                <template #default="scope">
                  {{ typeLabels[scope.row.type] }}
                </template>
              </el-table-column>
            </el-table>
            <div class="expand-operation">
              <el-button v-if="props.row.status === OrderStatus.Preparing" type="primary" @click="deliver(props.row._id)" >发货</el-button>
              <el-button v-if="props.row.status === OrderStatus.Delivering" type="success">查看物流</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="_id" label="订单编号" width="300" />
        <el-table-column prop="shop.name" label="商城名称" width="200">
          <template #default="scope">
            {{ scope.row.shop.name }}
          </template>
        </el-table-column>
        <el-table-column prop="customer.name" label="买家名称" width="150">
          <template #default="scope">
            {{ scope.row.customer.username }}
          </template>
        </el-table-column>
        <el-table-column prop="customer.address" label="买家地址" width="250">
          <template #default="scope">
            {{ scope.row.customer.address }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价" width="150">
          <template #default="scope">
            ￥{{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="订单状态"
            width="150"
            :filters="filterType"
            :filter-method="handleFilter"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.status === OrderStatus.Paying">待支付</el-tag>
              <el-tag v-else-if="scope.row.status === OrderStatus.Preparing">待发货</el-tag>
              <el-tag v-else-if="scope.row.status === OrderStatus.Delivering" type="success">已发货</el-tag>
              <el-tag v-else type="info">已完成</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="200">
          <template #default="scope">
            {{ getDate(scope.row.created) }}
          </template>
        </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="logisticsDialogVisible" title="填写物流" @close="reset">
    <el-form :model="logisticsForm">
      <el-form-item label="trackNumber">
        <el-input v-model="logisticsForm.trackNumber" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElTable, ElTableColumn, ElTag, ElButton, ElForm, ElFormItem, ElInput, ElDialog, ElSelect, ElOption } from 'element-plus';

import { getDate } from 'lowcode-platform/utils/time';
import { deliverOrderForm, getOrdersByUsername } from 'lowcode-platform/api/order';
import { Order, OrderStatus } from 'lowcode-platform-common/type/order';
import { StatusCode } from 'lowcode-platform/api/type';
import { useCascaderType } from 'lowcode-platform/hooks/use-cascader-type-hook';
import { Type } from 'lowcode-platform/store/type-store';
import { showSuccessMessage } from 'lowcode-platform/utils/toast';
import { useElTableHooks } from 'lowcode-platform/hooks/use-el-table-hook';

enum InputType {
  ID = 1,
  CustomerName = 2
}

const textByInputType = {
  [InputType.ID]: '订单ID',
  [InputType.CustomerName]: '买家名称'
};
// 订单数据
const orderForms = ref<Order[]>();
// 物流订单
const logisticsForm = reactive({
  id: '',
  trackNumber: '',
});
// 使用 el-table 的 hook
const {
  // 搜索关键字
  search,
  // 处理过滤
  handleFilter,
} = useElTableHooks<Order>();
// 物流填写对话框是否可见
const logisticsDialogVisible = ref(false);
// 搜索输入类型
const selectedInputType = ref(textByInputType[InputType.ID]);
// 输入 placeholder
const placeholderText = computed(() => selectedInputType.value === textByInputType[InputType.ID] ? '搜索订单 ID': '搜索买家名称');
// 订单状态过滤
const filterType =[
  {
    value:  `${OrderStatus.Paying}`, 
    text: '待支付',
  },
  {
    value:  `${OrderStatus.Preparing}`, 
    text: '待发货',
  },
  {
    value: `${OrderStatus.Delivering}`, 
    text: '已发货',
  },
]
// 过滤的订单数据
const filteredOrderForms = computed(() => {
  if(!search.value) return orderForms.value;

  if(selectedInputType.value === textByInputType[InputType.ID]) {
    return orderForms.value?.filter((orderForm) => orderForm._id.includes(search.value)) || []
  } else {
    return orderForms.value?.filter((orderForm) => orderForm.customer.username.includes(search.value)) || []
  }
})

const {
  typeLabels,
  getCascaderOptions
} = useCascaderType(Type.Commodity);

// 获取类型级联选项
getCascaderOptions();

const getOrders = async () => {
  const { data } = await getOrdersByUsername();
  if (!data || data.code !== StatusCode.Success || !data.orders) throw new Error(data.msg);
  orderForms.value = data.orders;
}
getOrders();

// 取消
const reset = () => {
  logisticsDialogVisible.value = false;
  logisticsForm.trackNumber = '';
  logisticsForm.id = '';
};

// 确认
const handleConfirm = async () => {
  const { data } = await deliverOrderForm(logisticsForm.id, logisticsForm.trackNumber);
  if (!data || data.code !== StatusCode.Success ) throw new Error(data.msg);
  showSuccessMessage(data.msg);
  reset();
  getOrders();
};
// 发货
const deliver = (id: string) => {
  logisticsForm.id = id;
  logisticsDialogVisible.value = true;
}

</script>

<style lang="scss" scoped src="./index.scss"></style>