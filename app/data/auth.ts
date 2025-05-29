import { cache } from "react";
import { cookies } from "next/headers";
import { User } from "./types";

// Cached helper methods makes it easy to get the same value in many places
// without manually passing it around. This discourages passing it from Server
// Component to Server Component which minimizes risk of passing it to a Client
// Component.
export const getCurrentUser = cache(async () => {
  const userCookie = (await cookies()).get("user");
  const idToken = (await cookies()).get("IdToken");

  if (!userCookie || !idToken) {
    return null;
  }

  const decodedUser = JSON.parse(atob(userCookie.value));
  const decodedModules = JSON.parse(atob(idToken.value.split(".")[1]))[
    "cognito:groups"
  ];

  // Don't include secret tokens or private information as public fields.
  // Use classes to avoid accidentally passing the whole object to the client.
  const user = decodedUser as User;
  user.modules = decodedModules;
  return user;
});
