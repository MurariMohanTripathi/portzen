import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";

export default function Login() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard/overview", { replace: true });
  }, [user, navigate]);

  async function submit(event) {
    event.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in");
      navigate("/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function google() {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google");
      navigate("/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <AuthCard title="Welcome back" subtitle="Manage your PortZen developer portfolio.">
    <Button className="w-full" variant="secondary" onClick={google}>Continue with Google</Button>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="Email"><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></Field>
      <Field label="Password"><input className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></Field>
      <Button className="w-full" type="submit">Login</Button>
    </form>
    <div className="mt-5 flex justify-between text-sm text-zinc-400">
      <Link to="/forgot-password" className="hover:text-cyan-300">Forgot password?</Link>
      <Link to="/signup" className="hover:text-cyan-300">Create account</Link>
    </div>
  </AuthCard>;
}

export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-zinc-950 px-5 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.16),transparent_25%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
        <Link to="/" className="mb-7 block text-2xl font-black">Port<span className="text-cyan-300">Zen</span></Link>
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-2 mb-7 text-zinc-400">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
