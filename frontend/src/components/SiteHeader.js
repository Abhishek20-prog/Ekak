import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";
import { SITE_NAME } from "@/lib/site";
import NavLink from "./NavLink";
import ReadAloud from "./ReadAloud";

// Reads the session, so it must sit inside <Suspense> (Cache Components).
async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <NavLink href="/login">Log in</NavLink>
        <NavLink href="/signup">Sign up</NavLink>
      </>
    );
  }
  return (
    <>
      <NavLink href="/profile">Profile</NavLink>
      <form action={logout}>
        <button type="submit" className="btn">Log out</button>
      </form>
    </>
  );
}

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="brand">{SITE_NAME}</Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <NavLink href="/">Home</NavLink>
          <Suspense fallback={null}>
            <AccountLinks />
          </Suspense>
          <ReadAloud />
        </nav>
      </div>
    </header>
  );
}
