"use client";

import { useEffect, useState } from "react";

// Always-present live regions. Other components call announce() from "@/lib/announce".
export default function LiveRegions() {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");

  useEffect(() => {
    function onAnnounce(event) {
      const { message, assertive: urgent } = event.detail;
      const set = urgent ? setAssertive : setPolite;
      set(""); // clear first so repeating the same message is announced again
      setTimeout(() => set(message), 50);
    }
    window.addEventListener("app:announce", onAnnounce);
    return () => window.removeEventListener("app:announce", onAnnounce);
  }, []);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{polite}</div>
      <div className="sr-only" role="alert" aria-atomic="true">{assertive}</div>
    </>
  );
}
