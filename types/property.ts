export type Property = {
  property_id?: string;
  user_id: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  living_rooms: number;
  entry_method: string;
  unit_number?: string;
  street_number: string;
  street_name: string;
  suburb: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
};
