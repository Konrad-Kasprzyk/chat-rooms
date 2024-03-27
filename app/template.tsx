"use client";

import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CookiesProvider } from "react-cookie";
import Home from "./page";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
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

  return <CookiesProvider>{showHomepage ? <Home /> : children}</CookiesProvider>;
}
