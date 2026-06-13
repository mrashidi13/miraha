'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2 rounded-lg bg-accent text-white font-body text-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}
