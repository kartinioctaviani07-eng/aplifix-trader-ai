type LayoutProps = {
    children: React.ReactNode;
  };
  
  export default function Layout({ children }: LayoutProps) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {children}
      </div>
    );
  }