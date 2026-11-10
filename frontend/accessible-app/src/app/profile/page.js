import { Suspense } from "react";
import ProfileForm from "@/components/ProfileForm";
import { requireUser } from "@/lib/dal";

export const metadata = { title: "Your profile" };

async function ProfileContent() {
  const user = await requireUser();
  return <ProfileForm user={{ name: user.name, email: user.email, profile: user.profile }} />;
}

// The <h1> stays outside <Suspense> so it's in the static shell and is there for focus management.
export default function ProfilePage() {
  return (
    <div className="stack max-w-prose">
      <h1>Your profile</h1>
      <Suspense fallback={<p role="status">Loading your profile…</p>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
