import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  platformOverview: null,
  userCities: [],
  shopCities: [],
  captainCities: [],
  usersByCity: [],
  shopsByCity: [],
  captainsByCity: [],
  restaurantDetails: null,
  captainDetails: null,
  cityAnalytics: null,
  cityComparison: [],
  cityMonthlyTrends: [],
  allCaptains: [],
  error: null,
  success: false,
  message: null,
};

export const cityReducer = createReducer(initialState, (builder) => {
  builder
    // Platform Overview
    .addCase("getPlatformOverviewRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getPlatformOverviewSuccess", (state, action) => {
      state.isLoading = false;
      state.platformOverview = action.payload;
    })
    .addCase("getPlatformOverviewFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // User Cities
    .addCase("getAllUserCitiesRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllUserCitiesSuccess", (state, action) => {
      state.isLoading = false;
      state.userCities = action.payload;
    })
    .addCase("getAllUserCitiesFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Shop Cities
    .addCase("getAllShopCitiesRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllShopCitiesSuccess", (state, action) => {
      state.isLoading = false;
      state.shopCities = action.payload;
    })
    .addCase("getAllShopCitiesFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Captain Cities
    .addCase("getAllCaptainCitiesRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllCaptainCitiesSuccess", (state, action) => {
      state.isLoading = false;
      state.captainCities = action.payload;
    })
    .addCase("getAllCaptainCitiesFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Users By City
    .addCase("getUsersByCityRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getUsersByCitySuccess", (state, action) => {
      state.isLoading = false;
      state.usersByCity = action.payload;
    })
    .addCase("getUsersByCityFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Shops By City
    .addCase("getShopsByCityRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getShopsByCitySuccess", (state, action) => {
      state.isLoading = false;
      state.shopsByCity = action.payload;
    })
    .addCase("getShopsByCityFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Captains By City
    .addCase("getCaptainsByCityRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCaptainsByCitySuccess", (state, action) => {
      state.isLoading = false;
      state.captainsByCity = action.payload;
    })
    .addCase("getCaptainsByCityFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Restaurant Details
    .addCase("getRestaurantDetailsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getRestaurantDetailsSuccess", (state, action) => {
      state.isLoading = false;
      state.restaurantDetails = action.payload;
    })
    .addCase("getRestaurantDetailsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Captain Details
    .addCase("getCaptainDetailsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCaptainDetailsSuccess", (state, action) => {
      state.isLoading = false;
      state.captainDetails = action.payload;
    })
    .addCase("getCaptainDetailsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // City Analytics
    .addCase("getCityAnalyticsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCityAnalyticsSuccess", (state, action) => {
      state.isLoading = false;
      state.cityAnalytics = action.payload;
    })
    .addCase("getCityAnalyticsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // City Comparison
    .addCase("getCityComparisonRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCityComparisonSuccess", (state, action) => {
      state.isLoading = false;
      state.cityComparison = action.payload;
    })
    .addCase("getCityComparisonFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // City Monthly Trends
    .addCase("getCityMonthlyTrendsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCityMonthlyTrendsSuccess", (state, action) => {
      state.isLoading = false;
      state.cityMonthlyTrends = action.payload;
    })
    .addCase("getCityMonthlyTrendsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Update Captain Status
    .addCase("updateCaptainStatusRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateCaptainStatusSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.message = action.payload;
    })
    .addCase("updateCaptainStatusFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete Captain
    .addCase("deleteCaptainRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteCaptainSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.message = action.payload;
    })
    .addCase("deleteCaptainFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get All Captains
    .addCase("getAllCaptainsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllCaptainsSuccess", (state, action) => {
      state.isLoading = false;
      state.allCaptains = action.payload;
    })
    .addCase("getAllCaptainsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear Errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    })

    // Clear Messages
    .addCase("clearMessages", (state) => {
      state.success = false;
      state.message = null;
    });
});
