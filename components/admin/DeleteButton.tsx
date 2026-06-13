'use client';

import { useFormStatus } from 'react-dom';

export function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => { if (!confirm('Delete this item? This cannot be undone.')) e.preventDefault(); }}
      className="px-4 py-1.5 rounded-lg border border-red-300 text-red-600 text-sm font-body hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
