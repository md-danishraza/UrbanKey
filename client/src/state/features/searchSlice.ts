import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string | null;
}

const initialState: SearchState = {
  location: "",
  minPrice: 0,
  maxPrice: 100000,
  propertyType: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    resetFilters: () => initialState,
  },
});

export const { setSearchLocation, setPriceRange, resetFilters } =
  searchSlice.actions;
export default searchSlice.reducer;
