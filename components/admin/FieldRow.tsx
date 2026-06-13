import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

const base =
  'w-full rounded-lg border border-primary/30 px-3 py-2 font-body text-sm bg-bg focus:outline-none focus:border-primary';

export function InputField({ label, name, ...rest }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs text-text-muted font-body font-medium uppercase tracking-wider">
        {label}
      </label>
      <input id={name} name={name} className={base} {...rest} />
    </div>
  );
}

export function TextareaField({ label, name, rows = 4, ...rest }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs text-text-muted font-body font-medium uppercase tracking-wider">
        {label}
      </label>
      <textarea id={name} name={name} rows={rows} className={base} {...rest} />
    </div>
  );
}
