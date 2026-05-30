import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Field, { inputClass } from "../components/ui/Field";
import { AuthCard } from "./Login";
import { pageSeo } from "../utils/seo";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      await resetPassword(email);
      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return <AuthCard seo={pageSeo.forgotPassword} title="Reset password" subtitle="We will send a reset link to your email.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email"><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></Field>
      <Button className="w-full" type="submit">Send reset link</Button>
    </form>
  </AuthCard>;
}
