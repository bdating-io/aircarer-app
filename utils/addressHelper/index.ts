import { Property } from '@/types/property';

export const addressHelper = {
  generateCompleteAddress(property: Property) {
    return `${property.unit_number ? property.unit_number + '/' : ''}${property.street_number} ${property.street_name}, ${property.suburb}, ${property.state} ${property.postal_code}`;
  },
};
