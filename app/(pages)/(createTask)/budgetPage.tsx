import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingContext } from '../components/BookingContext';
import { calculateCleaningPrice } from '../utilities/priceCalculator';

export default function BudgetPage() {
  const router = useRouter();
  const { bookingData, setBudget } = useBookingContext();
  const [budget, setBudgetLocal] = useState(bookingData.budget);
  const [modalVisible, setModalVisible] = useState(false);

  // Compute an "estimatedPrice" to display to user
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  useEffect(() => {
    if (bookingData.property && bookingData.cleaningType) {
      const total = calculateCleaningPrice({
        property: bookingData.property,
        cleaningType: bookingData.cleaningType,
        specialRequests: bookingData.specialRequests,
      });
      setEstimatedPrice(total);
    }
  }, [bookingData.property, bookingData.cleaningType, bookingData.specialRequests]);

  const handleNext = () => {
    // Validate
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget greater than $0.');
      return;
    }

    // Save to context
    setBudget(budget);

    console.log('User Budget:', budget);
    console.log('Estimated Price:', estimatedPrice);

    // Navigate
    router.push('/paymentMethodScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter your budget</Text>

      <Text style={styles.subHeader}>
        Don’t worry, you can always negotiate the final price later.
      </Text>

      {/* 蓝色提示框 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>How to set the budget?</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: '#4E89CE' }}>Set budget suggestions</Text>
        </TouchableOpacity>
      </View>

      {/* 弹窗显示拍照说明 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Set Budget Suggestions
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 16 }}>
              Here is a pricing model based on your express, regular, and deep cleaning structure:
              {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}>Pricing Model:</Text>
              {'\n'}• Express Cleaning: Starts at $40, plus $20 per extra room
              {'\n'}• Regular Cleaning: 2× Express Cleaning
              {'\n'}• Deep Cleaning: 3× Express Cleaning
              {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}>Formula:</Text>
              {'\n'}• Express Price = $40 + ($20 × extra rooms)
              {'\n'}• Regular Price = 2 × Express Price
              {'\n'}• Deep Price = 3 × Express Price
              {'\n\n'}
              <Text style={{ fontWeight: 'bold' }}>Sample Pricing Table:</Text>
              {'\n'}- 1 Room: Express $40, Regular $80, Deep $120
              {'\n'}- 2 Rooms: Express $60, Regular $120, Deep $180
              {'\n'}- 3 Rooms: Express $80, Regular $160, Deep $240
              {'\n'}- 4 Rooms: Express $100, Regular $200, Deep $300
              {'\n'}- etc.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recommended price */}
      {estimatedPrice > 0 && (
        <Text style={{ marginBottom: 8 }}>
          Our recommended price for your cleaning is approximately:
          <Text style={{ fontWeight: 'bold' }}> ${estimatedPrice}</Text>
        </Text>
      )}

      {/* Budget input */}
      <TextInput
        placeholder="$0"
        value={budget}
        onChangeText={setBudgetLocal}
        keyboardType="numeric"
        style={styles.budgetInput}
      />

      {/* Next button */}
      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#4E89CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: '#4E89CE',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
});



