import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneLogin = () => {
    console.log("Phone login with:", phoneNumber);
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  return (
    <View>
      <View>
        <Text>Welcome Back</Text>
        <Text>Sign in to continue</Text>
      </View>

      <View>
        {/* Phone Input */}
        <View>
          <Text>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handlePhoneLogin}>
          <Text>Login with Phone</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View>
          <View />
          <Text>OR</Text>
          <View />
        </View>

        {/* Google Login */}
        <TouchableOpacity onPress={handleGoogleLogin}>
          <Text>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
