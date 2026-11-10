import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="stack">
      <h1>Welcome to {SITE_NAME}</h1>
      <p className="max-w-prose">
        This app works with screen readers, keyboards and your own display settings. Create an account
        and your preferences follow you to every device.
      </p>
      <ul className="max-w-prose list-disc pl-6">
        <li>Every control has a clear label and can be reached with the keyboard.</li>
        <li>Change text size, contrast and motion in your profile.</li>
        <li>Optional read-aloud for people who don&rsquo;t use a screen reader.</li>
      </ul>
      <p className="flex flex-wrap gap-3">
        <Link href="/signup" className="btn btn-primary">Create an account</Link>
        <Link href="/login" className="btn">Log in</Link>
      </p>
    </div>
  );
}
