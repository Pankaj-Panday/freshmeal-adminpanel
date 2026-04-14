import { Text, View } from "react-native";
import React from "react";
import { User } from "../../types/users";

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  return (
    <View className="bg-white mx-4 my-3 rounded-2xl shadow-lg border border-gray-100 flex-row items-center p-4">
      <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
        <Text className="text-base font-semibold text-gray-700">
          {(user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : "U"
          ).toUpperCase()}
        </Text>
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-900">
          {user?.name ? user.name : "Name not provided"}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>
      </View>
    </View>
  );
}
