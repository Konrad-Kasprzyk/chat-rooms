import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function linkHandler(
  path: string,
  push: (href: string, options?: NavigateOptions | undefined) => void
) {
  return (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button === 0) {
      e.preventDefault();
      push(path);
    }
  };
}
