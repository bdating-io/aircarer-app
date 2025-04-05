import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const checkPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'You need to grant permission to access the camera roll.',
        [{ text: 'OK' }],
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });
    return result;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      base64: true,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      aspect: [4, 3],
      allowsEditing: false,
      quality: 1,
    });
    return result;
  };
  return {
    checkPermissions,
    takePhoto,
    pickImage,
  };
};
