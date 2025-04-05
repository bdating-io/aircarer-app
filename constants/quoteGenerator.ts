type CleaningType = 'End-of-Lease/Sale' | 'AirBnB';
type PropertyType = 'House' | 'Apartment' | 'Townhouse/Unit';
/**
 * structure of the price calculator result for UI display
 * also for saving to database as JSON object to represent Quote and Invoice
 */
export type Quote = {
  task_id?: string; // task id
  grand_total: number; // grandTotal = subTotal + totalTax
  sub_total: number,
  total_tax: number,
  line_items: QuoteLineItem[];
}

/**
 * structure of the price configuration line item
 */
type PriceConfigLineItem = { 
  category: string; // basePackage, extraRoom, extraItem, toBePricedExtraItem
  name: string; // name of the item
  unitPrice: number; // unit price of the item
  unitPriceText?: string; // unit price text for extra items such as "Based on property size"
  label: string; // displayed on the quote/invoice
  unit: string; //for extra items only
  isToBePricedLater: boolean; //for extra items priced later only
  description?: string; //displayed on the quote/invoice
};

/**
 * same as PriceConfigLineItem but with two additional fields for becoming quote line item
 */
type QuoteLineItem = {  
  category: string;
  name: string;
  unitPrice: number;
  unitPriceText?: string;
  label: string;
  unit?: string;
  isToBePricedLater?: boolean;
  description?: string; 

  quantity: number; // number of items added to the quote
  lineTotal: number, // total price for this line item, e.g. unitPrice * quantity
};


/**
 * structure of the price configuration
 */
interface PriceConfig {
  // key: based on type of cleaning job, e.g. "End-of-Lease/Sale" or "AirBnB"
  [key: string]: PriceConfigLineItem[];
}
const PRICE_CONFIG: PriceConfig = {
  "End-of-Lease/Sale": [
    { category: "basePackage", name: "base", unitPrice: 270, label: "Base Cleaning Package", description: "Includes:\n1 Bedroom, 1 Bathroom, 1 Living Room, 1 Dining area, 1 Kitchen (with 1 Oven and 1 Rangehood)", unit: "each", isToBePricedLater: false},
    //
    { category: "extraRoom", name: "bedroom", unitPrice: 40, label: "Additional Bedroom", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "bathroom", unitPrice: 40, label: "Additional Bathroom", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "kitchen", unitPrice: 40, label: "Additional Kitchen", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "livingroom", unitPrice: 40, label: "Additional Living room", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "diningroom", unitPrice: 40, label: "Additional Dining room", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "laundry", unitPrice: 40, label: "Laundry", unit: "each", isToBePricedLater: false },
    { category: "extraRoom", name: "balcony", unitPrice: 40, label: "Balcony", unit: "each", isToBePricedLater: false },
    // 
    { category: "extraItem", name: "oven", unitPrice: 60, unit: "Each", label: "Oven Cleaning", isToBePricedLater: false },
    { category: "extraItem", name: "rangehood", unitPrice: 60, unit: "Each", label: "Range Hood (Grease Removal)", isToBePricedLater: false},
    { category: "extraItem", name: "fridge", unitPrice: 60, unit: "Each", label: "Fridge Cleaning", isToBePricedLater: false },
    { category: "extraItem", name: "rubbish", unitPrice: 30, unit: "Per bin", label: "Rubbish Disposal", isToBePricedLater: false },
    { category: "extraItem", name: "garagestorage", unitPrice: 50, unit: "Per 15-40m²", label: "Oven Garage / Storage Cleaning", isToBePricedLater: false },
    { category: "extraItem", name: "wallspot", unitPrice: 50, unit: "Per section (2m x 2m)", label: "Wall Spot Cleaning", isToBePricedLater: false },
    { category: "toBePricedExtraItem", name: "carpet", unitPrice: 0, unitPriceText: "Based on property size", unit: "Per room", label: "Carpet Steam Cleaning", isToBePricedLater: true },
    { category: "toBePricedExtraItem", name: "parking", unitPrice: 0, unitPriceText: "Based on hourly rate", unit: "Per hour", label: "Parking Fee (If applicable)", isToBePricedLater: true  }
    ],
  // "AirBnB": [
  //   { category: "basePrice", name: "base", unitPrice: 270, quantity: 1, label: "Base Cleaning Package", description: "Includes:\n1 Bedroom, 1 Bathroom, 1 Living Room, 1 Dining area, 1 Kitchen (with 1 Oven and 1 Rangehood)"}
  // ]
}

export const createQuote = (numBedrooms: number,
  numBathrooms: number,
  numLivingrooms: number,
  cleaningType: CleaningType,
  propertyType: PropertyType) => {

  const matchingConfig = PRICE_CONFIG[cleaningType as CleaningType];
  if (!matchingConfig) {
    {
      throw new Error("No matching price configuration found");
    }
  }

  const newQuote: Quote = {
    grand_total: 0,
    total_tax: 0,
    sub_total: 0,
    line_items: [] as QuoteLineItem[]
  };
  const propertyTypeMultiplier = propertyType === "Apartment" ? 1.0 
  : propertyType === "Townhouse/Unit" ? 1.2 : 1.4;

  // add base packge to quote
  addBasePackageToQuote(propertyTypeMultiplier, newQuote, matchingConfig);

  numBedrooms -= 1; if (numBedrooms < 0) numBedrooms = 0;
  numBathrooms -= 1; if (numBathrooms < 0) numBathrooms = 0;
  numLivingrooms -= 1; if (numLivingrooms < 0) numLivingrooms = 0;

  addExtraRoomToQuote(propertyTypeMultiplier, numBedrooms, 'bedroom', matchingConfig, newQuote);
  addExtraRoomToQuote(propertyTypeMultiplier, numBathrooms, 'bathroom', matchingConfig, newQuote);
  addExtraRoomToQuote(propertyTypeMultiplier, numLivingrooms, 'livingroom', matchingConfig, newQuote);
  // //TODO: capture more room types and add to calculation
  newQuote.total_tax = parseFloat(getDollarAmount(newQuote.sub_total * 0.1)); // 10% tax
  newQuote.grand_total = newQuote.sub_total + newQuote.total_tax;
  return newQuote;
}

function addBasePackageToQuote(propertyTypeMultiplier: number, newQuote: Quote, matchingConfig: PriceConfigLineItem[]) {
  newQuote.line_items.push({ ...matchingConfig[0], quantity: 1, lineTotal: matchingConfig[0].unitPrice * propertyTypeMultiplier});
  newQuote.sub_total += matchingConfig[0].unitPrice * propertyTypeMultiplier;
}

function addExtraRoomToQuote(propertyTypeMultiplier: number, numberOfRooms: number, roomName: string, matchingConfig: PriceConfigLineItem[], result: Quote) {
  if (numberOfRooms > 0) {
    const extraRoomConfig = matchingConfig.find(item => ( item.category === "extraRoom" && item.name === roomName));
    if(extraRoomConfig){
    const extraRoomQuoteLineItem: QuoteLineItem = {
        ...extraRoomConfig,
        quantity: numberOfRooms,
        unitPrice: extraRoomConfig.unitPrice * propertyTypeMultiplier,
        lineTotal: extraRoomConfig.unitPrice * numberOfRooms * propertyTypeMultiplier
      }
      result.line_items.push(extraRoomQuoteLineItem);
      result.sub_total += extraRoomQuoteLineItem.lineTotal;
    }
  }
}


export const getDollarAmount = (amount: number): string => {
  return (Math.round((amount * 100) / 100)).toFixed(2);
};