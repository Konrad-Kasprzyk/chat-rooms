// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "client/components/Header";
import { cookies, headers } from "next/headers";
import styles from "./layout.module.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  let theme: "light" | "dark" = "light";
  if (themeCookie) {
    theme = themeCookie.value === "dark" ? "dark" : "light";
  } else {
    const headersList = headers();
    const themeFromHeader = headersList.get("sec-ch-prefers-color-scheme");
    theme = themeFromHeader === "dark" ? "dark" : "light";
  }

  return (
    <html lang="en" data-bs-theme={theme}>
      <head />
      <body className="vstack" style={{ height: "100vh" }}>
        <div className={`${styles.headerBackground} pt-1 pb-2 my-0`}>
          <Header serverTheme={theme} />
        </div>
        <main style={{ minHeight: "0" }}>{children}</main>
      </body>
    </html>
  );
}
