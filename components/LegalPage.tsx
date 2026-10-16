import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

const LegalPage = ({ title, updatedAt, children }: LegalPageProps) => {
  return (
    <main className="section-default my-12">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm opacity-70">
            Última atualização: {updatedAt}
          </p>
        </header>

        <div
          className="
            leading-relaxed
            [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold
            [&_p]:mb-4
            [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
            [&_a]:underline [&_a]:underline-offset-4
          "
        >
          {children}
        </div>
      </article>
    </main>
  );
};

export default LegalPage;