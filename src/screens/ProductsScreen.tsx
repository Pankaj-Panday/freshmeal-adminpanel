import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CategoriesStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductsByCategory } from "../api/categories";
import Loader from "../components/shared/Loader";
import Error from "../components/shared/Error";
import ProductItem from "../components/products-screen/ProductItem";
import { deleteProduct } from "../api/products";
import { Product } from "../types/product";
import { FetchProductsApiResponse } from "../types/apiResponse";

type Props = NativeStackScreenProps<CategoriesStackParamList, "Products">;

export default function ProductsScreen({ navigation, route }: Props) {
  const { categoryId, categoryName } = route.params;

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } =
    useQuery<FetchProductsApiResponse>({
      queryKey: ["products", categoryId],
      queryFn: () => fetchProductsByCategory(categoryId),
      enabled: !!categoryId,
    });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", categoryId],
      });
    },
    onError: (error) => {
      console.log("Failed to delete product", error);
      Alert.alert("Error", `Failed to delete product ${error.message}`);
    },
  });

  const handleDeleteProduct = (productId: string, name: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete ${name} product?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(productId),
        },
      ],
    );
  };

  const handleEditProduct = (product: Product) => {
    // navigation.navigate("EditProduct", { product });
  };

  const products = data?.data;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">
          {categoryName ? `${categoryName} Products` : "Products"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct", { categoryId })}
          activeOpacity={0.6}
          className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add-circle" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="flex-1 items-center mt-10 justify-center">
              <Text className="text-gray-400 text-lg">No products found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
            />
          )}
        />
      )}
    </View>
  );
}
