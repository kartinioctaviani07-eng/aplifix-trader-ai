type InputProps = {
  label: string;
  placeholder?: string;
};

export default function Input({
  label,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />
    </div>
  );
}
