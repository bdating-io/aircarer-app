import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface EntryMethodFormProps {
  entryMethod: string;
  setEntryMethod: (text: string) => void;
}

const EntryMethodForm = ({
  entryMethod,
  setEntryMethod,
}: EntryMethodFormProps) => (
  <View className="mt-6 mb-6">
    <View className="flex-row items-center mb-2">
      <Text className="text-gray-600">Entry Method</Text>
      <Text className="text-red-500 ml-2">*</Text>
      <Text className="text-gray-600 ml-2">(compulsory)</Text>
      <TouchableOpacity
        className="ml-2"
        onPress={() =>
          Alert.alert(
            'Entry Method',
            'Please provide details on how the cleaner can access your property (e.g., key in mailbox, door code, etc.)',
          )
        }
      >
        <AntDesign name="questioncircleo" size={16} color="gray" />
      </TouchableOpacity>
    </View>
    <TextInput
      className={`border 'border-gray-300'
      } rounded-lg p-3`}
      placeholder="Enter method details"
      value={entryMethod}
      onChangeText={setEntryMethod}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  </View>
);

export default EntryMethodForm;
