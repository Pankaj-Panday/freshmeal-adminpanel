import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CategoriesStackParamList } from "../types/navigation";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/categories";
import { ActionButton } from "../components/shared/ActionButton";
import { CategoryFormValues } from "../types/category";

type Props = NativeStackScreenProps<CategoriesStackParamList, "AddCategory">;

export default function AddCategoryScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      return createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigation.goBack();
    },
    onError: (error: any) => {
      console.log("API ERROR:", error.response?.data);
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Add New Category
      </Text>
      <Text className="text-sm text-gray-600 mb-4">
        Give it a short, clear name!
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
        title="Create Category"
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
      />
    </View>
  );
}
