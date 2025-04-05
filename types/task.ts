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
  scheduled_start_date: string;
  scheduled_start_time: string;
  scheduled_period?: string;
  estimated_price: number;
  budget: number;
  confirmed_price?: number;
  payment_status: TaskPaymentStatus;
  date_updated: string;
  approval_status: TaskApprovalStatus;
  address: string;
  latitude: number;
  longitude: number;
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

export type RoomType =
  | 'entrance'
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'laundry'
  | 'other';

export type RoomPhotos = {
  [key: string]: string[];
};
