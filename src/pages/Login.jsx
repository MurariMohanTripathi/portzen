import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import BrandLogo from "../components/brand/BrandLogo";
import PageSeo from "../components/seo/PageSeo";
import SiteFooter from "../components/layout/SiteFooter";
import { pageSeo } from "../utils/seo";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate(location.state?.from || "/dashboard/overview", { replace: true });
  }, [user, navigate, location.state?.from]);

  async function submit(event) {
    event.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in");
      navigate(location.state?.from || "/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function google() {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google");
      navigate(location.state?.from || "/dashboard/overview");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <AuthCard seo={pageSeo.login} title="Welcome back" subtitle="Manage your PortZen developer portfolio.">
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

export function AuthCard({ title, subtitle, seo, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      {seo ? <PageSeo {...seo} /> : null}
      <div className="fixed inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.72),rgba(9,9,11,0.92)_42%,rgba(76,29,49,0.54))]" />
      <div className="relative grid flex-1 place-items-center px-5 py-8">
        <div className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <Link to="/" className="mb-5 inline-flex" aria-label="PortZen home"><BrandLogo /></Link>
          <div className="mb-7">
            <Link to="/" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">Back to landing page</Link>
          </div>
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-2 mb-7 text-zinc-400">{subtitle}</p>
          {children}
        </div>
      </div>
      <SiteFooter variant="compact" />
    </div>
  );
}
