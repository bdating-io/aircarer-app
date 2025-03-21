import React from 'react';
import { StripeProvider as StripeSDKProvider } from '@stripe/stripe-react-native';

// 定义组件Props类型
interface Props {
  children: React.ReactElement | React.ReactElement[];
}

// StripeProvider组件包装了Stripe SDK，提供支付功能
function StripeProvider({ children }: Props) {
  return (
    <StripeSDKProvider
      publishableKey={process.env.STRIPE_PUBLISHABLE_KEY || ''}
    >
      {children}
    </StripeSDKProvider>
  );
}

export default StripeProvider;
