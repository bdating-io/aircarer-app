import { TimeSlot } from './profile';

export type WorkPreference = {
  user_id: string;
  area: {
    distance: number;
    latitude?: number;
    longitude?: number;
  };
  time: TimeSlot[];
  experience: string;
  pricing: string;
};
