// export const httpClient = () => {
//   const { token } = JSON.parse(localStorage.getItem("auth")) || {};
//   return { Authorization: `Bearer ${token}` };
// };
import type { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL;

interface Auth {
  token?: string;
}

export const httpClient = (): { Authorization: string } => {
  const auth = localStorage.getItem("auth");
  const { token }: Auth = auth ? JSON.parse(auth) : {};
  return { Authorization: `Bearer ${token}` };
};

interface LoginParams {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  [key: string]: any;
}

interface Identity {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authProvider: AuthProvider = {
  // authentication
  login: async ({ username, password }: LoginParams): Promise<void> => {
    const request = new Request(`${API_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify({ username: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
      const response = await fetch(request);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      const auth: AuthResponse = await response.json();
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...auth, fullName: username }),
      );
    } catch {
      throw new Error("Network error");
    }
  },

  checkError: (error: { status: number }): Promise<void> => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },

  checkAuth: (): Promise<void> =>
    localStorage.getItem("auth")
      ? Promise.resolve()
      : Promise.reject({ message: "login required" }),

  logout: (): Promise<void> => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },

  getIdentity: async (): Promise<Identity> => {
    try {
      const auth = localStorage.getItem("auth");
      const { id, username, email, role, avatar }: Identity = auth
        ? JSON.parse(auth)
        : {};
      return { id, username, email, role, avatar };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getPermissions: (): Promise<void> => Promise.resolve(),
};

// export const authProvider = {
//   // authentication
//   login: async ({ username, password }: LoginParams): Promise<void> => {
//     const request = new Request(
//       `${process.env.REACT_APP_API_URL}/users/login`,
//       {
//         method: "POST",
//         body: JSON.stringify({ email: username, password }),
//         headers: new Headers({ "Content-Type": "application/json" }),
//       },
//     );

//     try {
//       const response = await fetch(request);
//       if (response.status < 200 || response.status >= 300) {
//         throw new Error(response.statusText);
//       }
//       const auth: AuthResponse = await response.json();
//       localStorage.setItem(
//         "auth",
//         JSON.stringify({ ...auth, fullName: username }),
//       );
//     } catch {
//       throw new Error("Network error");
//     }
//   },

//   checkError: (error: { status: number }): Promise<void> => {
//     const status = error.status;
//     if (status === 401 || status === 403) {
//       localStorage.removeItem("auth");
//       return Promise.reject();
//     }
//     // other error code (404, 500, etc): no need to log out
//     return Promise.resolve();
//   },

//   checkAuth: (): Promise<void> =>
//     localStorage.getItem("auth")
//       ? Promise.resolve()
//       : Promise.reject({ message: "login required" }),

//   logout: (): Promise<void> => {
//     localStorage.removeItem("auth");
//     return Promise.resolve();
//   },

//   getIdentity: async (): Promise<Identity> => {
//     try {
//       const auth = localStorage.getItem("auth");
//       const { id, fullName, avatar }: Identity = auth ? JSON.parse(auth) : {};
//       return { id, fullName, avatar };
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   },

//   getPermissions: (): Promise<void> => Promise.resolve(),
// };
