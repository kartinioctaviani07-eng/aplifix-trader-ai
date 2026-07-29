type ButtonProps = {
    children: React.ReactNode;
  };
  
  export default function Button({ children }: ButtonProps) {
    return (
      <button className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-600">
        {children}
      </button>
    );
  }