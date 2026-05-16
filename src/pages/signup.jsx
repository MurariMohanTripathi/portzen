import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import { AuthCard } from "./Login";

export default function Signup() {
  const navigate = useNavigate();
  const { user, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard/overview", { replace: true });
  }, [user, navigate]);

  async function submit(event) {
    event.preventDefault();
    try {
      await signup(email, password);
      toast.success("Account created");
      navigate("/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function google() {
    try {
      await loginWithGoogle();
      toast.success("Account ready");
      navigate("/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <AuthCard title="Create your account" subtitle="Claim a custom portfolio URL and start editing.">
    <Button className="w-full" variant="secondary" onClick={google}>Continue with Google</Button>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="Email"><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></Field>
      <Field label="Password"><input className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required /></Field>
      <Button className="w-full" type="submit">Start building</Button>
    </form>
    <p className="mt-5 text-sm text-zinc-400">Already have an account? <Link to="/login" className="text-cyan-300">Login</Link></p>
  </AuthCard>;
}
