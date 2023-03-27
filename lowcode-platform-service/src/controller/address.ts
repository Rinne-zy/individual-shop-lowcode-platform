import type { AddressInfo } from './../models/address';
import Address from '../models/address';
import { StatusCode } from '../const';

/**
 * 获取用户的地址信息
 * @param username 用户名
 * @returns 
 */
export async function getAddress(username: string) {
  const userAddress = await Address.findOne({ username });
  return {
    code: StatusCode.Success,
    userAddress,
    msg: '获取地址成功',
  };
}

/**
 * 获取选中的地址信息
 * @param username 用户名
 * @returns 
 */
export async function getSelectedAddress(username: string) {
  const userAddress = await Address.findOne({ username });
  let selectedAddress: any;
  
  if(userAddress) {
    const { selectedAddressId, address, defaultAddressId } = userAddress;
    // 根据 id 进行判断设置默认地址的信息
    selectedAddress = {
      ...address.find((info) => info.id === selectedAddressId),
      isDefault: defaultAddressId === selectedAddressId,
    };
  }

  return {
    code: StatusCode.Success,
    address: selectedAddress,
    msg: '获取地址成功',
  };
};

/**
 * 添加新地址
 * @param username 用户名
 * @param addressInfo 地址信息
 * @returns 
 */
export async function addNewAddress(username: string, addressInfo: AddressInfo, setDefault = false) {
  if(!addressInfo) throw new Error('添加的地址信息有误');

  const userAddress = await Address.findOne({ username });
  if(userAddress) {
    // 已存在该用户的地址，添加至 address 数组
    const { address } = userAddress;
    address.push(addressInfo);
    // 更新为默认地址
    if(setDefault) {
      userAddress.defaultAddressId = addressInfo.id;
    };
    await userAddress.save();
  } else {
    // 未存在该用户的地址，创建新记录
    Address.create({
      username,
      selectedAddressId: addressInfo.id,
      defaultAddressId: addressInfo.id,
      address: [
        addressInfo,
      ]
    });
  }

  return {
    code: StatusCode.Success,
    msg: '添加地址成功',
  }
};

/**
 * 更新地址信息
 * @param id 用户地址记录 id（_id）
 * @param addressInfo 地址信息
 * @returns 
 */
export async function updateAddress(id: string, addressInfo: AddressInfo, setDefault = false) {
  if(!addressInfo) throw new Error('更新的地址信息有误');

  const userAddress = await Address.findById(id);
  if(!userAddress) {
    throw new Error('当前用户地址记录 id 有误');
  };

  const { address } = userAddress;
  const index = address.findIndex((info) => info.id === addressInfo.id);

  if(index === -1) {
    address.push(addressInfo);
  } else {
    address.splice(index, 1, addressInfo);
  }

  // 更新为默认地址
  if(setDefault) {
    userAddress.defaultAddressId = addressInfo.id;
  };
  
  await userAddress.save();
  return {
    code: StatusCode.Success,
    msg: '更新地址成功',
  }
};

/**
 * 删除地址
 * @param id 用户地址记录 id
 * @param addressInfoId 地址信息 id
 */
export async function deleteAddress(id: string, addressInfoId: string) {

  const userAddress = await Address.findById(id);
  if(!userAddress) {
    throw new Error('当前用户地址记录 id 有误');
  };

  const { address } = userAddress;
  const index = address.findIndex((info) => info.id === addressInfoId);

  if(index === -1) {
    throw new Error('当前地址信息 id 不存在');
  };

  address.splice(index, 1);
  
  if(userAddress.selectedAddressId === addressInfoId) {
    // 若被删除的地址为默认地址，则默认为第一个
    userAddress.selectedAddressId = address[0].id;
  };

  await userAddress.save();
  return {
    code: StatusCode.Success,
    msg: '删除地址成功',
  }
};

/**
 * 选择地址
 * @param id 用户地址记录 id（_id）
 * @param addressInfoId 地址信息 id
 * @returns 
 */
export async function selectAddress(id: string, addressInfoId: string) {
  await Address.findByIdAndUpdate(id, {
    selectedAddressId: addressInfoId,
  });

  return {
    code: StatusCode.Success,
    msg: '修改选中地址成功',
  }
};


/**
 * 获取用户的地址详情信息信息
 * @param username 用户名
 * @returns 
 */
export async function getAddressDetailInfo(username: string) {
  const userAddress = await Address.findOne({ username });
  if(!userAddress) throw new Error('当前用户的地址不存在地址');
  

  const { selectedAddressId, address } = userAddress;
  const addressInfo = address.find((info) => info.id === selectedAddressId);

  if(!addressInfo) throw new Error('当前用户选中的地址信息错误');

  const { city, province, county, addressDetail } = addressInfo

  if(!city && !province && !county) return ''
  return `${addressInfo.city === addressInfo.province ? addressInfo.province : addressInfo.city}${addressInfo.county}${addressDetail}`
}