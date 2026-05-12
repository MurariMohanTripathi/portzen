import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebase";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Account Created");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      toast.success("Google Signup Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full"></div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        <h1 className="text-4xl font-black mb-2">
          Create Account 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          Start building your developer portfolio.
        </p>

        {/* Google */}
        <button
          onClick={handleGoogleSignup}
          className="w-full py-3 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition mb-6"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] bg-white/10 w-full"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-[1px] bg-white/10 w-full"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-lg shadow-cyan-500/20"
          >
            Signup
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
} 