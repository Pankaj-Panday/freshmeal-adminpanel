import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Order } from "../../types/orders";
import { cn } from "../../utils/cn";
import { currency } from "../../utils/formatter";

type Props = {
  order: Order;
  onPress: () => void;
};

export default function OrderCard({ order, onPress }: Props) {
  const statusStyles = (status: string) => {
    const s = (status || "").toLowerCase();

    if (s === "delivered")
      return "bg-emerald-100 border-emerald-200 text-emerald-700";

    if (s === "shipped")
      return "bg-indigo-100 border-indigo-200 text-indigo-700";

    if (s === "processing")
      return "bg-yellow-100 border-yellow-200 text-yellow-700";

    if (s === "cancelled" || s === "refunded")
      return "bg-rose-100 border-rose-200 text-rose-700";

    return "bg-green-100 border-gray-200 text-gray-700";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white mx-4 p-4 my-2 rounded-2xl border border-gray-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-gray-800">
            Order #{order.id.slice(0, 8)}
          </Text>
          <Text>
            {order.user?.name ?? order.user?.email ?? "Unknown Customer"}
          </Text>
        </View>

        <View className="items-end">
          <View
            className={cn(
              "px-3 py-1 rounded-full border",
              statusStyles(order.status),
            )}
          >
            <Text className="text-xs font-medium">{order.status}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-gray-600 text-sm">Total</Text>
        <Text className="text-sm font-semibold text-gray-800">
          {currency(order.totalAmount)}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleString()}
        </Text>

        <Text className="text-xs text-gray-400">View details →</Text>
      </View>
    </TouchableOpacity>
  );
}
