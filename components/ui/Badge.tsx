type BadgeProps = {
    text: string;
  };
  
  export default function Badge({ text }: BadgeProps) {
    return (
      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
        {text}
      </span>
    );
  }