"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation'

const AuthPage = () => {
  const router = useRouter();
  const [isUser, setIsUser] = useState(true);  // Toggle between Login & Signup
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Form Data:", formData);  // Check if values are updating

    if (!isUser) {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.fullName,
          }
        }
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Check your email for the confirmation link!");
        setIsUser(true); // Switch to login after successful signup
      }
    } else {
      // Login logic
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", formData.fullName || "User");
        router.push("/home");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isUser ? "Login" : "Signup"}
        </h2>
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setIsUser(true)}
            variant={isUser ? "default" : "ghost"}
            className={`rounded-l-full w-1/2 ${isUser ? "bg-indigo-600 text-white" : "text-gray-600"}`}
          >
            Login
          </Button>
          <Button
            onClick={() => setIsUser(false)}
            variant={!isUser ? "default" : "ghost"}
            className={`rounded-r-full w-1/2 ${!isUser ? "bg-indigo-600 text-white" : "text-gray-600"}`}
          >
            Signup
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isUser && (
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="mb-4"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          )}
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            className="mb-4"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isUser && (
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="mb-4"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isUser ? "Login" : "Signup"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            {isUser ? "Not a member?" : "Already a member?"}{" "}
            <span
              onClick={() => setIsUser(!isUser)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              {isUser ? "Signup now" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
