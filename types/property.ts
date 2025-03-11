export type Property = {
  property_id: string;
  user_id: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  pet_cleaning: boolean;
  carpet_cleaning: boolean;
  range_hood_cleaning: boolean;
  oven_cleaning: boolean;
  entry_method: string;
  unit_number?: string;
  street_number?: string;
  street_name?: string;
  suburb?: string;
  state?: string;
  postal_code?: string;
};
