import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const UsedLinenRecycledScreen = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecycled, setIsRecycled] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Camera Permission Required', 'Please allow camera and photo library access in settings');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!photo) {
      Alert.alert('Notice', 'Please upload a photo first');
      return;
    }
    
    setIsRecycled(true);
    Alert.alert('Success', 'Linen successfully marked as recycled');
    // TODO: Add API call
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center text-gray-800">
        Linen Recycling Management
      </Text>

      <View className="h-[300px] bg-gray-100 rounded-xl mb-8 overflow-hidden">
        {photo ? (
          <Image 
            source={{ uri: photo }} 
            className="w-full h-full"
          />
        ) : (
          <TouchableOpacity 
            className="flex-1 justify-center items-center border-2 border-dashed border-gray-300 rounded-xl"
            onPress={handleTakePhoto}
          >
            <MaterialIcons name="add-a-photo" size={40} color="#666" />
            <Text className="mt-2 text-gray-600 text-base">
              Upload Recycling Bag Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {photo && (
        <TouchableOpacity
          className={`
            p-4 rounded-lg items-center
            ${isRecycled ? 'bg-blue-300' : 'bg-blue-500'}
          `}
          onPress={handleSubmit}
          disabled={isRecycled}
        >
          <Text className="text-white text-lg font-bold">
            {isRecycled ? 'Recycling Complete' : 'Mark as Recycled'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Instructions */}
      <View className="mt-6 p-4 bg-gray-50 rounded-lg">
        <Text className="text-gray-600 text-sm mb-2">Instructions:</Text>
        <Text className="text-gray-500 text-sm">1. Place used linens in washing bag</Text>
        <Text className="text-gray-500 text-sm">2. Take photo of bag location</Text>
        <Text className="text-gray-500 text-sm">3. Click "Mark as Recycled" to complete</Text>
      </View>
    </View>
  );
};

export default UsedLinenRecycledScreen;
