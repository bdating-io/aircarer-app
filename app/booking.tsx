import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function Booking() {
  const [taskDescription, setTaskDescription] = useState('');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [isMessy, setIsMessy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const renderStars = (rating, setRating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
          <FontAwesome
            name={index < rating ? 'star' : 'star-o'}
            size={24}
            color={index < rating ? 'gold' : 'gray'}
          />
        </TouchableOpacity>
      ));
  };

  const handleNext = () => {
    Alert.alert(
      'Task Completed',
      `Cleanliness: ${cleanlinessRating} stars\nService: ${serviceRating} stars\nFeedback: ${
        feedback || 'None'
      }`
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      {/* Header */}
      <Text className="text-blue-700 text-2xl font-bold mb-4">Task Detail</Text>

      {/* Task Description */}
      <Text className="text-black text-lg font-bold mb-2">Living Room</Text>
      <Text className="text-gray-600 text-base mb-4">
        Brief description of task
      </Text>

      {/* Photo Placeholder */}
      <TouchableOpacity className="w-full h-40 bg-gray-300 rounded-lg justify-center items-center mb-4">
        <Text className="text-gray-600 text-lg">Photo1</Text>
      </TouchableOpacity>

      {/* Task Notes */}
      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-lg bg-white mb-6 h-20"
        placeholder="Enter additional task details here..."
        multiline
        textAlignVertical="top"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />

      {/* Before Cleaning */}
      <Text className="text-black text-lg font-bold mb-2">Before Cleaning</Text>
      <TouchableOpacity
        className="w-full h-40 bg-gray-300 rounded-lg justify-center items-center mb-4"
        onPress={() => pickImage(setBeforeImage)}
      >
        {beforeImage ? (
          <Image
            source={{ uri: beforeImage }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-gray-600 text-lg">+</Text>
        )}
      </TouchableOpacity>

      {/* After Cleaning */}
      <Text className="text-black text-lg font-bold mb-2">After Cleaning</Text>
      <TouchableOpacity
        className="w-full h-40 bg-gray-300 rounded-lg justify-center items-center mb-4"
        onPress={() => pickImage(setAfterImage)}
      >
        {afterImage ? (
          <Image
            source={{ uri: afterImage }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-gray-600 text-lg">+</Text>
        )}
      </TouchableOpacity>

      {/* Messy Switch */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-black text-lg">More Messy than expected?</Text>
        <Switch
          value={isMessy}
          onValueChange={(value) => setIsMessy(value)}
          trackColor={{ false: '#ccc', true: '#7C3AED' }}
          thumbColor={isMessy ? '#7C3AED' : '#f4f3f4'}
        />
      </View>

      {isMessy && (
        <View className="bg-white p-4 rounded-lg mb-4 border border-gray-300">
          <Text className="text-black text-lg font-bold mb-2">Leave Feedback</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-lg bg-gray-100"
            placeholder="Describe the issue..."
            multiline
            textAlignVertical="top"
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
      )}

      {/* Rating Section */}
      <View className="bg-white p-4 rounded-lg border border-gray-300">
        <Text className="text-black text-lg font-bold mb-2">Rate Cleanliness</Text>
        <View className="flex-row mb-4">{renderStars(cleanlinessRating, setCleanlinessRating)}</View>

        <Text className="text-black text-lg font-bold mb-2">Rate Service</Text>
        <View className="flex-row">{renderStars(serviceRating, setServiceRating)}</View>
      </View>

      {/* Next Button */}      
            <TouchableOpacity
                  className="bg-blue-600 p-4 rounded-lg mt-6"
              onPress={() => navigation.navigate('instruction')}
            >
              <Text className="text-white text-lg">Next</Text>
            </TouchableOpacity>
    </View>


      
  );
}
