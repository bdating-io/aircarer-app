import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { ProfileData } from '@/types/type';
import { useProfileViewModel } from '@/viewModels/profileViewModel';

export default function CreateProfile() {
  const router = useRouter();
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    abn,
    abnValid,
    validatingAbn,
    selectedRole,
    setSelectedRole,
    isBackgroundChecked,
    setIsBackgroundChecked,
    backgroundCheckImage,
    setBackgroundCheckImage,
    uploadingImage,
    pickBackgroundCheckImage,
    handleAbnChange,
    validateAndSubmitProfile,
  } = useProfileViewModel();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Create your profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* First Name */}
        <Text className="text-gray-600 mb-2">First Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <Text className="text-gray-600 mb-2">Last Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* ABN Field */}
        <Text className="text-gray-600 mb-2">
          ABN (Australian Business Number)
        </Text>
        <View className="mb-4">
          <TextInput
            className={`border rounded-lg p-3 ${
              abnValid === true
                ? 'border-green-500'
                : abnValid === false
                  ? 'border-red-500'
                  : 'border-gray-300'
            }`}
            placeholder="e.g. 51 824 753 556"
            value={abn}
            onChangeText={handleAbnChange}
            keyboardType="numeric"
          />

          {/* ABN验证状态指示器 */}
          {abn.length > 0 && (
            <View className="flex-row items-center mt-1">
              {validatingAbn ? (
                <ActivityIndicator
                  size="small"
                  color="#4A90E2"
                  style={{ marginRight: 6 }}
                />
              ) : abnValid === true ? (
                <AntDesign
                  name="checkcircle"
                  size={16}
                  color="green"
                  style={{ marginRight: 6 }}
                />
              ) : abnValid === false ? (
                <AntDesign
                  name="exclamationcircle"
                  size={16}
                  color="red"
                  style={{ marginRight: 6 }}
                />
              ) : null}

              <Text
                className={`text-sm ${
                  abnValid === true
                    ? 'text-green-600'
                    : abnValid === false
                      ? 'text-red-600'
                      : 'text-gray-500'
                }`}
              >
                {validatingAbn
                  ? 'Validating ABN...'
                  : abnValid === true
                    ? 'Valid ABN'
                    : abnValid === false
                      ? 'Invalid ABN format'
                      : 'Enter your 11-digit ABN'}
              </Text>
            </View>
          )}
        </View>

        {/* Role Selection Grid */}
        <Text className="text-gray-600 mb-4">
          What is your main role on AirCarer?
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {[
            // { id: 'Laundry Partner', icon: '🧺', color: 'bg-blue-100' },
            // { id: 'Supervisor', icon: '👥', color: 'bg-green-100' },
            { id: 'Cleaner', icon: '🧹', color: 'bg-yellow-100' },
            { id: 'House Owner', icon: '🏠', color: 'bg-purple-100' },
          ].map((role) => (
            <TouchableOpacity
              key={role.id}
              className={`w-[48%] p-4 rounded-lg mb-4 ${role.color} ${
                selectedRole === role.id ? 'border-2 border-blue-500' : ''
              }`}
              onPress={() => setSelectedRole(role.id as ProfileData['role'])}
            >
              <Text className="text-center text-2xl mb-2">{role.icon}</Text>
              <Text className="text-center">{role.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Background Check Upload - 仅当角色为"Cleaner"时显示 */}
        {selectedRole === 'Cleaner' && (
          <>
            <Text className="text-gray-600 mb-2">Background Check</Text>
            <Text className="text-xs text-gray-500 mb-3">
              As a cleaner, you need to upload a valid background check
              document. This helps ensure safety and trust for our customers.
            </Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 mb-2 flex-row items-center justify-between"
              onPress={pickBackgroundCheckImage}
              disabled={uploadingImage}
            >
              <Text className="text-gray-500">
                {uploadingImage
                  ? 'Uploading...'
                  : 'Upload background check document'}
              </Text>
              {uploadingImage ? (
                <ActivityIndicator color="#4A90E2" size="small" />
              ) : (
                <AntDesign name="upload" size={20} color="gray" />
              )}
            </TouchableOpacity>

            {/* 显示已上传的图片预览 */}
            {backgroundCheckImage && (
              <View className="mb-6">
                <Image
                  source={{ uri: backgroundCheckImage }}
                  className="h-40 rounded-lg w-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                  onPress={() => {
                    setBackgroundCheckImage(null);
                    setIsBackgroundChecked(false);
                  }}
                >
                  <AntDesign name="close" size={16} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Next Button */}
      <View className="px-4 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-full py-3 items-center ${
            firstName &&
            lastName &&
            selectedRole &&
            ((selectedRole === 'Cleaner' && abn.length > 0 && abnValid) ||
              (selectedRole === 'House Owner' && abn.length == 0) ||
              (abn && abnValid))
              ? 'bg-[#4A90E2]'
              : 'bg-gray-200'
          }`}
          onPress={validateAndSubmitProfile}
          disabled={
            !firstName ||
            !lastName ||
            !selectedRole ||
            (selectedRole === 'Cleaner' &&
              (abn.length == 0 || abnValid !== true)) ||
            (abn.length > 0 && abnValid !== true) ||
            (selectedRole === 'Cleaner' && !isBackgroundChecked)
          }
        >
          <Text
            className={`font-medium ${
              firstName && lastName && selectedRole
                ? /* && abn && (selectedRole !== 'Cleaner' || (selectedRole === 'Cleaner' && isBackgroundChecked)) && abnValid === true*/
                  'text-white'
                : 'text-gray-500'
            }`}
          >
            {validatingAbn ? 'Validating...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
