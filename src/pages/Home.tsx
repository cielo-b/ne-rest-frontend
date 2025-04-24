// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../store";
// import { Book } from "../interfaces/interfaces";
// import { BookOpenCheck, User } from "lucide-react";
// import { z } from "zod";
// import { bookSchema } from "../lib/validations";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { logout } from "../features/auth/authSlice";
// import ConfirmationModal from "../components/modals/ConfirmationModal";
// import BookFormModal from "../components/modals/BookFormModal";
// import { BookFormFields } from "../types/types";

// type BookData = z.infer<typeof bookSchema>;

// const Home: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState<string | null>(null);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [bookId, setBookId] = useState<string | null>(null);
//   const [action, setAction] = useState<"add book" | "update book">("add book");
//   const [bookAction, setBookAction] = useState<string>("Add Book");
//   const [initialData, setInitialData] = useState<BookFormFields>({
//     title: "",
//     author: "",
//     description: "",
//   });

//   const handleDelete = (id: string) => {
//     setActionType("delete");
//     setBookId(id);
//     setIsConfirmationModalOpen(true);
//   };

//   const handleLogout = () => {
//     setActionType("logout");
//     setIsConfirmationModalOpen(true);
//   };

//   const handleConfirm = () => {
//     if (actionType === "delete" && bookId) {
//       dispatch(deleteBook(bookId));
//     } else if (actionType === "logout") {
//       dispatch(logout());
//     }
//     setIsConfirmationModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsConfirmationModalOpen(false);
//   };

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key == "Escape") {
//         setShowModal(false);
//       }
//     };

//     if (showModal) {
//       window.addEventListener("keydown", handleEsc);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleEsc);
//     };
//   }, [showModal]);

//   const user = useSelector((state: RootState) => state.auth.user);
//   const books = useSelector((state: RootState) => state.books);

//   const allBooks = books;
//   const myBooks = books.books.filter((b) => b.owner == user?.email);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<BookData>({
//     resolver: zodResolver(bookSchema),
//   });

//   const onsubmit = (data: BookData, action: "add book" | "update book") => {
//     const book: Book = {
//       id: bookId
//         ? bookId
//         : `S/N-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//       author: data.author,
//       description: data.description,
//       title: data.title,
//       owner: user!.email,
//     };
//     dispatch(
//       action == "update book" && bookId ? updateBook(book) : addBook(book)
//     );
//     reset();
//     setShowModal(false);
//     setBookId(null);
//   };

//   const handleAddBook = () => {
//     setBookAction("Add Book");
//     setAction("add book");
//     setShowModal(true);
//     setInitialData({
//       title: "",
//       author: "",
//       description: "",
//     });
//   };

//   const handleUpdateBook = (id: string) => {
//     setBookAction("Update Book");
//     setAction("update book");
//     setShowModal(true);
//     setBookId(id);
//     const book = allBooks.find((b) => b.id === id);
//     if (!book) {
//       setInitialData({
//         title: "",
//         author: "",
//         description: "",
//       });
//     } else {
//       setInitialData({
//         title: book.title,
//         author: book.author,
//         description: book.description || "",
//       });
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl text-center lg:text-left font-bold mb-6">
//         📊 Dashboard
//       </h1>

//       <div className="flex justify-end mr-5 mb-4">
//         <button
//           className="bg-gradient-to-r bg-blue-500 w-full sm:w-auto  text-white px-6 py-3 rounded shadow-lg hover:from-blue-600 hover:to-blue-800 cursor-pointer border-none"
//           onClick={handleAddBook}
//         >
//           ➕ Add Book
//         </button>
//       </div>
//       <ConfirmationModal
//         isOpen={isConfirmationModalOpen}
//         onConfirm={handleConfirm}
//         onCancel={handleCancel}
//         message={`Are you sure you want to ${
//           actionType === "delete" ? "delete" : "log out"
//         }?`}
//         title="Confirmation"
//       />

//       <BookFormModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={onsubmit}
//         title={bookAction}
//         initialData={initialData}
//         action={action}
//         bookAction={bookAction}
//       />

//       {/* User Info */}
//       <div className="bg-white flex-col sm:flex-row rounded-xl p-5 shadow-md mb-6 flex justify-between items-center gap-4">
//         <div className="flex items-center gap-2.5">
//           <User className="text-blue-500 w-8 h-8" />
//           <div>
//             <h2 className="text-xl font-semibold">{user?.name}</h2>
//             <p className="text-sm text-gray-500">{user?.email}</p>
//           </div>
//         </div>

//         <div className="flex justify-end mb-4 w-auto">
//           <button
//             className="bg-gradient-to-r bg-red-500 text-white px-6 py-3 rounded shadow-lg hover:from-red-600 hover:to-red-800 cursor-pointer border-none"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//         <div className="bg-blue-100 rounded-xl p-4 flex items-center gap-4">
//           <BookOpenCheck className="text-blue-600 w-6 h-6" />
//           <div>
//             <p className="text-sm text-gray-600">Total Books</p>
//             <p className="text-lg font-bold">{books.length}</p>
//           </div>
//         </div>

//         <div className="bg-green-100 rounded-xl p-4 flex items-center gap-4">
//           <BookOpenCheck className="text-green-600 w-6 h-6" />
//           <div>
//             <p className="text-sm text-gray-600">Your Books</p>
//             <p className="text-lg font-bold">{myBooks.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* Book Table */}
//       <div className="bg-white rounded-xl p-6 shadow-md">
//         <h2 className="text-xl font-semibold mb-4">📚 Books</h2>

//         <div className="overflow-x-auto max-h-[400px] max-w-[100%] overflow-y-auto">
//           <table className="w-[100%] table-auto h-[100%] border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700 text-left">
//                 <th className="p-3 border-b">#</th>
//                 <th className="p-3 border-b">Title</th>
//                 <th className="p-3 border-b">S/N</th>
//                 <th className="p-3 border-b">Description</th>
//                 <th className="p-3 border-b">Author</th>
//                 <th className="p-3 border-b">Owner</th>
//                 <th className="p-3 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allBooks.map((book, count) => (
//                 <tr
//                   key={book.id}
//                   className="hover:bg-gray-50 transition-all duration-150"
//                 >
//                   <td className="p-3 border-b">{count + 1}</td>
//                   <td className="p-3 border-b">{book.title}</td>
//                   <td className="p-3 border-b">{book.id}</td>
//                   <td className="p-3 border-b">{book.description}</td>
//                   <td className="p-3 border-b">{book.author}</td>
//                   <td className="p-3 border-b">{book.owner}</td>
//                   <td className="p-3 border-b relative">
//                     <div className="flex gap-2">
//                       <button
//                         className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded shadow"
//                         onClick={() => handleUpdateBook(book.id)}
//                       >
//                         Update
//                       </button>
//                       <button
//                         className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded shadow"
//                         onClick={() => handleDelete(book.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from 'react'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home
