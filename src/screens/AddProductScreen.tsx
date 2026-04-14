import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CategoriesStackParamList } from "../types/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ActionButton } from "../components/shared/ActionButton";
import { createProduct } from "../api/products";

type Props = NativeStackScreenProps<CategoriesStackParamList, "AddProduct">;

type ProductFormValues = {
  name: string;
  price: string;
  imageUrl: string;
  description: string;
};

export default function AddProductScreen({ navigation, route }: Props) {
  const { categoryId } = route.params;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        categoryId,
      };
      return createProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", categoryId] });
      navigation.goBack();
    },
    onError: (error) => {
      console.log("Product creation error", error);
      Alert.alert("Error", "Failed to create product");
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (mutation.isPending) return;
    mutation.mutate(data);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Add New Product
      </Text>
      <Text className="text-gray-600 text-sm mb-4">
        Fill Product Details Below
      </Text>

      <Text className="mb-2 text-sm font-medium text-gray-700 mt-2">
        Product Name
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Product name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="E.g Cold Coffee"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className="bg-white rounded-lg border border-gray-200 p-3"
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 mt-2">{errors.name.message}</Text>
      )}

      <Text className="mb-2 text-sm font-medium text-gray-700 mt-2">
        Product Price
      </Text>
      <Controller
        control={control}
        name="price"
        rules={{
          required: "Price is required",
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Enter a valid price",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="E.g 99.99"
            keyboardType="decimal-pad"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className="bg-white rounded-lg border border-gray-200 p-3"
          />
        )}
      />
      {errors.price && (
        <Text className="text-red-500 mt-2">{errors.price.message}</Text>
      )}

      <Text className="mb-2 text-sm font-medium text-gray-700 mt-2">
        Image URL
      </Text>
      <Controller
        control={control}
        name="imageUrl"
        rules={{
          required: "Image URL is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="E.g https://example.com/image.jpg"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className="bg-white rounded-lg border border-gray-200 p-3"
          />
        )}
      />
      {errors.imageUrl && (
        <Text className="text-red-500 mt-2">{errors.imageUrl.message}</Text>
      )}

      <Text className="mb-2 text-sm font-medium text-gray-700 mt-2">
        Description (optional)
      </Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Enter product description"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            textAlignVertical="top"
            className="bg-white rounded-lg border border-gray-200 p-3 h-28"
          />
        )}
      />
      {errors.description && (
        <Text className="text-red-500 mt-2">{errors.description.message}</Text>
      )}

      <ActionButton
        onPress={handleSubmit(onSubmit)}
        loading={mutation.isPending}
        title="Create Product"
      />
    </ScrollView>
  );
}
