export enum Role {
  LaundryPartner = 'Laundry Partner',
  Supervisor = 'Supervisor',
  Cleaner = 'Cleaner',
  HouseOwner = 'House Owner',
}

export type Profile = {
  id?: string;
  username?: string;
  first_name: string;
  last_name: string;
  abn?: string;
  role: Role;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  updated_at?: string;
  bio?: string;
  location?: string;
  pricing?: string;
};

export type TimeSlot = {
  day: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};
