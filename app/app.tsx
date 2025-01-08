import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import MarkArrive from "./MarkArrive";
import PriceAdjust from "./PriceAdjust";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: "Home Page" }} 
        />
        {/* Mark Arrive Screen */}
        <Stack.Screen 
          name="MarkArrive" 
          component={MarkArrive} 
          options={{ title: "Mark Arrival" }} 
        />
        {/* Price Adjust Screen */}
        <Stack.Screen 
          name="PriceAdjust" 
          component={PriceAdjust} 
          options={{ title: "Price Adjustment" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;