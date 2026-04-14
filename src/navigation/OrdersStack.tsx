import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { OrdersStackParamList } from "../types/navigation";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "tomato",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "Orders",
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{
          title: "Order Details",
        }}
      />
    </Stack.Navigator>
  );
}
