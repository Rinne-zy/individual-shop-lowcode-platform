import { ref } from 'vue';
import type { ElTable, TableColumnCtx } from 'element-plus/es/components/table';


export function useElTableHooks<Type>() {
  // 表格实例
  const table = ref<null | InstanceType<typeof ElTable>>();
  // 搜索关键字
  const search = ref('');
  // 当前单选选中的行
  const currentRow = ref<Type>();

  // 处理表格筛选
  const handleFilter = <T>(
    value: string | number,
    row: T,
    column: TableColumnCtx<T>
  ) => {
    const property = column['property'] as keyof T;
    // 由于 filter 必须为 string，因此需要转换类型为字符串
    return `${row[property]}`=== value
  };

  // 处理单选
  const handleCurrentChange  = (val: Type) => {
    currentRow.value = val
  };

  return {
    table,
    search,
    currentRow,
    handleCurrentChange,
    handleFilter,
  }
}