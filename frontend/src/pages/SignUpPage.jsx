
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {

  const {signup} = useUserStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData)
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white/10 w-80 "
      >
        <h2 className="text-xl font-bold text-center">Sign Up</h2>

        <input
          id="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          id="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Sign Up
        </button>

        <p className="text-xs text-center">Already have an account?
        <span className="text-sm text-yellow-500 cursor-pointer"
        onClick={() => navigate("/login") }
        > Login</span></p>

      </form>
      
    </div>
  );
};

export default SignUpPage;