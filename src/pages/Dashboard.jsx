import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    title: "",
    bio: "",
    summary: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: "",
  });

  // Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);

    navigate("/");
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Portfolio Data Saved");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] bg-purple-500/20 blur-3xl rounded-full"></div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-3xl font-black">
          Port<span className="text-cyan-400">Zen</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-400">
              Logged in as
            </p>

            <p className="font-medium">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl border border-red-500/30 hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="relative z-10 px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-3">
            Dashboard 🚀
          </h1>

          <p className="text-gray-400 text-lg">
            Create and manage your developer portfolio.
          </p>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Form Section */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-8">
              Portfolio Details
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Username */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Username
                </label>

                <div className="flex items-center bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
                  <span className="px-4 text-gray-500">
                    portzen.in/
                  </span>

                  <input
                    type="text"
                    name="username"
                    placeholder="murari"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-transparent px-4 py-4 outline-none"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Murari Tripathi"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Professional Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Full Stack Developer"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Bio
                </label>

                <textarea
                  rows="4"
                  name="bio"
                  placeholder="Write a short bio..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition resize-none"
                ></textarea>
              </div>

              {/* Summary */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Summary
                </label>

                <textarea
                  rows="5"
                  name="summary"
                  placeholder="Describe yourself..."
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition resize-none"
                ></textarea>
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-gray-300">
                    GitHub
                  </label>

                  <input
                    type="text"
                    name="github"
                    placeholder="github.com/username"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">
                    LinkedIn
                  </label>

                  <input
                    type="text"
                    name="linkedin"
                    placeholder="linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Personal Website
                </label>

                <input
                  type="text"
                  name="portfolio"
                  placeholder="yourwebsite.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block mb-2 text-gray-300">
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, Firebase"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-5 pt-5">
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-2xl shadow-cyan-500/20 transition"
                >
                  Save Portfolio
                </button>

                <button
                  type="button"
                  className="px-8 py-4 rounded-2xl border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition"
                >
                  Preview Portfolio
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-4xl font-black mb-5">
                  {formData.fullName
                    ? formData.fullName.charAt(0)
                    : "P"}
                </div>

                <h2 className="text-2xl font-bold">
                  {formData.fullName || "Your Name"}
                </h2>

                <p className="text-cyan-400 mt-2">
                  {formData.title ||
                    "Developer"}
                </p>

                <div className="mt-5 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm">
                  portzen.in/
                  <span className="text-cyan-400">
                    {formData.username || "username"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-[2rem] p-8">
              <h3 className="text-2xl font-bold mb-5">
                ✨ Pro Tips
              </h3>

              <ul className="space-y-4 text-gray-300">
                <li>
                  • Use a short memorable username.
                </li>

                <li>
                  • Add real project links.
                </li>

                <li>
                  • Keep your bio professional.
                </li>

                <li>
                  • Add modern tech skills.
                </li>

                <li>
                  • Use portfolio cover images later.
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6">
                Portfolio Stats
              </h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">
                    Profile Completion
                  </p>

                  <p className="text-cyan-400 font-bold">
                    45%
                  </p>
                </div>

                <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-5">
                  <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                    <h4 className="text-3xl font-bold text-cyan-400">
                      0
                    </h4>

                    <p className="text-gray-500 mt-2">
                      Views
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                    <h4 className="text-3xl font-bold text-purple-400">
                      0
                    </h4>

                    <p className="text-gray-500 mt-2">
                      Projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}