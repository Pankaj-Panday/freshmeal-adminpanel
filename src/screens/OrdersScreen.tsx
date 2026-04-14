import { FlatList, Text, View } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchOrdersApiResponse } from "../types/apiResponse";
import { fetchOrders } from "../api/orders";
import OrderCard from "../components/orders-screen/OrderCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OrdersStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<OrdersStackParamList, "Orders">;

export default function OrdersScreen({ navigation }: Props) {
  const { data, isLoading, error } = useQuery<FetchOrdersApiResponse>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const orders = data?.data || [];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="py-4 px-6">
        <Text className="text-2xl font-bold text-center">Orders</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">
          {isLoading ? "Loading..." : `Showing ${orders.length} orders`}
        </Text>
      </View>

      {isLoading ? (
        <View>
          <Text>Loading Orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-40 h-40 rounded-xl bg-white border border-gray-100 shadow-sm justify-center items-center">
            <Text></Text>
          </View>
          <Text className="text-lg text-gray-600 mt-6 text-center">
            No Orders Yet
          </Text>
          <Text className="text-sm text-gray-400 mt-1 text-center">
            Orders will show up here when customers place them.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 36, paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                navigation.navigate("OrderDetails", { orderId: item?.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}
