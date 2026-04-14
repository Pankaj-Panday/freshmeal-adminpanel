import { FlatList, Text, View } from "react-native";
import React from "react";
import { fetchUsers } from "../api/users";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { FetchUsersApiResponse } from "../types/apiResponse";
import UserCard from "../components/users-screen/UserCard";

export default function UsersScreen() {
  const { data, isLoading, error } = useQuery<FetchUsersApiResponse>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const users = data?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-indigo-600 p-5 border-indigo-700 border-b">
        <Text className="text-2xl font-bold text-white text-center">Users</Text>
        <Text className="text-sm text-indigo-100 mt-1 text-center">
          Manage Application Users
        </Text>
      </View>

      {isLoading ? (
        <View>
          <Text>Loading Users...</Text>
        </View>
      ) : users.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 mt-4 text-center">
            No Users Found
          </Text>
          <Text className="text-gray-400 mt-1 text-sm text-center">
            Try adding users from admin panel
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => <UserCard user={item} />}
        />
      )}
    </SafeAreaView>
  );
}
