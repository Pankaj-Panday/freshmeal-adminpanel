export type Address = {
  id: string;
  name: string;
  mobile: string;
  buildingName: string;
  flatNo: string;
  street: string;
  locality: string;
  landmark: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
};
