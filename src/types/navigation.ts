export type CategoriesStackParamList = {
  Categories: undefined;
  AddCategory: undefined;
  EditCategory: { categoryId: string };
  Products: { categoryId: string; categoryName: string };
  AddProduct: { categoryId: string };
};

export type OrdersStackParamList = {
  Orders: undefined;
  OrderDetails: { orderId: string };
};
