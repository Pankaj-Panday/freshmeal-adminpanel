export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
};

export type CategoryFormValues = Omit<Category, "id" | "createdAt">;
