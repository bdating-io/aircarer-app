// mockData.tsx
export interface IProperty {
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    livingRooms: number;
    courtYards: number;
    others: string[];
  }

export const mockProperties: IProperty[] = [
  {
    id: '1',
    name: '2b1b Apartment',
    bedrooms: 2,
    bathrooms: 1,
    kitchens: 1,
    livingRooms: 1,
    courtYards: 0,
    others: [],
  },
  {
    id: '2',
    name: '3b2b House',
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    livingRooms: 1,
    courtYards: 1,
    others: ['Study', 'Balcony'],
  },
];