export type HouseOwnerTask = {
  task_id?: number;
  customer_id: string;
  task_title: string; // shown as the card's main title
  task_type: string; // new row with icon
  scheduled_start_time: string | null;
  estimated_price: number;
  budget: number;
  confirmed_price: number | null;
  payment_status: string;
  date_updated: string;
  approval_status: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  is_confirmed: boolean;
  cleaner_id: string | null;
  check_in_time: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  cleaning_type: string;
  bring_equipment: string;
  property_id: number | null;
  estimated_hours: number;
  schedule_mode: string;
};

export type CleanerTask = {
  task_id?: number;
  task_type: 'Quick Cleaning' | 'Regular Cleaning' | 'Deep Cleaning';
  task_title: string;
  estimated_price: number;
  confirmed_price: number | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  payment_status: 'Not Paid' | 'Paid';
  scheduled_start_time: string;
  actual_start_time: string | null;
  completion_time: string | null;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  budget: number;
};
