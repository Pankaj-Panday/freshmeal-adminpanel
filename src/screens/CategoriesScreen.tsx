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
import { deleteCategory, fetchCategories } from "../api/categories";
import { EmptyState } from "../components/categories-screen/EmptyState";
import { CategoryItem } from "../components/categories-screen/CategoryItem";
import Loader from "../components/shared/Loader";
import Error from "../components/shared/Error";
import { Category } from "../types/category";

type Props = NativeStackScreenProps<CategoriesStackParamList, "Categories">;

export default function CategoriesScreen({ navigation }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const categories = data?.data;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      Alert.alert("Error", `Failed to delete category ${error.message}`);
    },
  });

  const handleDeleteCategory = (
    id: string,
    name: string,
    productCount: number,
  ) => {
    const message =
      productCount > 0
        ? `Are you sure you want to delete ${name} category? This will also delete all ${productCount} products in this category.`
        : `Are you sure you want to delete ${name} category?`;

    Alert.alert("Delete Category", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const handleEditCategory = (category: Category) => {
    navigation.navigate("EditCategory", { categoryId: category.id });
  };

  return (
    <View className="bg-gray-50 flex-1 ">
      <View className="flex-row justify-between items-center px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">Categories</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddCategory")}
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
          data={categories}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              message="No categories yet"
              actionBtnText="Add Category"
              onCreate={() => navigation.navigate("AddCategory")}
            />
          }
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              onPress={() =>
                navigation.navigate("Products", {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          )}
        />
      )}
    </View>
  );
}
