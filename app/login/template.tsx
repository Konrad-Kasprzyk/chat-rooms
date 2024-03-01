"use client";

import { getSignedInUserId } from "client/api/user/signedInUserId.utils";
import { usePathname } from "next/navigation";

// import { getSignedInUserId } from "client/api/user/signedInUserId.utils";

// import { redirect, usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (getSignedInUserId() === null) {
    console.log("bar");
  }

  return (
    <div>
      <div>Nested Template</div>
      {children}
    </div>
  );
}
