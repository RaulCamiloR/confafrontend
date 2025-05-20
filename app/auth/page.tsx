import React from "react";
import LoginComponent from "@/components/Login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  if ((await cookies()).has("IdToken")) {
    redirect("/");
  }

  return <LoginComponent />;
};

export default AuthPage;

