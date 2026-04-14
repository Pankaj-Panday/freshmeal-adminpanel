import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  message?: string;
  actionBtnText?: string;
  onCreate: () => void;
};

export function EmptyState({ message, actionBtnText, onCreate }: Props) {
  return (
    <View className="flex-1 justify-center items-center">
      <Ionicons name="layers" size={48} color={"#9CA3AF"} />

      <Text className="text-gray-800 text-lg mt-4 font-semibold">
        {message || "Nothing here"}
      </Text>

      <TouchableOpacity
        onPress={onCreate}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-md"
      >
        <Text className="text-white font-semibold">{actionBtnText}</Text>
      </TouchableOpacity>
    </View>
  );
}
