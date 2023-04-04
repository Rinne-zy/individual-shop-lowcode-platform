// 地址列表数据类型
export type AddressListAddress = {
  id: string | number;
  tel: string | number;
  name: string;
  address: string;
  isDefault?: boolean;
};