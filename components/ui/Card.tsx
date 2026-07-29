type CardProps = {
    title: string;
    children: React.ReactNode;
  };
  
  export default function Card({ title, children }: CardProps) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {title}
        </h3>
  
        {children}
      </div>
    );
  }