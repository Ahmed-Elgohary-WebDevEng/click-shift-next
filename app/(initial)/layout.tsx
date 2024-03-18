const InitialLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-auth-pattern bg-cover bg-no-repeat flex items-center justify-center">
    {children}
  </main>
);

export default InitialLayout;
