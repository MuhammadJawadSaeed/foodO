import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { orderReducer } from "./reducers/order";
import { cityReducer } from "./reducers/city";
import { withdrawReducer } from "./reducers/withdraw";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    order: orderReducer,
    city: cityReducer,
    withdraw: withdrawReducer,
  },
});

export default Store;
