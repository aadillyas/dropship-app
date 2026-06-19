'use client';

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form className="inline" action={action}>
      <button
        type="submit"
        className="text-red-500 hover:underline"
        onClick={e => { if (!confirm('Delete this product?')) e.preventDefault(); }}
      >
        Delete
      </button>
    </form>
  );
}
