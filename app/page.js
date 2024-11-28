"use client";
import { useState } from "react";

const Chatbot = () => {
  const [currentMenu, setCurrentMenu] = useState("main");
  const [content, setContent] = useState("");

  const fetchContent = async (option) => {
    try {
      const res = await fetch(`/api/chatbot?option=${option}`);
      const data = await res.json();
      setContent(data.answer);
      setCurrentMenu("content");
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const menuOptions = [
    { id: "about", label: "About Us" },
    { id: "address", label: "Address" },
    { id: "phone", label: "Phone Number" },
    { id: "payment", label: "School Payment" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        {currentMenu === "main" && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">
              Welcome to Our School
            </h2>
            <div className="space-y-2">
              {menuOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => fetchContent(option.id)}
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {currentMenu === "content" && (
          <div>
            <div className="mb-4 text-gray-800">{content}</div>
            <button
              onClick={() => setCurrentMenu("main")}
              className="w-full px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
