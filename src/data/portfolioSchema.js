export const reservedUsernames = ["admin", "dashboard", "login", "signup", "api", "settings", "portfolio", "support"];

export const sectionTypes = [
  "Hero",
  "About",
  "Projects",
  "Skills",
  "Experience",
  "Certifications",
  "Achievements",
  "Education",
  "Contact",
  "Social Links",
  "GitHub Stats",
  "User Stories",
  "CustomHTML",
];

export const templates = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Dark neon developer portfolio with animated futuristic cards.",
    accent: "#22d3ee",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean resume-style portfolio optimized for readability and recruiting.",
    accent: "#111827",
  },
  {
    id: "glass",
    name: "Glassmorphism",
    description: "Futuristic frosted UI with blur panels and luminous accents.",
    accent: "#a78bfa",
  },
];

export const themePresets = [
  {
    id: "midnight",
    name: "Midnight",
    accentColor: "#22d3ee",
    backgroundColor: "#09090b",
    textColor: "#f8fafc",
    surfaceColor: "#18181b",
    fontFamily: "Inter, system-ui, sans-serif",
    cornerRadius: 16,
  },
  {
    id: "studio",
    name: "Studio",
    accentColor: "#2563eb",
    backgroundColor: "#f8fafc",
    textColor: "#111827",
    surfaceColor: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
    cornerRadius: 10,
  },
  {
    id: "emerald",
    name: "Emerald",
    accentColor: "#10b981",
    backgroundColor: "#071311",
    textColor: "#ecfdf5",
    surfaceColor: "#10201c",
    fontFamily: "Georgia, serif",
    cornerRadius: 22,
  },
  {
    id: "editorial",
    name: "Editorial",
    accentColor: "#e11d48",
    backgroundColor: "#fff7ed",
    textColor: "#1c1917",
    surfaceColor: "#ffffff",
    fontFamily: "Georgia, serif",
    cornerRadius: 6,
  },
];

export const defaultPortfolio = {
  uid: "",
  username: "",
  displayName: "",
  headline: "",
  template: "cyberpunk",
  accentColor: "#22d3ee",
  theme: themePresets[0],
  profileImage: "",
  heroBanner: "",
  bio: "",
  summary:
    "",
  socials: {
    github: "",
    linkedin: "",
    website: "",
    email: "",
  },
  githubUsername: "",
  customCode: {
    enabled: false,
    html: "<main class=\"folio\">\n  <section>\n    <p class=\"eyebrow\">Custom portfolio</p>\n    <h1>Your Name</h1>\n    <p>Build a fully personalized portfolio with your own HTML and CSS.</p>\n  </section>\n</main>",
    css: "body {\n  margin: 0;\n  min-height: 100vh;\n  background: #050505;\n  color: #f8fafc;\n  font-family: Inter, system-ui, sans-serif;\n}\n\n.folio {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  padding: 48px;\n}\n\nsection {\n  max-width: 760px;\n}\n\n.eyebrow {\n  color: #22d3ee;\n  text-transform: uppercase;\n  letter-spacing: 0.18em;\n}\n\nh1 {\n  font-size: clamp(48px, 10vw, 120px);\n  line-height: 0.95;\n  margin: 16px 0;\n}\n\np {\n  font-size: 20px;\n  line-height: 1.7;\n}",
  },
  analytics: {
    views: 0,
    uniqueVisitors: 0,
    visits: 0,
    bookmarks: 0,
    clicks: 0,
  },
  sections: [
    {
      id: "hero",
      type: "Hero",
      visible: true,
      title: "Hero",
      props: {
        cta: "View Projects",
        location: "India",
      },
    },
    {
      id: "about",
      type: "About",
      visible: true,
      title: "About",
      props: {
        text:
          "I design and ship full stack web products, from auth and dashboards to public portfolio experiences.",
      },
    },
    {
      id: "skills",
      type: "Skills",
      visible: true,
      title: "Skills",
      props: {
        items: ["React", "Node.js", "Firebase", "Firestore", "Express", "MongoDB", "Tailwind CSS"],
      },
    },
    {
      id: "projects",
      type: "Projects",
      visible: true,
      title: "Featured Projects",
      props: {
        items: [
          {
            id: "p1",
            title: "PortZen",
            description: "Custom portfolio builder SaaS with live previews and dynamic sections.",
            techStack: ["React", "Firebase", "Express"],
            githubUrl: "https://github.com/",
            liveUrl: "https://portzen.in",
            coverImage: "",
            screenshots: [],
            featured: true,
          },
          {
            id: "p2",
            title: "Analytics Studio",
            description: "Realtime dashboard for SaaS metrics and user behavior.",
            techStack: ["React", "MongoDB", "Node.js"],
            githubUrl: "https://github.com/",
            liveUrl: "https://example.com",
            coverImage: "",
            screenshots: [],
            featured: false,
          },
        ],
      },
    },
    {
      id: "experience",
      type: "Experience",
      visible: true,
      title: "Experience",
      props: {
        items: [
          {
            role: "Full Stack Engineer",
            company: "Independent",
            period: "2024 - Present",
            summary: "Built SaaS dashboards, Firebase apps, and production React systems.",
          },
        ],
      },
    },
    {
      id: "github-stats",
      type: "GitHub Stats",
      visible: true,
      title: "GitHub Stats",
      props: {
        username: "",
      },
    },
    {
      id: "stories",
      type: "User Stories",
      visible: true,
      title: "Developer Stories",
      props: {},
    },
    {
      id: "contact",
      type: "Contact",
      visible: true,
      title: "Contact",
      props: {
        text: "Open to freelance SaaS builds, product engineering, and collaboration.",
      },
    },
  ],
  stories: [
    {
      id: "s1",
      text: "Currently learning distributed systems and building PortZen.",
      createdAt: new Date().toISOString(),
    },
  ],
};
