import Link from "next/link";

const CONTACT_EMAIL = "contato@patobranco.tec.br";
const CONTACT_PHONE_LABEL = "+55 46 3220-6080";
const CONTACT_PHONE_HREF = "tel:+554632206080";

const legalLinks = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Serviço", href: "/termos-de-servico" },
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-cello-800 text-zircon">
      <div className="section-default mt-8 mb-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:text-left">
          <section aria-labelledby="footer-contatos">
            <h2 id="footer-contatos" className="mb-3 text-lg font-semibold">
              Contatos
            </h2>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline-offset-4 hover:underline focus-visible:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="underline-offset-4 hover:underline focus-visible:underline"
                >
                  {CONTACT_PHONE_LABEL}
                </a>
              </li>
            </ul>
          </section>

          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="mb-3 text-lg font-semibold">
              Informações legais
            </h2>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="underline-offset-4 hover:underline focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="border-t border-zircon/20 pt-6 text-center">
          Todos os direitos reservados, 2026 Secretaria de Ciência, Tecnologia
          e Inovação de Pato Branco - PR
        </p>
      </div>
    </footer>
  );
};

export default Footer;