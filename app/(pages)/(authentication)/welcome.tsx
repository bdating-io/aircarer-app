import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@ant-design/react-native';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <View style={styles.iconContainer}>
      <AntDesign name={icon} size={20} color="#4A90E2" />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

export default function WelcomePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4A90E2', '#5A6BFF']}
        style={styles.background}
      />

      <View style={styles.logoContainer}>
        <Image style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>AirCarer</Text>
        <Text style={styles.tagline}>
          Connecting homes with professional cleaners
        </Text>
      </View>

      <View style={styles.featureContainer}>
        <FeatureItem
          icon="checkcircleo"
          title="Easy Booking"
          description="Schedule cleaning services with just a few taps"
        />
        <FeatureItem
          icon="safetycertificate"
          title="Trusted Cleaners"
          description="All cleaners are vetted and background-checked"
        />
        <FeatureItem
          icon="lock"
          title="Secure Payments"
          description="Pay securely through the app"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          type="primary"
          style={styles.loginButton}
          onPress={() => router.push('/(pages)/(authentication)/login')}
        >
          Log In
        </Button>

        <Button
          style={styles.signupButton}
          onPress={() => router.push('/(pages)/(authentication)/signup')}
        >
          Create Account
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.5,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  featureContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  loginButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  signupButton: {
    borderRadius: 12,
    borderColor: '#4A90E2',
  },
});
