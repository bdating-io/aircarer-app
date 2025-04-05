export type RoomPhoto = {
  id?: string;
  task_id: string;
  room_type: string;
  photo_type: string;
  photo_url: string;
  created_at?: string;
  uploaded_by?: string;
};

export type RoomType =
  | 'entrance'
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'laundry'
  | 'other';
