import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CategoriesStack from "./CategoriesStack";
import UsersScreen from "../screens/UsersScreen";
import OrdersStack from "./OrdersStack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "CategoriesTab") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Users") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "OrdersTab") {
            iconName = focused ? "cart" : "cart-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStack}
        options={{
          title: "Categories",
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: "Users",
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          title: "Orders",
        }}
      />
    </Tab.Navigator>
  );
}
