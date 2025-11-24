import axios from "axios";
import { server } from "../../server";

// Get platform overview
export const getPlatformOverview = () => async (dispatch) => {
  try {
    dispatch({ type: "getPlatformOverviewRequest" });

    const { data } = await axios.get(
      `${server}/admin-analytics/platform-overview`,
      { withCredentials: true }
    );

    dispatch({
      type: "getPlatformOverviewSuccess",
      payload: data.overview,
    });
  } catch (error) {
    dispatch({
      type: "getPlatformOverviewFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all user cities
export const getAllUserCities = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllUserCitiesRequest" });

    const { data } = await axios.get(`${server}/user/admin-all-cities`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUserCitiesSuccess",
      payload: data.cities,
    });
  } catch (error) {
    dispatch({
      type: "getAllUserCitiesFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all shop cities
export const getAllShopCities = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllShopCitiesRequest" });

    const { data } = await axios.get(`${server}/shop/admin-all-shop-cities`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllShopCitiesSuccess",
      payload: data.cities,
    });
  } catch (error) {
    dispatch({
      type: "getAllShopCitiesFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all captain cities
export const getAllCaptainCities = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllCaptainCitiesRequest" });

    const { data } = await axios.get(
      `${server}/captain/admin-all-captain-cities`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllCaptainCitiesSuccess",
      payload: data.cities,
    });
  } catch (error) {
    dispatch({
      type: "getAllCaptainCitiesFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get users by city
export const getUsersByCity = (city) => async (dispatch) => {
  try {
    dispatch({ type: "getUsersByCityRequest" });

    const { data } = await axios.get(
      `${server}/user/admin-users-by-city/${city}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getUsersByCitySuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getUsersByCityFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get shops by city
export const getShopsByCity = (city) => async (dispatch) => {
  try {
    dispatch({ type: "getShopsByCityRequest" });

    const { data } = await axios.get(
      `${server}/shop/admin-shops-by-city/${city}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getShopsByCitySuccess",
      payload: data.shops,
    });
  } catch (error) {
    dispatch({
      type: "getShopsByCityFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get captains by city
export const getCaptainsByCity = (city) => async (dispatch) => {
  try {
    dispatch({ type: "getCaptainsByCityRequest" });

    const { data } = await axios.get(
      `${server}/captain/admin-captains-by-city/${city}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getCaptainsByCitySuccess",
      payload: data.captains,
    });
  } catch (error) {
    dispatch({
      type: "getCaptainsByCityFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get restaurant details
export const getRestaurantDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getRestaurantDetailsRequest" });

    const { data } = await axios.get(
      `${server}/shop/admin-restaurant-details/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getRestaurantDetailsSuccess",
      payload: data.restaurant,
    });
  } catch (error) {
    dispatch({
      type: "getRestaurantDetailsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get captain details
export const getCaptainDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getCaptainDetailsRequest" });

    const { data } = await axios.get(
      `${server}/captain/admin-captain-details/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getCaptainDetailsSuccess",
      payload: data.captain,
    });
  } catch (error) {
    dispatch({
      type: "getCaptainDetailsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get city analytics
export const getCityAnalytics = (city) => async (dispatch) => {
  try {
    dispatch({ type: "getCityAnalyticsRequest" });

    const { data } = await axios.get(
      `${server}/admin-analytics/city-analytics/${city}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getCityAnalyticsSuccess",
      payload: data.analytics,
    });
  } catch (error) {
    dispatch({
      type: "getCityAnalyticsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get city comparison
export const getCityComparison = () => async (dispatch) => {
  try {
    dispatch({ type: "getCityComparisonRequest" });

    const { data } = await axios.get(
      `${server}/admin-analytics/city-comparison`,
      { withCredentials: true }
    );

    dispatch({
      type: "getCityComparisonSuccess",
      payload: data.cities,
    });
  } catch (error) {
    dispatch({
      type: "getCityComparisonFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get city monthly trends
export const getCityMonthlyTrends = (city) => async (dispatch) => {
  try {
    dispatch({ type: "getCityMonthlyTrendsRequest" });

    const { data } = await axios.get(
      `${server}/admin-analytics/city-monthly-trends/${city}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getCityMonthlyTrendsSuccess",
      payload: data.trends,
    });
  } catch (error) {
    dispatch({
      type: "getCityMonthlyTrendsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update captain status
export const updateCaptainStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: "updateCaptainStatusRequest" });

    const { data } = await axios.put(
      `${server}/captain/admin-update-captain-status/${id}`,
      { status },
      { withCredentials: true }
    );

    dispatch({
      type: "updateCaptainStatusSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "updateCaptainStatusFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete captain
export const deleteCaptain = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteCaptainRequest" });

    const { data } = await axios.delete(
      `${server}/captain/admin-delete-captain/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteCaptainSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteCaptainFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all captains
export const getAllCaptains = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllCaptainsRequest" });

    const { data } = await axios.get(`${server}/captain/admin-all-captains`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllCaptainsSuccess",
      payload: data.captains,
    });
  } catch (error) {
    dispatch({
      type: "getAllCaptainsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};
