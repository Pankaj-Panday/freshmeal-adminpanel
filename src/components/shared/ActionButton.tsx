import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type ActionButtonProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  loading?: boolean;
};

export function ActionButton({
  title,
  icon = "save",
  onPress,
  loading,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-black rounded-lg py-3 flex-row justify-center items-center mt-6 disabled:opacity-70"
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Ionicons name={icon} size={18} color="white" />
          <Text className="text-white font-semibold ml-2">{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
