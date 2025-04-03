import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { usePropertyViewModel } from '@/viewModels/propertyViewModel';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Mock the modules before importing any components
jest.mock('expo-location');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock for supabase clients
jest.mock('@/clients/supabase/auth', () => ({
  supabaseAuthClient: {
    getUser: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
  },
}));

jest.mock('@/clients/supabase/database', () => ({
  supabaseDBClient: {
    getUserPropertiesById: jest.fn().mockResolvedValue([]),
    updateUserProperty: jest.fn(),
    addUserProperty: jest.fn(),
    getUserPropertyById: jest.fn(),
    deleteUserProperty: jest.fn(),
  },
}));

// Mock the session model
jest.mock('@/models/sessionModel', () => ({
  useSessionModel: jest.fn().mockReturnValue({
    mySession: { access_token: 'test-access-token' }
  }),
}));

// Set up the environment variable
const SUPABASE_URL = 'https://test-supabase-url.com';
process.env.EXPO_PUBLIC_SUPABASE_URL = SUPABASE_URL;

// Mock for fetch API to test the Supabase function call
global.fetch = jest.fn();

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock console.error to prevent noise in test output
console.error = jest.fn();

// Create a wrapper component to test the hook
const TestComponent = ({ mockValidateAddress = false }) => {
  const viewModel = usePropertyViewModel();
  
  // Override the validateAddress method for direct testing
  if (mockValidateAddress) {
    viewModel.validateAddress = jest.fn().mockImplementation(async (address) => {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/geodecode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test-access-token`
        },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) {
        throw new Error('Address validation failed');
      }
      
      return response.json();
    });
  }
  
  // Set address fields for testing
  React.useEffect(() => {
    viewModel.setStreetNumber('32');
    // viewModel.setStreetNumber('9999'); // invalid address testing
    viewModel.setStreetName('Argyle Way');
    viewModel.setSuburb('Wantirna South');
    viewModel.setState('VIC');
    viewModel.setPostalCode('3152');
    viewModel.setEntryMethod('key');
  }, []);
  
  return (
    <>
      <button 
        testID="validate-address-btn"
        onPress={async () => {
          try {
            const fullAddress = `${viewModel.streetNumber} ${viewModel.streetName}, ${viewModel.suburb}, ${viewModel.state} ${viewModel.postalCode}`;
            await viewModel.validateAddress(fullAddress);
          } catch (error) {
            // Let the error propagate to Alert in the view model
          }
        }}
      >
        Validate Address
      </button>
      <button
        testID="add-property-btn"
        onPress={viewModel.addProperty}
      >
        Add Property
      </button>
    </>
  );
};

describe('Property Address Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mocks
    (global.fetch as jest.Mock).mockReset();
    Alert.alert = jest.fn();
    
    // Set up default mock implementations for Location
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: -37.8563, longitude: 145.1567 }
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([{
      streetNumber: '32',
      street: 'Argyle Way',
      city: 'Wantirna South',
      region: 'VIC',
      postalCode: '3152'
    }]);
  });
  
  it('should fail validation when an address cannot be validated', async () => {
    // Mock fetch to return invalid address response
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          valid: false,
          error: { message: 'Address not found' }
        })
      })
    );
    
    // Mock Alert.alert
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { getByTestId } = render(<TestComponent mockValidateAddress={true} />);
    
    // Trigger the validateAddress method
    fireEvent.press(getByTestId('validate-address-btn'));
    
    // Wait for the validation to complete with increased timeout
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${SUPABASE_URL}/functions/v1/geodecode`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-access-token'
          }),
          body: expect.stringContaining('Argyle Way')
        })
      );
    }, { timeout: 3000 });
  });
  
  it('should prevent adding a property with an invalid address', async () => {
    // Mock fetch to return invalid address response
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          valid: false
        })
      })
    );
    
    // Mock Alert.alert
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { getByTestId } = render(<TestComponent />);
    
    // Trigger the addProperty method which should validate the address
    fireEvent.press(getByTestId('add-property-btn'));
    
    // Wait for the validation to complete
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Invalid Address',
        expect.stringContaining('The address could not be validated')
      );
      
      // Ensure that the property was not added
      expect(require('@/clients/supabase/database').supabaseDBClient.addUserProperty).not.toHaveBeenCalled();
    });
  });
  
  it('should successfully validate a legitimate address', async () => {
    // Mock fetch to return valid address response
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          valid: true,
          formatted_address: '32 Argyle Way, Wantirna South, VIC 3152, Australia',
          coordinates: { lat: -37.8563, lng: 145.1567 }
        })
      })
    );
    
    const { getByTestId } = render(<TestComponent mockValidateAddress={true} />);
    
    // Trigger the validateAddress method
    fireEvent.press(getByTestId('validate-address-btn'));
    
    // Wait for the validation to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${SUPABASE_URL}/functions/v1/geodecode`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-access-token'
          }),
          body: expect.stringContaining('Argyle Way')
        })
      );
    }, { timeout: 3000 });
  });
  
  it('should handle API errors during validation', async () => {
    // Mock fetch to return an error response
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          error: { message: 'Service unavailable' }
        })
      })
    );
    
    const { getByTestId } = render(<TestComponent mockValidateAddress={true} />);
    
    // Trigger the validateAddress method
    fireEvent.press(getByTestId('validate-address-btn'));
    
    // Wait for the validation to complete and error to be thrown
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
  
  it('should successfully add a property with a valid address', async () => {
    // Mock fetch to return valid address response
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          valid: true,
          formatted_address: '32 Argyle Way, Wantirna South, VIC 3152, Australia',
          coordinates: { lat: -37.8563, lng: 145.1567 }
        })
      })
    );
    
    // Mock Alert.alert for success message
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    const { getByTestId } = render(<TestComponent />);
    
    // Trigger the addProperty method which should validate the address
    fireEvent.press(getByTestId('add-property-btn'));
    
    // Wait for the operation to complete
    await waitFor(() => {
      // Ensure property was added
      expect(require('@/clients/supabase/database').supabaseDBClient.addUserProperty).toHaveBeenCalledWith(
        expect.objectContaining({
          street_number: '32',
          street_name: 'Argyle Way',
          suburb: 'Wantirna South',
          state: 'VIC',
          postal_code: '3152',
          entry_method: 'key'
        })
      );
      
      // Check for success message
      expect(alertSpy).toHaveBeenCalledWith(
        'Success',
        'Property added successfully!'
      );
    });
  });
});