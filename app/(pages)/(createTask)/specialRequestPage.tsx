import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/clients/supabase';
import { AntDesign } from '@expo/vector-icons';

export default function SpecialRequestPage() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams() as { taskId?: string };

  // Put Dishwasher cleaning in the same toggle array:
  const toggleOptions = [
    'Pet fur cleaning',
    'Carpet steaming',
    'Range hood cleaning',
    'Oven cleaning',
    'Outdoor cleaning',
    'Dishwasher cleaning',
  ];

  // Keep track of which toggles are selected
  const [selectedToggles, setSelectedToggles] = useState<string[]>([]);

  // Numeric inputs
  const [glassCleaning, setGlassCleaning] = useState(0);
  const [wallStainRemoval, setWallStainRemoval] = useState(0);

  // Custom request text
  const [customRequest, setCustomRequest] = useState('');

  const toggleOption = (option: string) => {
    if (selectedToggles.includes(option)) {
      setSelectedToggles(selectedToggles.filter((item) => item !== option));
    } else {
      setSelectedToggles([...selectedToggles, option]);
    }
  };

  const handleNext = async () => {
    if (!taskId) {
      Alert.alert('Error', 'No taskId provided in route params.');
      return;
    }

    // If no toggles selected, no numeric inputs, and no custom text, show error
    if (
      selectedToggles.length === 0 &&
      glassCleaning === 0 &&
      wallStainRemoval === 0 &&
      !customRequest.trim()
    ) {
      Alert.alert(
        'Error',
        'Please select at least one special request or enter a custom request.',
      );
      return;
    }

    // Build one JSON object with all options
    const specialRequirements = {
      toggles: {
        pet_fur_cleaning: selectedToggles.includes('Pet fur cleaning'),
        carpet_steaming: selectedToggles.includes('Carpet steaming'),
        rangehood_cleaning: selectedToggles.includes('Range hood cleaning'),
        oven_cleaning: selectedToggles.includes('Oven cleaning'),
        outdoor_cleaning: selectedToggles.includes('Outdoor cleaning'),
        dishwasher_cleaning: selectedToggles.includes('Dishwasher cleaning'), // new line
      },
      numeric: {
        glass_cleaning: glassCleaning,
        wall_stain_removal: wallStainRemoval,
      },
      custom: customRequest.trim(),
    };

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ special_requirements: specialRequirements })
        .eq('task_id', taskId);

      if (error) throw error;

      Alert.alert('Success', 'Your special requests have been saved!');
      router.push(`/(pages)/(createTask)/budgetPage?taskId=${taskId}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Special Request</Text>
        <Text style={styles.subtitle}>Do you need any of the following?</Text>

        {toggleOptions.map((option) => {
          const selected = selectedToggles.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggleOption(option)}
              style={[
                styles.requestButton,
                { backgroundColor: selected ? '#4E89CE' : '#ccc' },
              ]}
            >
              <Text style={styles.requestText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Glass Cleaning (numeric input) */}
        <View style={styles.numericContainer}>
          <View>
            <Text style={styles.optionLabel}>Glass Cleaning</Text>
            <Text style={styles.numericHint}>(charged per piece)</Text>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() =>
                setGlassCleaning(glassCleaning > 0 ? glassCleaning - 1 : 0)
              }
              style={styles.counterButton}
            >
              <AntDesign name="minus" size={16} color="#4E89CE" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{glassCleaning}</Text>
            <TouchableOpacity
              onPress={() => setGlassCleaning(glassCleaning + 1)}
              style={styles.counterButton}
            >
              <AntDesign name="plus" size={16} color="#4E89CE" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Wall Stain Removal (numeric input) */}
        <View style={styles.numericContainer}>
          <View>
            <Text style={styles.optionLabel}>Wall Stain Removal</Text>
            <Text style={styles.numericHint}>(charged per wall)</Text>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() =>
                setWallStainRemoval(
                  wallStainRemoval > 0 ? wallStainRemoval - 1 : 0,
                )
              }
              style={styles.counterButton}
            >
              <AntDesign name="minus" size={16} color="#4E89CE" />
            </TouchableOpacity>
            <Text style={styles.counterText}>{wallStainRemoval}</Text>
            <TouchableOpacity
              onPress={() => setWallStainRemoval(wallStainRemoval + 1)}
              style={styles.counterButton}
            >
              <AntDesign name="plus" size={16} color="#4E89CE" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Request */}
        <Text style={styles.customLabel}>
          Please specify any other special requirements (maximum 250 words)
        </Text>
        <TextInput
          placeholder="Enter your custom request here..."
          value={customRequest}
          onChangeText={setCustomRequest}
          multiline
          numberOfLines={4}
          maxLength={250}
          style={styles.customInput}
        />

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles remain mostly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  requestButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  requestText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  numericContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  numericHint: {
    fontSize: 12,
    color: '#666',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#ccc',
    padding: 6,
    borderRadius: 4,
  },
  counterText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  customLabel: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#4E89CE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
