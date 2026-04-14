import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Loader() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
