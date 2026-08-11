import navItems from "@public/data/navItems.json";

const Footer = () => {
  const footerData = {
    "Links": navItems,
  };

  return (
    <footer className="mt-auto bg-cello-800 text-zircon">
      <div className="flex flex-col text-center section-default mb-8 gap-16 mt-8">
        <p>
          Todos os direitos reservados, 2026 Secretaria de Ciência,
          Tecnologia e Inovação de Pato Branco - PR
        </p>
      </div>
    </footer>
  );
};

export default Footer;
