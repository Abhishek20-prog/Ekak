"use client";

import { useActionState, useEffect } from "react";
import { updateProfile } from "@/app/actions/profile";
import { applyPrefs } from "@/lib/a11y-client";
import ErrorSummary from "./ErrorSummary";
import { Check, Field } from "./Field";

const FONT_SIZES = [
  [100, "Standard"],
  [125, "Large (125%)"],
  [150, "Larger (150%)"],
  [175, "Extra large (175%)"],
  [200, "Largest (200%)"],
];
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const LABELS = {
  name: "Name", bio: "About you", location: "Location", locale: "Language",
  speechRate: "Speech speed", fontScale: "Text size",
};

export default function ProfileForm({ user }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const errors = state?.errors ?? {};
  const v = state?.values ?? { name: user.name, ...user.profile };

  // Apply new display settings right away after a successful save.
  useEffect(() => {
    if (state?.ok) applyPrefs(state.values);
  }, [state]);

  return (
    <form action={action} noValidate className="stack">
      <ErrorSummary state={state} labels={LABELS} />
      {/* Always rendered so screen readers pick up the change when text appears. */}
      <div role="status">{state?.ok && <p className="success">{state.message}</p>}</div>

      <p>Signed in as <strong>{user.email}</strong>.</p>

      <fieldset className="stack">
        <legend>About you</legend>
        <Field id="name" label="Name" required autoComplete="name" defaultValue={v.name} error={errors.name?.[0]} />
        <Field id="bio" as="textarea" label="About you" hint="Up to 500 characters." defaultValue={v.bio} error={errors.bio?.[0]} />
        <Field id="location" label="Location" autoComplete="address-level2" defaultValue={v.location} error={errors.location?.[0]} />
        <Field id="locale" as="select" label="Language" defaultValue={v.locale}
          hint="Saved to your profile. The interface text is not translated yet." error={errors.locale?.[0]}>
          <option value="en">English</option>
          <option value="hi" lang="hi">हिन्दी (Hindi)</option>
        </Field>
      </fieldset>

      <fieldset className="stack">
        <legend>Accessibility</legend>
        <Check id="screenReaderOptimized" label="I use a screen reader"
          hint="Turns off animations and hides the built-in read-aloud button so it doesn't compete with your screen reader."
          defaultChecked={v.screenReaderOptimized} />
        <Check id="readAloudEnabled" label="Show a “Read this page aloud” button"
          hint="For people who don't use a screen reader but find listening easier than reading."
          defaultChecked={v.readAloudEnabled} />
        <Field id="speechRate" as="select" label="Speech speed" defaultValue={String(v.speechRate)} error={errors.speechRate?.[0]}>
          {SPEEDS.map((s) => (
            <option key={s} value={s}>{s === 1 ? "Normal (1×)" : `${s}×`}</option>
          ))}
        </Field>
        <Field id="fontScale" as="select" label="Text size" defaultValue={String(v.fontScale)} error={errors.fontScale?.[0]}>
          {FONT_SIZES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Field>
        <Check id="highContrast" label="High contrast colours" hint="Black background, white and yellow text."
          defaultChecked={v.highContrast} />
        <Check id="reducedMotion" label="Reduce motion" hint="Turns off animations and transitions."
          defaultChecked={v.reducedMotion} />
      </fieldset>

      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>Save profile</button>
      </div>
      <p role="status" className="sr-only">{pending ? "Saving your profile, please wait." : ""}</p>
    </form>
  );
}
