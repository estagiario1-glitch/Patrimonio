// app/sem-acesso/page.tsx
export default function SemAcessoPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Acesso restrito</h1>
        <p className="text-sm text-gray-500">
          Sua conta não possui uma localização configurada. Entre em contato com um
          administrador para liberar o acesso.
        </p>
      </div>
    </main>
  );
}