import { RoomType } from '@/types/task';

export const roomConfigurations = [
  {
    id: 'entrance' as RoomType,
    label: 'Entrance',
    description: '1) Entrance area. 2) lock.',
  },
  {
    id: 'living_room' as RoomType,
    label: 'Living Room',
    description: '1) Sitting area. 2) TV stand area. 3) Waste bin.',
  },
  {
    id: 'bedroom' as RoomType,
    label: 'Bedrooms',
    description: '1) Full view of bed. 2) Nightstand area. 3) Wardrobe area.',
  },
  {
    id: 'kitchen' as RoomType,
    label: 'Kitchen',
    description: '1) Sink, 2) Countertop, 3) Stove, 4) Fridge, 5) Microwave.',
  },
  {
    id: 'bathroom' as RoomType,
    label: 'Bathrooms',
    description: '1) Toilet bowl, 2) Sink, 3) Shower screen. 4) Shower drain',
  },
  {
    id: 'laundry' as RoomType,
    label: 'Laundry/Balcony',
    description: '1) Washing machine/dryer, 2) Balcony.',
  },
  { id: 'other' as RoomType, label: 'Other', description: 'Other areas' },
];
