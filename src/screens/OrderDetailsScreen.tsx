import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OrdersStackParamList } from "../types/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderById } from "../api/orders";
import { FetchOrderByIdApiResponse } from "../types/apiResponse";
import { SafeAreaView } from "react-native-safe-area-context";
import { currency } from "../utils/formatter";

type Props = NativeStackScreenProps<OrdersStackParamList, "OrderDetails">;

export default function OrderDetailsScreen({ route }: Props) {
  const { orderId } = route.params;

  const { data, isLoading, error } = useQuery<FetchOrderByIdApiResponse>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  const order = data?.data;

  if (isLoading || !order) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View className="bg-white p-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-800">
          Order #{order.id.slice(0, 8)}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>

      <View className="p-4">
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 ">
          <Text className="text-sm text-gray-500">Total</Text>
          <Text className="text-lg font-semibold text-gray-800 mt-1">
            {currency(order.totalAmount)}
          </Text>

          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-sm text-gray-500">Status</Text>
            <Text className="text-sm font-medium text-gray-700">
              {order.status}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-sm text-gray-500">User</Text>
            <Text className="text-sm font-medium text-gray-700">
              {order.user?.name || order.user?.email || "Unknown Customer"}
            </Text>
          </View>

          <View className="mt-3">
            <Text className="text-sm text-gray-500 mb-1">Address</Text>

            {typeof order.address === "string" ? (
              <Text className="text-sm font-medium text-gray-700">
                {order.address}
              </Text>
            ) : (
              <View className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <Text className="text-sm font-semibold text-gray-800">
                  {order.address.name} ({order.address.type})
                </Text>

                <Text className="text-sm text-gray-600 mt-1">
                  {order.address.mobile}
                </Text>

                <Text className="text-sm text-gray-600 mt-2">
                  {order.address.flatNo}, {order.address.buildingName}
                </Text>

                <Text className="text-sm text-gray-600">
                  {order.address.street}
                </Text>

                <Text className="text-sm text-gray-600">
                  {order.address.locality}
                  {order.address.landmark ? `, ${order.address.landmark}` : ""}
                </Text>

                <Text className="text-sm text-gray-600">
                  PIN: {order.address.pincode}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text className="text-base font-semibold text-gray-700 mb-2">
          Items
        </Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.productId}
          className="mb-4"
          renderItem={({ item }) => {
            const subtotal = item.price * item.quantity;

            return (
              <View className="bg-white rounded-xl p-4 border border-gray-100 mb-3 shadow-sm">
                {/* Product Name */}
                <Text className="text-base font-semibold text-gray-800">
                  {item.name || `Product #${item.productId.slice(0, 8)}`}
                </Text>

                {/* Quantity & Price Row */}
                <View className="flex-row justify-between mt-2">
                  <Text className="text-sm text-gray-500">
                    Qty:{" "}
                    <Text className="text-gray-700 font-medium">
                      {item.quantity}
                    </Text>
                  </Text>

                  <Text className="text-sm text-gray-500">
                    Price:{" "}
                    <Text className="text-gray-700 font-medium">
                      {currency(item.price)}
                    </Text>
                  </Text>
                </View>

                {/* Subtotal */}
                <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-sm text-gray-500">Subtotal</Text>
                  <Text className="text-sm font-semibold text-gray-800">
                    {currency(subtotal)}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2"
        >
          {["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "PAID"].map(
            (status) => (
              <TouchableOpacity
                key={status}
                className={`px-3 py-2 rounded-lg items-center border ${
                  status === order.status
                    ? "bg-indigo-600 border-transparent"
                    : "bg-white border-gray-200"
                }`}
                activeOpacity={0.85}
              >
                <Text
                  className={`${
                    status === order.status ? "text-white" : "text-gray-700"
                  } text-sm font-medium`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
