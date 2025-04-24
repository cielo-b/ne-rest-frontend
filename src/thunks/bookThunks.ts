import { createAsyncThunk } from "@reduxjs/toolkit";
import * as bookService from "../services/book.service";

export const fetchBooksThunk = createAsyncThunk(
  "books/fetchAll",
  async (_, thunkAPI) => {
    try {
      const books = await bookService.fetchBooks();
      return books;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createBookThunk = createAsyncThunk(
  "books/create",
  async (bookData: any, thunkAPI) => {
    try {
      const newBook = await bookService.createBook(bookData);
      return newBook;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Update and delete are similar
export const updateBookThunk = createAsyncThunk(
  "books/update",
  async (bookData: any, thunkAPI) => {
    try {
      const updatedBook = await bookService.updateBook(bookData);
      return updatedBook;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteBookThunk = createAsyncThunk(
  "books/delete",
  async (bookId: string, thunkAPI) => {
    try {
      await bookService.deleteBook(bookId);
      return bookId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
