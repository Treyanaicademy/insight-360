/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AuthActionResponse,AuthProvider } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";
import { disableAutoLogin, enableAutoLogin } from "@/hooks";

import { API_BASE_URL, API_URL, client, dataProvider } from "./data";

export const emails = [
  "dubthea@gmail.com",
  "jim.halpert@dundermifflin.com",
  "pam.beesly@dundermifflin.com",
  "dwight.schrute@dundermifflin.com",
  "angela.martin@dundermifflin.com",
  "stanley.hudson@dundermifflin.com",
  "phyllis.smith@dundermifflin.com",
  "kevin.malone@dundermifflin.com",
  "oscar.martinez@dundermifflin.com",
  "creed.bratton@dundermifflin.com",
  "meredith.palmer@dundermifflin.com",
  "ryan.howard@dundermifflin.com",
  "kelly.kapoor@dundermifflin.com",
  "andy.bernard@dundermifflin.com",
  "toby.flenderson@dundermifflin.com",
];

const randomEmail = emails[Math.floor(Math.random() * emails.length)];

export const demoCredentials = {
  email: randomEmail,
  password: "demodemo",
};

// Define the type for the login parameters
interface LoginParams {
  email?: string;
  providerName?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const authProvider: AuthProvider = {
  login: async ({ email, providerName, accessToken, refreshToken }: LoginParams): Promise<AuthActionResponse> => {
    if (accessToken && refreshToken) {
      client.setHeaders({
        Authorization: `Bearer ${accessToken}`,
      });

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      return {
        success: true,
        redirectTo: "/",
      };
    }

    if (providerName) {
      window.location.href = `${API_BASE_URL}/auth/${providerName}`;

      return {
        success: true,
      };
    }

    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                      refreshToken
                    }
                  }
                `,
        },
      });

      client.setHeaders({
        Authorization: `Bearer ${data.login.accessToken}`,
      });

      enableAutoLogin(email as string);  // Type assertion since email could be undefined
      localStorage.setItem("access_token", data.login.accessToken);
      localStorage.setItem("refresh_token", data.login.refreshToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: error.name,
          },
        };
      } else {
        return {
          success: false,
          error: {
            message: "Login failed",
            name: "Unknown error",
          },
        };
      }
    }
  },
  register: async ({ email, password }: { email: string; password: string }) => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password },
          rawQuery: `
                mutation register($email: String!, $password: String!) {
                    register(registerInput: {
                      email: $email
                      password: $password
                    }) {
                        id
                        email
                    }
                  }
                `,
        },
      });

      enableAutoLogin(email);

      return {
        success: true,
        redirectTo: `/login?email=${email}`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          error: {
            message: error.message,
            name: error.name,
          },
        };
      } else {
        return {
          success: false,
          error: {
            message: "Register failed",
            name: "Unknown error",
          },
        };
      }
    }
  },
  logout: async () => {
    client.setHeaders({
      Authorization: "",
    });

    disableAutoLogin();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error?.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                          name
                        }
                      }
                `,
        },
      });

      return {
        authenticated: true,
      };
    } catch (error: unknown) {
      return {
        authenticated: false,
      };
    }
  },
  forgotPassword: async () => {
    return {
      success: true,
      redirectTo: "/update-password",
    };
  },
  updatePassword: async () => {
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    try {
      const { data } = await dataProvider.custom<{ me: User }>({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                            id,
                            name,
                            email,
                            phone,
                            jobTitle,
                            timezone,
                            avatarUrl
                        }
                      }
                `,
        },
      });

      return data.me;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return undefined;
    }
  },
};
