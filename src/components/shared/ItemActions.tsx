import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../utils/cn";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  containerClassName?: string;
};

export default function ItemActions({
  onEdit,
  onDelete,
  containerClassName,
}: Props) {
  return (
    <View className={"flex-row items-center gap-4"}>
      <TouchableOpacity onPress={onEdit} className="p-2 rounded-md bg-blue-50">
        <Ionicons name="pencil" size={18} color="#2563eb" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} className="p-2 rounded-md bg-red-50">
        <Ionicons name="trash" size={18} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
}
