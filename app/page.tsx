import React from "react";
import HomeComponent from "./components/HomeComponent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
  if (!(await cookies()).has("IdToken")) {
    redirect("/auth");
  }

  return <HomeComponent />;
};

export default HomePage;


