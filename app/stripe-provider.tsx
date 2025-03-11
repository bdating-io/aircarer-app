import React from 'react';
import { StripeProvider as StripeSDKProvider } from '@stripe/stripe-react-native';
//key
const STRIPE_PUBLISHABLE_KEY = "pk_test_51xxxxxxxxxxxxxxxxxxxxx";

// 定义组件Props类型
interface Props {
  children: React.ReactElement | React.ReactElement[];
}

// StripeProvider组件包装了Stripe SDK，提供支付功能
export function StripeProvider({ children }: Props) {
  return (
    <StripeSDKProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {children}
    </StripeSDKProvider>
  );
} 