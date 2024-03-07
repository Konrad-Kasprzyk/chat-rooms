"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import Header from "client/components/Header";
import { usePathname } from "next/navigation";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { useCallback, useEffect, useState } from "react";
import SignIn from "./signin/page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isUserSigned, setIsUserSigned] = useState(Boolean(getSignedInUserId()));
  const pathname = usePathname();

  const showSignInPage = useCallback(
    () => !isUserSigned && pathname != "/" && pathname != "/signin",
    [isUserSigned, pathname]
  );

  useEffect(() => {
    const signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe((userId) =>
      setIsUserSigned(Boolean(userId))
    );
    return () => signedInUserIdChangesSubscription.unsubscribe();
  }, []);

  return (
    <html lang="en" data-bs-theme="light">
      <head />
      <body>
        <Header />
        {showSignInPage() ? <SignIn /> : children}
      </body>
    </html>
  );
}
