import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "employee" | "hr";
export interface UserState {
  id?: string;
  name: string;
  email: string;
  role: Role | string;
  token?: string;
}

interface UserSliceState {
  user: UserState | null;
}

const initialState: UserSliceState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
