import { create } from "zustand";

export const defaultProfiles = {
  intern: {
    id: "int-1",
    name: "Sophia Müller",
    role: "intern",
    country: "Germany",
    university: "Technical University of Munich (TUM)",
    duration: "12 Weeks",
    startDate: "2026-06-01",
    endDate: "2026-08-24",
    projectTitle: "Smart Water Quality Monitoring using IoT and Machine Learning",
    department: "Computer Science & Engineering",
    supervisor: "Dr. Alok Kumar",
    avatarUrl: "",
    email: "sophia.mueller@tum.de",
    skills: ["React", "Python", "IoT", "Machine Learning", "Data Analysis"],
    languages: ["German (Native)", "English (Fluent)", "Hindi (Basic)"]
  },
  faculty: {
    id: "fac-1",
    name: "Dr. Michael Schneider",
    role: "faculty",
    department: "Computer Science & Engineering",
    designation: "Professor & Lab Director",
    avatarUrl: "",
    email: "faculty@iaeste.org"
  },
  admin: {
    id: "adm-1",
    name: "IAESTE Coordinator",
    role: "admin",
    department: "International Relations Cell",
    designation: "Chief Administrative Officer",
    avatarUrl: "",
    email: "admin@iaeste.org"
  }
};

export const useAuthStore = create((set) => ({
  user: defaultProfiles.intern, // Default is intern
  isAuthenticated: true, // Auto-authenticate for immediate access
  login: (user) => set({ user: user || defaultProfiles.intern, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

