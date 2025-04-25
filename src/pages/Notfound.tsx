import React from "react";
import { useNavigate } from "react-router-dom";
import { Ghost } from "lucide-react"; 

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <Ghost className="w-20 h-20 text-blue-500 animate-bounce mb-6" />
      <h1 className="text-5xl font-bold mb-4">404 - Not Found 😵‍💫</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.
        Maybe you typed the wrong URL 🤔.
      </p>
      <button
        onClick={handleBackHome}
        className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        🔙 Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
