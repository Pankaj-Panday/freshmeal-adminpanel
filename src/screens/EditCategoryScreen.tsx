import { Text, TextInput, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CategoriesStackParamList } from "../types/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { CategoryFormValues } from "../types/category";
import { ActionButton } from "../components/shared/ActionButton";
import { fetchCategoryById, updateCategory } from "../api/categories";
import { FetchCategoriesApiResponse } from "../types/apiResponse";

type Props = NativeStackScreenProps<CategoriesStackParamList, "EditCategory">;

export default function EditCategoryScreen({ navigation, route }: Props) {
  const { categoryId } = route.params;
  const queryClient = useQueryClient();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    initialData: () => {
      return queryClient
        .getQueryData<FetchCategoriesApiResponse>(["categories"])
        ?.data.find((c) => c.id === categoryId);
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: category.name,
      imageUrl: category.imageUrl,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      return updateCategory(categoryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });

      navigation.goBack();
    },
    onError: (error: any) => {
      console.log("API ERROR:", error.response?.data);
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (category && !isDirty) {
      reset({
        name: category.name,
        imageUrl: category.imageUrl,
      });
    }
  }, [category, isDirty]);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Edit Category
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Update the category details
      </Text>

      {/* Category */}
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Category Name
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Category name is required",
          minLength: {
            value: 2,
            message: "Too Short",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="E.g Beverages"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="bg-white border border-gray-200 rounded-lg p-3"
          />
        )}
      />
      {errors?.name && (
        <Text className="text-red-500">{errors.name.message}</Text>
      )}

      {/* Image URL */}
      <Text className="text-sm font-medium text-gray-700 my-2">Image URL</Text>
      <Controller
        control={control}
        name="imageUrl"
        rules={{
          pattern: {
            value: /^(https?:\/\/)[^\s$.?#].[^\s]*$/,
            message: "Enter a valid URL",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="E.g https://example.com/image.jpg"
            placeholderTextColor="#9CA3AF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="bg-white border border-gray-200 rounded-lg p-3"
          />
        )}
      />
      {errors?.imageUrl && (
        <Text className="text-red-500">{errors.imageUrl.message}</Text>
      )}

      <ActionButton
        title="Update Category"
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
      />
    </View>
  );
}
