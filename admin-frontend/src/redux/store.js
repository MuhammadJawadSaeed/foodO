import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { orderReducer } from "./reducers/order";
import { cityReducer } from "./reducers/city";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    order: orderReducer,
    city: cityReducer,
  },
});

export default Store;
