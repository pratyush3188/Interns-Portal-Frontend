import { useAuthStore, defaultProfiles } from '../store/useAuthStore';

export const apiFetch = async (url, options) => {
  if (url === '/api/auth/login') {
    const { email, password } = options.body;
    
    if (email && password) {
      let userProfile = defaultProfiles.intern;
      if (email === "faculty@iaeste.org") {
        userProfile = defaultProfiles.faculty;
      } else if (email === "admin@iaeste.org") {
        userProfile = defaultProfiles.admin;
      }

      return {
        token: "mock-jwt-token-12345",
        user: userProfile
      };
    }
    throw new Error("Invalid credentials");
  }
  return {};
};

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  useAuthStore.getState().login(user);
};

