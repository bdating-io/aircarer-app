import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";

export default function SignUpPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handlePhoneSignUp = () => {
    console.log("Phone signup with:", { phoneNumber, name, email });
  };

  const handleGoogleSignUp = () => {
    console.log("Google signup");
  };

  return (
    <View>
      <View>
        <Text>Create Account</Text>
        <Text>Sign up to get started</Text>
      </View>

      <View>
        {/* Name Input */}
        <View>
          <Text>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
        </View>

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

        {/* Email Input */}
        <View>
          <Text>Email (Optional)</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handlePhoneSignUp}>
          <Text>Sign Up with Phone</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View>
          <View />
          <Text>OR</Text>
          <View />
        </View>

        {/* Google Sign Up */}
        <TouchableOpacity onPress={handleGoogleSignUp}>
          <Text>Continue with Google</Text>
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <View>
          <Text>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}
