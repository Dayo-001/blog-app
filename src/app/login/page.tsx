import React from "react";
import AuthCard from "../auth/AuthCard";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthCard />
    </div>
  );
};

export default LoginPage;
