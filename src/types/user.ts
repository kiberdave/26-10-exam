// The educational login is a local simulation: nothing is sent to a server
// and the password is never stored.

export interface AuthUser {
  username: string;
  // Profile fields (FULL) — empty strings until the user fills the Profile form
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

// Utility type: the editable part of AuthUser (everything except username)
export type ProfileFormValues = Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">;
