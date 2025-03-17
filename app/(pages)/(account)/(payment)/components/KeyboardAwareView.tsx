import React from 'react';
import { Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';

function KeyboardAwareView({ children }: { children: React.ReactNode }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView bounces={false}>{children}</ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default KeyboardAwareView;
