import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description:
    "Condições de uso do sistema de patrimônio da Secretaria de Ciência, Tecnologia e Inovação de Pato Branco - PR.",
};

export default function TermosDeServicoPage() {
  return (
    <LegalPage title="Termos de Serviço" updatedAt="15 de outubro de 2026">
      <p>
        Estes Termos de Serviço definem as regras de uso do sistema de gestão
        de patrimônio da Secretaria de Ciência, Tecnologia e Inovação de Pato
        Branco - PR. Ao acessar ou usar o sistema, você concorda com estas
        condições. Se não concordar, não utilize o sistema.
      </p>

      <h2>1. O que é o sistema</h2>
      <p>
        O sistema permite cadastrar, consultar e acompanhar os itens do
        patrimônio público sob responsabilidade da Secretaria, incluindo sua
        localização e o histórico de movimentações.
      </p>

      <h2>2. Acesso e cadastro</h2>
      <ul>
        <li>O acesso é feito através de um cadastro criado no sistema ou com uma conta Google.</li>
        <li>
          Novos usuários passam por aprovação antes de usar o sistema. Até a
          aprovação, o acesso fica limitado.
        </li>
        <li>
          Cada usuário recebe um perfil de acesso (por exemplo,
          administrador, visualizador ou sala), que define o que pode ver e
          fazer.
        </li>
        <li>
          A Secretaria pode conceder, alterar ou revogar o acesso a qualquer
          momento, de acordo com a necessidade do serviço.
        </li>
      </ul>

      <h2>3. Responsabilidades do usuário</h2>
      <ul>
        <li>Manter sua conta segura e não compartilhar o acesso com terceiros.</li>
        <li>Informar dados verdadeiros e atualizados.</li>
        <li>Registrar corretamente as informações sobre os itens do patrimônio.</li>
        <li>Avisar a Secretaria caso suspeite de uso indevido da sua conta.</li>
      </ul>

      <h2>4. Uso permitido</h2>
      <p>É proibido:</p>
      <ul>
        <li>usar o sistema para fins diferentes dos institucionais;</li>
        <li>tentar acessar áreas, contas ou dados sem autorização;</li>
        <li>alterar, apagar ou inserir registros de forma indevida ou de má-fé;</li>
        <li>interferir no funcionamento do sistema, como por meio de ataques, testes de invasão não autorizados ou sobrecarga intencional;</li>
        <li>copiar ou divulgar dados do sistema sem autorização.</li>
      </ul>
      <p>
        O descumprimento pode levar à suspensão do acesso, sem prejuízo das
        medidas administrativas, civis e penais cabíveis.
      </p>

      <h2>5. Registros e auditoria</h2>
      <p>
        As ações realizadas no sistema são registradas para fins de controle,
        segurança e transparência. Esses registros podem ser usados para
        apurar irregularidades.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        O sistema, seu código, identidade visual e conteúdos pertencem à
        Secretaria ou são usados com autorização. O uso do sistema não
        transfere ao usuário nenhum direito de propriedade sobre eles.
      </p>

      <h2>7. Disponibilidade</h2>
      <p>
        Trabalhamos para manter o sistema disponível, mas ele pode ficar
        indisponível por manutenção, atualizações ou problemas técnicos fora
        do nosso controle. Não garantimos funcionamento ininterrupto.
      </p>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        A Secretaria não se responsabiliza por danos decorrentes de uso
        indevido do sistema, de falhas na conta Google do usuário, de
        informações incorretas inseridas pelos usuários ou de eventos fora do
        seu controle razoável, na medida permitida pela lei.
      </p>

      <h2>9. Privacidade</h2>
      <p>
        O tratamento de dados pessoais é explicado na nossa{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>

      <h2>10. Alterações nos termos</h2>
      <p>
        Podemos atualizar estes termos a qualquer momento. A data da última
        atualização fica no topo da página. Continuar usando o sistema depois
        de uma alteração significa que você aceita a nova versão.
      </p>

      <h2>11. Lei aplicável e foro</h2>
      <p>
        Estes termos são regidos pela legislação brasileira. Fica eleito o
        foro da Comarca de Pato Branco - PR para resolver questões
        relacionadas a eles.
      </p>

      <h2>12. Contato</h2>
      <ul>
        <li>
          E-mail:{" "}
          <a href="mailto:contato@patobranco.tec.br">
            contato@patobranco.tec.br
          </a>
        </li>
        <li>
          Telefone: <a href="tel:+554632206080">+55 46 3220-6080</a>
        </li>
      </ul>
    </LegalPage>
  );
}