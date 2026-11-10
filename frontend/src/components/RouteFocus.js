"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// After client-side navigation, move focus to the page's <h1> so keyboard and screen-reader
// users start at the top of the new page instead of staying on the link they clicked.
export default function RouteFocus() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const heading = document.querySelector("main h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }, [pathname]);

  return null;
}
