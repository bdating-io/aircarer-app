export type ProfileData = {
  firstName: string;
  lastName: string;
  abn: string;
  role: 'Laundry Partner' | 'Supervisor' | 'Cleaner' | 'House Owner';
  isBackgroundChecked: boolean;
};

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  role: 'cleaner' | 'house_owner';
  terms_accepted: boolean;
  terms_accepted_at?: string;
  created_at: string;
  updated_at: string;
}
