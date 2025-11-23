import { authClient } from "@/src/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardPosts from "./_components/dashboard-posts";
import React from "react";

const DashboardPage = async () => {
  const requestHeaders = await headers();
  const session = await authClient.getSession({
    fetchOptions: {
      headers: requestHeaders,
    },
  });
  console.log(session);
  if (!session.data?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  return (
    <div className="space-y-8">
      <DashboardPosts userId={session.data.user.id} />
    </div>
  );
};
export default DashboardPage;
