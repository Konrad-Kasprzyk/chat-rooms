"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import Header from "client/components/Header";
import { redirect, usePathname } from "next/navigation";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

function redirectIfNotAuthenticated(currentPath: string, isUserSigned: boolean) {
  if (!isUserSigned && currentPath != "/" && currentPath != "/login" && currentPath != "/signup")
    redirect("/");
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  redirectIfNotAuthenticated(pathname, Boolean(getSignedInUserId()));

  useEffect(() => {
    const signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe((userId) => {
      redirectIfNotAuthenticated(pathname, Boolean(userId));
    });
    return () => {
      signedInUserIdChangesSubscription.unsubscribe();
    };
  }, [pathname]);

  return (
    <html lang="en" data-bs-theme="light">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
