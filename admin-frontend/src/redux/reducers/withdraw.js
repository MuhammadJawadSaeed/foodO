import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const withdrawReducer = createReducer(initialState, {
  // get all withdraw requests --- admin
  getAllWithdrawRequestsRequest: (state) => {
    state.isLoading = true;
  },
  getAllWithdrawRequestsSuccess: (state, action) => {
    state.isLoading = false;
    state.withdraws = action.payload;
  },
  getAllWithdrawRequestsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // update withdraw request --- admin
  updateWithdrawRequestRequest: (state) => {
    state.isLoading = true;
  },
  updateWithdrawRequestSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  updateWithdrawRequestFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
