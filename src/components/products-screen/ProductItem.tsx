import { Image, Text, View } from "react-native";
import React from "react";
import ItemActions from "../shared/ItemActions";
import { Product } from "../../types/product";

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string, name: string) => void;
}

export default function ProductItem({
  product,
  onEdit,
  onDelete,
}: ProductItemProps) {
  return (
    <View className="bg-white rounded-xl p-4 mx-3 my-2 flex-row items-start shadow">
      <Image
        source={{ uri: product.imageUrl }}
        className="w-20 h-20 rounded-md mr-4 bg-gray-100"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {product.name}
        </Text>
        <Text className="text-gray-600 text-sm mt-1">
          {product.price.toFixed(2)}
        </Text>
        <Text
          className="text-gray-600 text-sm mt-2"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.description ?? "No description available"}
        </Text>
      </View>

      <ItemActions
        onDelete={() => onDelete(product.id, product.name)}
        onEdit={() => onEdit(product)}
      />
    </View>
  );
}
