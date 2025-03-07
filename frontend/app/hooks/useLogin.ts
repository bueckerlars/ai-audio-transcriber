import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "~/api";

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      // Save token to localStorage or context
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}