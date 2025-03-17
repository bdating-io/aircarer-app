// 地址类型定义
export interface Address {
  id?: string;
  type: string;
  street_number: string;
  street_name: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: string | null;
  longitude?: string | null;
  validated?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 地址表单数据类型
export interface AddressFormData {
  type: string;
  street_number: string;
  street_name: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: string;
  longitude?: string;
  [key: string]: string | undefined;
}

// 地址验证错误类型
export interface AddressValidationError {
  field: keyof AddressFormData;
  message: string;
}

// 地址类型枚举
export enum AddressType {
  Home = 'Home',
  Work = 'Work',
  Other = 'Other',
}

// 澳大利亚州份枚举
export enum AustralianState {
  NSW = 'NSW',
  VIC = 'VIC',
  QLD = 'QLD',
  WA = 'WA',
  SA = 'SA',
  TAS = 'TAS',
  ACT = 'ACT',
  NT = 'NT',
}
