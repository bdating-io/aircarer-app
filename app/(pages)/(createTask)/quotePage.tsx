import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { createQuote, getDollarAmount, Quote } from '@/constants/quoteGenerator';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { supabaseDBClient } from '@/clients/supabase/database';

export default function BudgetPage() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  // from tasks table
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [cleaningType, setCleaningType] = useState<
    'Quick Cleaning' | 'Regular Cleaning' | 'Deep Cleaning' | null
  >(null);

  // from properties table
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [livingrooms, setLivingrooms] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<string>('House');

  // Calculated price
  const [quote, setQuote] = useState<Quote | null>(null);

  // loading
  const [isLoading, setIsLoading] = useState(true);
  const [isCeatingQuote, setIsCreatingQuote] = useState(true);
let counter =0;
  useEffect(() => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided.');
      return;
    }
    fetchTaskAndProperty(taskId);
  }, [taskId]);

  const fetchTaskAndProperty = async (id: string) => {
    try {
      // 1) get property_id, task_type from tasks
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('property_id, cleaning_type')
        .eq('task_id', id)
        .single();
      if (taskError) throw taskError;
      if (!taskData?.property_id) {
        throw new Error('No property_id found in tasks table.');
      }

      setPropertyId(taskData.property_id);
      setCleaningType(taskData.cleaning_type || null);

      // 2) get bedrooms, bathrooms from properties
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('bedrooms, bathrooms, living_rooms, property_type')
        .eq('property_id', taskData.property_id)
        .single();
      if (propError) throw propError;

      setBedrooms(propData?.bedrooms || 0);
      setBathrooms(propData?.bathrooms || 0);
      setLivingrooms(propData?.living_rooms || 0);
      setPropertyType(propData?.property_type || 'House');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to fetch data');
    } finally {
     setIsLoading(false);
    }
  };

  //  compute estimatedPrice
  useEffect(() => {
    if (isLoading) return;
    // const basePrice = 40 + 20 * (bedrooms + bathrooms);
    // let multiplier = 1;
    // if (taskType === 'Regular Cleaning') multiplier = 2;
    // if (taskType === 'Deep Cleaning') multiplier = 3;
    // const result = basePrice * multiplier;
    setIsCreatingQuote(true);
    const newQuote = createQuote(
      bedrooms,
      bathrooms,
      livingrooms,
      cleaningType || "End-of-Lease/Sale",
      propertyType
    )
    newQuote.task_id = taskId || '';
    setQuote(newQuote);
    supabaseDBClient.saveNewQuote(newQuote);
    setIsCreatingQuote(false);
  }, [bedrooms, bathrooms, cleaningType, isLoading]);

  const handleNext = async () => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided.');
      return;
    }
    /*
    Job status:
    New: waiting for owner to complete details and pay
    Pending: details completed, payment may not be done
    */
    try {
      // update tasks table
      const { error } = await supabase
        .from('tasks')
        .update({
          estimated_price: quote?.grand_total || 0,
          budget: quote?.grand_total || 0,
          payment_status: 'Not Paid',
          approval_status: 'Pending',
          status: 'Pending',
          is_confirmed: false,
        })
        .eq('task_id', taskId);

      if (error) throw error;
      console.debug('task updated successfully');
      router.push(`/(pages)/(createTask)/paymentMethodScreen?taskId=${taskId}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (isLoading || isCeatingQuote) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }
  const basePackageLineItem = quote && quote.line_items.filter(room => room.category === 'basePackage')[0];
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Cleaning Fee Quote</Text>
        <Text style={styles.priceItemText}>{propertyType}</Text>
        {/* show estimated price */}
        {quote && quote.line_items.length > 0 && (
          <View> 
            <View style={{ marginBottom: 16 }}>
              {basePackageLineItem && (<><View style={styles.priceItemView}>
                <Text style={styles.priceItemText}>{basePackageLineItem.label}</Text>
                <Text style={styles.priceItemText}>
                { getDollarAmount(basePackageLineItem.lineTotal).split('.')[0]}
                    <Text style={{ fontSize: 10 }}>
                      .{getDollarAmount(basePackageLineItem.lineTotal).split('.')[1]}
                    </Text>
                </Text>
              </View>
              <View style={{width: '70%', marginTop: -6, marginLeft: 16}}>
                <Text style={{color: '#555'}}>{basePackageLineItem.description}</Text>
                <Text></Text>
              </View></>
            )}
                {
                quote && quote.line_items.length > 1 
                && quote.line_items.filter(lineItem => lineItem.category !== 'basePackage').map((lineItem, index) => (
                <View
                key={index}
                style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 6,
                }}
                >
                <Text style={styles.priceItemText}>{lineItem.label} x {lineItem.quantity}</Text>
                <Text style={styles.priceItemText}>
                  { getDollarAmount(lineItem.lineTotal).split('.')[0]}
                    <Text style={{ fontSize: 10 }}>
                      .{getDollarAmount(lineItem.lineTotal).split('.')[1]}
                    </Text>
                </Text>
                </View>
                ))}
              {/*** subtotal */}
              <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 16,
                marginBottom: 6,
                borderTopWidth: 1,
                borderTopColor: '#ccc',
                paddingTop: 20,
              }}
              >
                <Text style={[styles.priceItemText ]}>
                    Subtotal:</Text>
                <Text style={[styles.priceItemText ]}>
                <Text style={[styles.priceItemText]}>
                  {getDollarAmount(quote.sub_total).split('.')[0]}
                  <Text style={{ fontSize: 10 }}>
                    .{getDollarAmount(quote.sub_total).split('.')[1]}
                  </Text>
                </Text>
                </Text>
              </View>
              {/*** Tax    */}
              <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between', 
              }}
              >
                <Text style={[styles.priceItemText ]}>
                    GST:</Text>
                <Text style={[styles.priceItemText ]}>
                  <Text style={[styles.priceItemText]}>
                    {getDollarAmount(quote.total_tax).split('.')[0]}
                    <Text style={{ fontSize: 10 }}>
                      .{getDollarAmount(quote.total_tax).split('.')[1]}
                    </Text>
                  </Text>
                </Text>
              </View>
              {/** 
               * Total amount 
              */}
              <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 16,
                marginBottom: 0, 
              }}
              >
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                    Total:</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                  AUD {getDollarAmount(quote.grand_total).split('.')[0]}
                    <Text style={{ fontSize: 10 }}>
                      .{getDollarAmount(quote.grand_total).split('.')[1]}
                    </Text>
                </Text>
              </View>
            </View>
            {/**  
             * Info box for disclaimer and further info
            */}
            <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}><AntDesign
                  name="exclamationcircle"
                  size={16}
                  color="orange"
                /> Note:</Text>
                <Text>
                  The quoted price only includes basic cleaning services. 
                  Additional charges may apply for extra services or special requests.
                </Text>
              </View>
           {/* Agree and Pay button */}
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Agree & Pay</Text>
          </TouchableOpacity>
          </View>
        )}
        {!quote && (
          <Text>
            We can't provide quote for your cleaning job yet. Please check your property details.
          </Text>
        )}
       
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  priceItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceItemText: {
    fontSize: 16
  },
});
