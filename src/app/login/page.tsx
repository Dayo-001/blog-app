import React, { Suspense } from "react";
import AuthCard from "../auth/AuthCard";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthCard />
      </Suspense>
    </div>
  );
};

export default LoginPage;
