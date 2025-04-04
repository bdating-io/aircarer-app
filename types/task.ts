type TaskStatus =
  | 'New'
  | 'Pending'
  | 'Booked'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

type TaskType = 'Quick Cleaning' | 'Regular Cleaning' | 'Deep Cleaning';
type TaskPaymentStatus = 'Not Paid' | 'Paid' | 'Completed';
type TaskApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export type Task = {
  task_id?: string;
  customer_id: string;
  status: TaskStatus;
  task_type: TaskType; // new row with icon
  scheduled_start_date: string | null;
  scheduled_start_time: string | null;
  scheduled_period: string | null;
  estimated_price: number;
  budget: number;
  confirmed_price: number | null;
  payment_status: TaskPaymentStatus;
  date_updated: string;
  approval_status: TaskApprovalStatus;
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
  special_requirements: SpecialRequirements;
};

export type CleanerTask = Partial<Task>;

export type SpecialRequirements = {
  toggles: {
    pet_fur_cleaning: boolean;
    carpet_steaming: boolean;
    rangehood_cleaning: boolean;
    oven_cleaning: boolean;
    outdoor_cleaning: boolean;
    dishwasher_cleaning: boolean;
  };
  numeric: {
    glass_cleaning: number;
    wall_stain_removal: number;
  };
  custom: string;
};

export enum PaymentStatus {
  NotPaid = 'Not Paid',
  Paid = 'Paid',
  Completed = 'Completed',
}
