/**
 * 基础清洁价格配置
 */
export type PriceConfigItem = {
    type: string;           // e.g. "Studio", "1B1B1L"
    bedrooms: number;       // e.g. 1
    bathrooms: number;      // e.g. 1
    livingrooms: number;    // e.g. 1
    basePrice: number;      // 基础清洁价格
    steamPrice: number;     // 含蒸汽地毯清洁的价格
  };
  
  /**
   * 特殊需求价格配置
   */
  export type SpecialRequestItem = {
    id: string;             // 唯一ID，例如 "stairCarpetCleaning"
    label: string;          // 显示名称，例如 "Stair Carpet Cleaning"
    priceType: "flat" 
             | "perItem" 
;   // 定价类型，"flat" 为固定价格，"perItem" 为每个项目的价格
    price: number;          // 单价或固定价
  };
  
  export type ServiceConfig = {
    task_id?: uuid;            // 绑定task_id
    user_id?: uuid;       // 绑定user_id，可选
    priceConfig: PriceConfigItem[];
    specialRequestConfig: SpecialRequestItem[];
  };
  