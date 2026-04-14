import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Error({ error }: { error: Error }) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500">Error: {error.message}</Text>
    </View>
  );
}
