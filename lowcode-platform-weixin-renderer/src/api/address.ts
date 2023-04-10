import { showSuccessToast, showFailToast } from 'lowcode-platform-weixin-renderer/utils/toast';
import { LOCAL_STORAGE_KEY_OF_TOKEN } from 'lowcode-platform-common/common/index';
import type { AddressInfo, UserAddress } from 'lowcode-platform-common/type/address';
import { get, post } from './request';
import { handleErrorCode } from 'lowcode-platform-weixin-renderer/utils/error';

/**
 * 根据商城 id 获取商城 schema
 * @param id 商城 id
 * @returns 
 */
export async function getAddressInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'address/get',
    header: {
      Authorization: token
    }
  });

  const { code, msg, userAddress } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  };

  return userAddress as UserAddress;
}

/**
 * 添加地址信息
 * @param addressInfo 新增的地址信息 
 * @returns 
 */
export async function addAddressInfo(addressInfo: AddressInfo) {
  const resp = post({
    url: 'address/add',
    data:{
      address: addressInfo,
    }
  });

  const { code, msg } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  };

  showSuccessToast(msg);
}

/**
 * 更新地址信息
 * @param id 用户地址记录 id
 * @param addressInfo 地址信息
 * @returns 
 */
export async function updateAddressInfo(id: string, addressInfo: AddressInfo) {
  const resp = post({
    url: 'address/update',
    data: {
      address: addressInfo,
      _id: id,
    }
  });

  const { code, msg } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  showSuccessToast(msg);
}

/**
 * 删除地址信息
 * @param id 用户地址记录 id
 * @param addressInfoId 地址信息 id
 */
export async function deleteAddressInfo(id: string, addressInfoId: string) {
  const resp = post({
    url: 'address/delete',
    data: {
      _id: id,
      addressInfoId,
    }
  });

  const { code, msg } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  showSuccessToast(msg);
};

/**
 * 修改选中地址信息
 * @param id 用户地址记录 id
 * @param addressInfoId 地址信息 id
 * @returns 
 */
export async function selectAddressInfo(id: string, addressInfoId: string) {
  const resp = post({
    url: 'address/select',
    data: {
      _id: id,
      addressInfoId,
    }
  });
 
  const { code, msg } = await resp as any;
  
  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  showSuccessToast(msg);
};

/**
 * 获取当前选中的地址信息
 * @returns 选中的地址信息
 */
export async function getSelectedAddressInfo() {
  const token = uni.getStorageSync(LOCAL_STORAGE_KEY_OF_TOKEN) || '';
  const resp = await get({
    url: 'address/getSelectedAddress',
    header: {
      Authorization: token
    }
  });

  const { code, msg, address } = await resp as any;

  if(code) {
    handleErrorCode(code, msg);
    return;
  }

  return address as AddressInfo;
}