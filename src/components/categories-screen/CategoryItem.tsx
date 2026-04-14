import { Image, Text, TouchableOpacity, View } from "react-native";
import ItemActions from "../shared/ItemActions";
import { Category } from "../../types/category";

type Props = {
  category: Category;
  onDelete: (id: string, name: string, count: number) => void;
  onPress: () => void;
  onEdit: (category: Category) => void;
};

export function CategoryItem({ category, onDelete, onPress, onEdit }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mx-3 my-2 flex-row items-center shadow"
    >
      <Image
        source={{
          uri:
            category.imageUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              category.name,
            )}&background=E6F0FF&color=1F2937`,
        }}
        className="w-14 h-14 rounded-lg mr-4 bg-gray-100"
      />

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {category.name}
        </Text>

        <Text className="text-xs text-gray-500 mt-1">
          {category.products?.length || 0} products
        </Text>
      </View>

      <ItemActions
        onEdit={() => onEdit(category)}
        onDelete={() =>
          onDelete(category.id, category.name, category.products?.length || 0)
        }
      />
    </TouchableOpacity>
  );
}
