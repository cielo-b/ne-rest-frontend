export interface User {
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  owner: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  title?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}
