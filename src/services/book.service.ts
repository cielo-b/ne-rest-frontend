import instance from "../api";

export const fetchBooks = async () => {
  const res = await instance.get("/books");
  return res.data;
};

export const createBook = async (bookData: any) => {
  const res = await instance.post("/books", bookData);
  return res.data;
};

export const updateBook = async (bookData: any) => {
  const res = await instance.put(`/books/${bookData.id}`, bookData);
  return res.data;
};

export const deleteBook = async (bookId: string) => {
  const res = await instance.delete(`/books/${bookId}`);
  return res.data;
};
