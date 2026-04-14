import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import { CategoriesStackParamList } from "../types/navigation";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import ProductsScreen from "../screens/ProductsScreen";
import AddProductScreen from "../screens/AddProductScreen";
import EditCategoryScreen from "../screens/EditCategoryScreen";

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStack() {
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
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categories",
        }}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={{
          title: "Add Category",
        }}
      />
      <Stack.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{
          title: "Edit Category",
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ route }) => ({
          title: `Products in ${route.params.categoryName}`,
        })}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: "Add Product",
        }}
      />
    </Stack.Navigator>
  );
}
