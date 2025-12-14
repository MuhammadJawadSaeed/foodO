import axios from "axios";
import { server } from "../../server";

// Get all withdraw requests --- admin
export const getAllWithdrawRequests = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllWithdrawRequestsRequest",
    });

    const { data } = await axios.get(
      `${server}/withdraw/get-all-withdraw-request`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "getAllWithdrawRequestsSuccess",
      payload: data.withdraws,
    });
  } catch (error) {
    dispatch({
      type: "getAllWithdrawRequestsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update withdraw request --- admin
export const updateWithdrawRequest = (id, sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: "updateWithdrawRequestRequest",
    });

    const { data } = await axios.put(
      `${server}/withdraw/update-withdraw-request/${id}`,
      { sellerId },
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "updateWithdrawRequestSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "updateWithdrawRequestFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
