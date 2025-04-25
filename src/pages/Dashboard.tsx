import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getMeThunk } from "../thunks/authThunks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Book, User as u } from "../interfaces/interfaces";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import BookFormModal from "../components/modals/BookFormModal";
import { BookOpenCheck, User } from "lucide-react";
import { BookFormFields } from "../types/types";
import { logout } from "../features/auth/authSlice";
import {
  createBookThunk,
  deleteBookThunk,
  fetchBooksThunk,
  updateBookThunk,
} from "../thunks/bookThunks";
import { bookSchema } from "../lib/validations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type BookData = z.infer<typeof bookSchema>;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [user, setUser] = useState<u | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookId, setBookId] = useState<string | null>(null);
  const [action, setAction] = useState<"add book" | "update book">("add book");
  const [bookAction, setBookAction] = useState<string>("Add Book");
  const [initialData, setInitialData] = useState<BookFormFields>({
    title: "",
    author: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);

      if (!token) {
        navigate("/login");
        return;
      }

      dispatch(getMeThunk(token))
        .unwrap()
        .then((userData) => {
          const fetchedUser = userData.data;
          setUser(fetchedUser);

          dispatch(fetchBooksThunk())
            .unwrap()
            .then((bookData) => {
              const allBooks = bookData.data || [];
              setBooks(Array.isArray(allBooks) ? allBooks : []);
              setMyBooks(allBooks?.filter((b: Book) => b.owner === user?.id) || []);
            })
            .catch((err) => {
              toast.error(
                err.response?.data?.message || "Failed to fetch books 📚"
              );
              setBooks([]);
            })
            .finally(() => setIsLoading(false));
        })
        .catch((err) => {
          console.error("User fetch error:", err);
          toast.error(err.response?.data?.message || "Failed to fetch user 🙅🏽‍♂️");
          setIsLoading(false);
        });
    };

    fetchData();
  }, [dispatch, token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookData>({
    resolver: zodResolver(bookSchema),
  });

  const onsubmit = async (
    data: BookData,
    action: "add book" | "update book"
  ) => {
    try {
      const book: Book = {
        id: bookId
          ? bookId
          : `S/N-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        author: data.author,
        description: data.description,
        title: data.title,
        owner: user!.email,
      };

      if (action === "update book" && bookId) {
        await dispatch(updateBookThunk(book)).unwrap();
        setBooks((prevBooks) =>
          prevBooks.map((b) => (b.id === book.id ? { ...b, ...book } : b))
        );
        toast.success("Book updated successfully!");
      } else {
        await dispatch(createBookThunk(book)).unwrap();
        setBooks((prevBooks) => [...prevBooks, book]);
        toast.success("Book added successfully!");
      }

      reset();
      setShowModal(false);
      setBookId(null);
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(
        err.response?.data?.message ||
          "An error occurred while processing the book."
      );
    }
  };

  const handleConfirm = () => {
    if (actionType === "delete" && bookId) {
      dispatch(deleteBookThunk(bookId))
        .unwrap()
        .then(() => {
          setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
          toast.success("Book deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting book:", err);
          toast.error(
            err.response?.data?.message || "Failed to delete the book."
          );
        });
    } else if (actionType === "logout") {
      dispatch(logout());
    }
    setIsConfirmationModalOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleLogout = () => {
    setActionType("logout");
    setIsConfirmationModalOpen(true);
  };

  const handleAddBook = () => {
    setBookAction("Add Book");
    setAction("add book");
    setShowModal(true);
    setInitialData({
      title: "",
      author: "",
      description: "",
    });
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  const handleUpdateBook = (id: string) => {
    setBookAction("Update Book");
    setAction("update book");
    setShowModal(true);
    setBookId(id);
    const book = books.find((b) => b.id === id);
    if (!book) {
      setInitialData({
        title: "",
        author: "",
        description: "",
      });
    } else {
      setInitialData({
        title: book.title,
        author: book.author,
        description: book.description || "",
      });
    }
  };

  const handleDelete = (id: string) => {
    setActionType("delete");
    setBookId(id);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl text-center lg:text-left font-bold mb-6">
        📊 Dashboard
      </h1>
      <div className="flex justify-end mr-5 mb-4">
        <button
          className="bg-gradient-to-r bg-blue-500 w-full sm:w-auto  text-white px-6 py-3 rounded shadow-lg hover:from-blue-600 hover:to-blue-800 cursor-pointer border-none"
          onClick={handleAddBook}
        >
          ➕ Add Book
        </button>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to ${
          actionType === "delete" ? "delete" : "log out"
        }?`}
        title="Confirmation"
      />
      <BookFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={onsubmit}
        title={bookAction}
        initialData={initialData}
        action={action}
        bookAction={bookAction}
      />
      {/* User Info */}
      <div className="bg-white flex-col sm:flex-row rounded-xl p-5 shadow-md mb-6 flex justify-between items-center gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              ></path>
            </svg>
            <span className="ml-3 text-blue-500 font-medium">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <User className="text-blue-500 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end mb-4 w-auto">
          <button
            className="bg-gradient-to-r bg-red-500 text-white px-6 py-3 rounded shadow-lg hover:from-red-600 hover:to-red-800 cursor-pointer border-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 rounded-xl p-4 flex items-center gap-4">
          <BookOpenCheck className="text-blue-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-600">Total Books</p>
            <p className="text-lg font-bold">{books?.length || 0}</p>
          </div>
        </div>

        <div className="bg-green-100 rounded-xl p-4 flex items-center gap-4">
          <BookOpenCheck className="text-green-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-600">Your Books</p>
            <p className="text-lg font-bold">
            {myBooks?.length || 0}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">📚 Books</h2>

        <div className="overflow-x-auto max-h-[400px] max-w-[100%] overflow-y-auto">
          {books.length == 0 ? (
            <>
              <h1>No books found</h1>
            </>
          ) : (
            <table className="w-[100%] table-auto h-[100%] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Title</th>
                  <th className="p-3 border-b">S/N</th>
                  <th className="p-3 border-b">Description</th>
                  <th className="p-3 border-b">Author</th>
                  <th className="p-3 border-b">Owner</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, count) => (
                  <tr
                    key={book.id}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="p-3 border-b">{count + 1}</td>
                    <td className="p-3 border-b">{book.title}</td>
                    <td className="p-3 border-b">{book.id}</td>
                    <td className="p-3 border-b">{book.description}</td>
                    <td className="p-3 border-b">{book.author}</td>
                    <td className="p-3 border-b">{book.owner}</td>
                    <td className="p-3 border-b relative">
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded shadow"
                          onClick={() => handleUpdateBook(book.id)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded shadow"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
