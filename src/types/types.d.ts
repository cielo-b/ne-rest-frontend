export type BookFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormFields, action: "add book" | "update book") => void;
  title: string;
  action: "add book" | "update book";
  bookAction: string;
  initialData?: BookFormFields;
};

export type BookFormFields = {
  title: string;
  author: string;
  description: string;
};
