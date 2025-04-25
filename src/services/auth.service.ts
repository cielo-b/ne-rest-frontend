import instance from "../api";
import { LoginDTO, RegisterDTO } from "../interfaces/interfaces";

export const login = async (dto: LoginDTO) => {
  const res = await instance.post("/auth/login", dto);
  return res.data;
};

export const register = async (dto: RegisterDTO) => {
  const res = await instance.post("/auth/register", dto);
  return res.data;
};



export const getLoggedInUser = async (token: string) => {
  const res = await instance.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};