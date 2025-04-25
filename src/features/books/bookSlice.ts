import { createSlice } from "@reduxjs/toolkit";
import { BookState } from "../../interfaces/interfaces";
import {
  createBookThunk,
  deleteBookThunk,
  fetchBooksThunk,
  updateBookThunk,
} from "../../thunks/bookThunks";

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action) => {
        state.books = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch books";
      });

    builder
      .addCase(createBookThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookThunk.fulfilled, (state, action) => {
        state.books.push(action.payload);
        state.loading = false;
      })
      .addCase(createBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create book";
      });

    builder
      .addCase(updateBookThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookThunk.fulfilled, (state, action) => {
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.books[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update book";
      });
    builder
      .addCase(deleteBookThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookThunk.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteBookThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete book";
      });
  },
});

export const booksReducer = bookSlice.reducer;
