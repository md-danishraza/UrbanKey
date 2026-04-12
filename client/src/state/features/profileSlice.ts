import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  isEditing: boolean;
  formData: {
    fullName: string;
    phone: string;
    email: string;
    avatarUrl: string;
  };
}

const initialState: ProfileState = {
  isEditing: false,
  formData: {
    fullName: "",
    phone: "",
    email: "",
    avatarUrl: "",
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setFormData: (state, action: PayloadAction<ProfileState["formData"]>) => {
      state.formData = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.isEditing = false;
    },
  },
});

export const { setIsEditing, setFormData, resetForm } = profileSlice.actions;
export default profileSlice.reducer;
