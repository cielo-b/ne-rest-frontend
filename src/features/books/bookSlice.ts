import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../../interfaces/interfaces";

const initialState: Book[] = [];

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const book = state.find((b) => b.id === action.payload.id);
      console.log(action.payload.id)
      if (book) {
        Object.assign(book, action.payload);
      }
    },
    deleteBook: (state, action: PayloadAction<string>) => {
      return state.filter((b) => b.id !== action.payload);
    },
  },
});

export const { addBook, updateBook, deleteBook } = bookSlice.actions;
export const booksReducer = bookSlice.reducer;
