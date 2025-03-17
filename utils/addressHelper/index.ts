import { Property } from '@/types/property';

export const addressHelper = {
  generateCompleteAddress(currentProperty: Property) {
    return `${currentProperty.unit_number ? currentProperty.unit_number + '/' : ''}${currentProperty.street_number} ${currentProperty.street_name}, ${currentProperty.suburb}, ${currentProperty.state} ${currentProperty.postal_code}`;
  },
};
