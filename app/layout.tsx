"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import Header from "client/components/Header";
import { usePathname } from "next/navigation";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import Home from "./page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isUserSigned, setIsUserSigned] = useState(Boolean(getSignedInUserId()));
  const [showHomepage, setShowHomepage] = useState(false);
  const pathname = usePathname();
  const showHomepageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (
      !isUserSigned &&
      pathname != "/" &&
      pathname != "/signin" &&
      !showHomepageTimeoutRef.current
    ) {
      showHomepageTimeoutRef.current = setTimeout(() => {
        setShowHomepage(true);
      }, 1500);
    }
    if (isUserSigned || pathname == "/" || pathname == "/signin") {
      if (showHomepageTimeoutRef.current) clearTimeout(showHomepageTimeoutRef.current);
      setShowHomepage(false);
    }
  }, [isUserSigned, pathname]);

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
        {showHomepage ? <Home /> : children}
      </body>
    </html>
  );
}
