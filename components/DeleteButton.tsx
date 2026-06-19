'use client';

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form className="inline" action={action}>
      <button
        type="submit"
        className="text-xs font-medium hover:underline transition"
        style={{ color: 'var(--red)' }}
        onClick={e => { if (!confirm('Delete this product?')) e.preventDefault(); }}
      >
        Delete
      </button>
    </form>
  );
}
