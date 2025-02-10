// priceCalculator.ts
import { IProperty } from '../mockData/mockData';

export type CleaningType = 'express' | 'regular' | 'deep';

const SPECIAL_REQUEST_SURCHARGES: Record<string, number> = {
  'Pet fur cleaning': 25,
  'Carpet steaming': 40,
  'Range hood cleaning': 25,
  'Oven cleaning': 25,
  'Outdoor cleaning': 50,
};

export interface PriceCalculationParams {
  property: IProperty;
  cleaningType: CleaningType;
  specialRequests: string[];  // array of request titles
}

export function calculateCleaningPrice({
  property,
  cleaningType,
  specialRequests,
}: PriceCalculationParams): number {
  // 1) Calculate total rooms
  const { bedrooms, bathrooms, kitchens, livingRooms, courtYards, others } = property;
  // Decide how you count "others" -> up to your business logic
  const totalRooms =
    bedrooms + bathrooms + kitchens + livingRooms + courtYards + (others?.length || 0);

  // 2) Calculate express cleaning base
  //    If totalRooms <= 1, the base price is just 40.
  //    Otherwise: 40 + 20 * (totalRooms - 1)
  let expressPrice = 40;
  if (totalRooms > 1) {
    expressPrice += 20 * (totalRooms - 1);
  }

  // 3) Adjust for cleaning type
  let totalPrice = 0;
  switch (cleaningType) {
    case 'express':
      totalPrice = expressPrice;
      break;
    case 'regular':
      totalPrice = 2 * expressPrice;
      break;
    case 'deep':
      totalPrice = 3 * expressPrice;
      break;
  }

  // 4) Add surcharges for special requests
  specialRequests.forEach((request) => {
    if (SPECIAL_REQUEST_SURCHARGES[request]) {
      totalPrice += SPECIAL_REQUEST_SURCHARGES[request];
    }
    // If you have a custom request that isn't in the table,
    // you could either skip it or handle it with a default fee.
  });

  return totalPrice;
}
