export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Verification: undefined;
};

export type AppStackParamList = {
  ProductsList: undefined;
  ProductDetails: { productId: string };
  Collection: undefined; 
  Login: undefined; 
};