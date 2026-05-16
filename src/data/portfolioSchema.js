export const reservedUsernames = ["admin", "api", "support", "login", "signup"];

export const sectionTypes = [
  "Hero",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Certifications",
  "Achievements",
  "Resume",
  "Contact",
  "Testimonials",
  "Tech Stack",
  "Open Source",
  "Blogs",
  "YouTube",
  "Custom",
];

export const templates = [
  {
    id: "modern",
    name: "Modern Developer",
    description: "Dark neon layout with animated surfaces and project-first sections.",
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
  template: "modern",
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
  analytics: {
    views: 0,
    bookmarks: 0,
    clicks: 0,
  },
  sections: [
    {
      id: "hero",
      type: "Hero",
      title: "Hero",
      data: {
        cta: "View Projects",
        location: "India",
      },
    },
    {
      id: "about",
      type: "About",
      title: "About",
      data: {
        text:
          "I design and ship full stack web products, from auth and dashboards to public portfolio experiences.",
      },
    },
    {
      id: "skills",
      type: "Skills",
      title: "Skills",
      data: {
        items: ["React", "Node.js", "Firebase", "Firestore", "Express", "MongoDB", "Tailwind CSS"],
      },
    },
    {
      id: "projects",
      type: "Projects",
      title: "Featured Projects",
      data: {
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
      title: "Experience",
      data: {
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
      id: "custom-win",
      type: "Custom",
      title: "Highlights",
      data: {
        components: [
          {
            id: "c1",
            componentType: "customCard",
            props: {
              title: "Hackathon Winner",
              description: "Won SIH 2026 with a developer automation product.",
              color: "cyan",
            },
          },
          {
            id: "c2",
            componentType: "stats",
            props: {
              label: "Open source contributions",
              value: "48",
            },
          },
        ],
      },
    },
    {
      id: "stories",
      type: "Blogs",
      title: "Developer Stories",
      data: {},
    },
    {
      id: "contact",
      type: "Contact",
      title: "Contact",
      data: {
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
