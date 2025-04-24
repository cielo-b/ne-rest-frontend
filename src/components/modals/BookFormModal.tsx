import { useForm } from "react-hook-form";
import { BookFormFields, BookFormProps } from "../../types/types";
import React, { useState } from "react";

const BookFormModal: React.FC<BookFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
  action,
  bookAction,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormFields>({
    defaultValues: initialData || {
      title: "",
      author: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData || { title: "", author: "", description: "" });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center">{title}</h2>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data, action))}
          className="flex flex-col gap-4"
        >
          {/* Book Title */}
          <div className="flex flex-col gap-2">
            <h1>Title</h1>
            <input
              type="text"
              placeholder="Book Title"
              {...register("title", { required: "Title is required" })}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div className="flex flex-col gap-2">
            <h1>Author</h1>
            <input
              type="text"
              placeholder="Author"
              {...register("author", { required: "Author is required" })}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.author
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h1>Description</h1>
            <textarea
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className={`w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-300 w-full cursor-pointer sm:w-[50%] text-white p-3 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full cursor-pointer sm:w-[50%] text-white p-3 rounded-xl font-semibold transition"
            >
              {bookAction}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
