import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-12rem] left-[-12rem] w-[35rem] h-[35rem] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

        <div className="absolute bottom-[-12rem] right-[-12rem] w-[35rem] h-[35rem] bg-purple-600/20 blur-3xl rounded-full animate-pulse"></div>

        <div className="absolute top-[40%] left-[45%] w-[15rem] h-[15rem] bg-pink-500/10 blur-3xl rounded-full"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-3xl font-black tracking-tight">
          Port<span className="text-cyan-400">Zen</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 text-sm text-gray-300">
          <a
            href="#features"
            className="hover:text-cyan-400 transition"
          >
            Features
          </a>

          <a
            href="#templates"
            className="hover:text-cyan-400 transition"
          >
            Templates
          </a>

          <a
            href="#pricing"
            className="hover:text-cyan-400 transition"
          >
            Pricing
          </a>

          <a
            href="#faq"
            className="hover:text-cyan-400 transition"
          >
            FAQ
          </a>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-20 py-24 lg:py-32 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm mb-8 backdrop-blur-md">
            ⚡ Launch your portfolio in minutes
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8">
            Build Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              Developer Presence
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mb-10">
            Create stunning portfolio websites with custom usernames,
            projects, skills, achievements, certifications and modern
            developer templates — all without writing code.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5 mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
            >
              Create Portfolio
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
              Live Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {[
              {
                number: "10K+",
                label: "Developers",
              },
              {
                number: "25K+",
                label: "Portfolios",
              },
              {
                number: "99%",
                label: "Responsive",
              },
            ].map((item) => (
              <div key={item.label}>
                <h3 className="text-3xl font-bold text-cyan-400">
                  {item.number}
                </h3>

                <p className="text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* URL Preview */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl max-w-xl hover:border-cyan-500/30 transition-all">
            <p className="text-sm text-gray-400 mb-3">
              Your custom portfolio URL
            </p>

            <div className="flex items-center gap-2 text-lg font-mono">
              <span className="text-gray-500">
                portzen.in/
              </span>

              <span className="text-cyan-400">
                murari
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full"></div>

          {/* Main Card */}
          <div className="relative bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl">
            {/* Profile */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-bold">
                M
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Murari Tripathi
                </h2>

                <p className="text-cyan-400">
                  Full Stack Developer
                </p>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-5">
              {/* Projects */}
              <div className="bg-black/30 rounded-3xl border border-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-300 font-medium">
                    Featured Projects
                  </p>

                  <span className="text-xs text-cyan-400">
                    12 Projects
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/10 border border-white/5"></div>

                  <div className="h-28 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/10 border border-white/5"></div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-black/30 rounded-3xl border border-white/5 p-5">
                <p className="text-gray-300 font-medium mb-4">
                  Skills
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    "React",
                    "Node.js",
                    "Firebase",
                    "MongoDB",
                    "Express",
                    "Tailwind",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-cyan-400 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 p-6">
                <h3 className="text-xl font-semibold mb-3">
                  ✨ One Click Portfolio
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  Build your online developer identity with a
                  modern customizable portfolio and unique URL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 px-6 lg:px-20 py-24 border-t border-white/10"
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Powerful Features
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Everything developers need to create a stunning
            online presence and showcase their skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Custom Username",
              desc: "Create your own unique portfolio link instantly.",
            },
            {
              title: "Project Showcase",
              desc: "Display projects with cover images and live demos.",
            },
            {
              title: "Modern Templates",
              desc: "Developer focused responsive portfolio designs.",
            },
            {
              title: "Admin Dashboard",
              desc: "Manage users, analytics and premium plans.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-cyan-500/30 hover:-translate-y-3 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
                ⚡
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {item.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-20 py-24">
        <div className="rounded-[3rem] border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-14 text-center backdrop-blur-2xl">
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Start Building Today
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Join developers creating modern portfolio websites
            with PortZen.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-2xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >
            Launch Your Portfolio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-gray-500 text-sm">
        <p>
          © 2026 PortZen. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="#"
            className="hover:text-cyan-400 transition"
          >
            Privacy
          </a>

          <a
            href="#"
            className="hover:text-cyan-400 transition"
          >
            Terms
          </a>

          <a
            href="#"
            className="hover:text-cyan-400 transition"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}