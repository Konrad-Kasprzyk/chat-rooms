"use client";

import { listenSignedInUserIdChanges } from "client/api/user/signedInUserId.utils";
import Header from "client/components/Header";
import { usePathname } from "next/navigation";
import { Subscription } from "rxjs";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

let signedInUserIdChangesSubscription: Subscription | null = null;

function redirectToLoginIfNotAuthenticated(currentPath: string) {
  // if (getSignedInUserId() == null && currentPath != "/" && currentPath != "/login")
  //   redirect("/login");
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (signedInUserIdChangesSubscription) signedInUserIdChangesSubscription.unsubscribe();
  signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe(() => {
    redirectToLoginIfNotAuthenticated(pathname);
  });
  redirectToLoginIfNotAuthenticated(pathname);

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
