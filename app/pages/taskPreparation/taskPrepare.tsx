import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import ConfirmationForm from "@/components/confirmationForm";

const TaskPrepare = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [taskStartTime, setTaskStartTime] = useState(
    new Date("2025-01-10T10:00:00")
  );
  const [timeRemaining, setTimeRemaining] = useState({
    // 计算时间差
    newDate: taskStartTime.getTime() - new Date().getTime(),
  });
  const [status, setStatus] = useState("pending"); // 'pending', 'success', 'failed'

  const handleCheckIn = async () => {
    try {
      // Request location permission
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus("failed");
        Alert.alert("Permission denied");
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Add logic here to check if location is within 10km range
      // const isWithinRange = checkLocationRange(currentLocation, taskLocation);
      setStatus("success");

      console.log(currentLocation);
    } catch (error) {
      setStatus("failed");
      Alert.alert("Check-in Failed, Please Try Again");
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Main Container */}
      <View className="flex-1 justify-center px-4">
        <View className="max-w-md mx-auto w-full space-y-4">
          {/* 24 Hour Reminder */}
          {timeRemaining.newDate > 24 * 60 * 60 * 1000 && (
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-blue-600 font-bold">24h</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-bold text-xl">
                    Preparation Reminder
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    Check your supplies
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 mb-3">
                <Text className="text-gray-700 font-semibold mb-3">
                  Required Tools:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {["Vacuum", "Mop", "Bucket", "Cloths", "Detergent"].map(
                    (tool) => (
                      <View
                        key={tool}
                        className="flex-row items-center bg-white px-3 py-2 rounded-full border border-gray-200"
                      >
                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                        <Text className="text-gray-600">{tool}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          )}

          {/* GPS Check-in */}
          {timeRemaining.newDate > 4 * 60 * 60 * 1000 &&
            timeRemaining.newDate < 24 * 60 * 60 * 1000 && (
              <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-green-600 font-bold">GPS</Text>
                  </View>
                  <View>
                    <Text className="text-gray-900 font-bold text-xl">
                      Location Check-in
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                      <Text className="text-gray-500">
                        {Math.round(timeRemaining.newDate / (60 * 60 * 1000))}h
                        remaining
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                  <Text className="text-gray-600">
                    Please check in your location to confirm you're in the
                    service area
                  </Text>
                </View>

                {status !== "success" && (
                  <TouchableOpacity
                    onPress={handleCheckIn}
                    className="bg-green-500 p-4 rounded-xl active:bg-green-600"
                  >
                    <Text className="text-white text-center font-semibold text-base">
                      Check-in Now
                    </Text>
                  </TouchableOpacity>
                )}

                {status === "success" && (
                  <View className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                        <Text className="text-green-600 font-bold">✓</Text>
                      </View>
                      <View>
                        <Text className="text-green-700 font-semibold">
                          Check-in Successful
                        </Text>
                        <Text className="text-green-600 text-sm mt-0.5">
                          You're ready for the task
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {status === "failed" && (
                  <View className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3">
                        <Text className="text-red-600 font-bold">!</Text>
                      </View>
                      <View>
                        <Text className="text-red-700 font-semibold">
                          Check-in Failed
                        </Text>
                        <Text className="text-red-600 text-sm mt-0.5">
                          Please try again
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}

          {/* 2 Hour Reminder */}
          {status === "success" && (
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-purple-600 font-bold">2h</Text>
                </View>
                <View>
                  {timeRemaining.newDate < 2 * 60 * 60 * 1000 && (
                    <Text className="text-gray-900 font-bold text-xl">
                      Final Reminder
                    </Text>
                  )}
                  <Text className="text-gray-500 mt-1">
                    Arrival confirmation
                  </Text>
                </View>
              </View>

              <View className="bg-purple-50 rounded-xl p-4">
                <View className="flex-row items-center">
                  <View className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                  <Text className="text-purple-700 font-medium">
                    Customer Notification
                  </Text>
                </View>

                <ConfirmationForm />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TaskPrepare;
