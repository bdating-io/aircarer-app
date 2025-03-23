// 地址类型定义
export type Address = {
  id?: string;
  type: string;
  street_number: string;
  street_name: string;
  city: string;
  state: AustralianState;
  postal_code: string;
  country: string;
  latitude?: string;
  longitude?: string;
  validated?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
};

// 地址验证错误类型
export interface AddressValidationError {
  field: keyof Address;
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
