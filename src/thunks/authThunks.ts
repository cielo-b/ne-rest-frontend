import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginDTO, RegisterDTO } from "../interfaces/interfaces";
import * as authService from "../services/auth.service";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (dto: LoginDTO, thunkAPI) => {
    try {
      const data = await authService.login(dto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (dto: RegisterDTO, thunkAPI) => {
    try {
      const data = await authService.register(dto);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
