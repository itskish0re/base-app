/** Inline error list for DataTable until global notifier (e.g. Sonner) is added. */

export type DtErrorsProps = {
  messages: string[];
  title?: string;
};

export function DtErrors({ messages, title = 'Something went wrong' }: DtErrorsProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <p className="font-medium">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
