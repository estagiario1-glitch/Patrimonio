import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como a Secretaria de Ciência, Tecnologia e Inovação de Pato Branco - PR trata os dados pessoais neste sistema.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updatedAt="15 de outubro de 2026"
    >
      <p>
        Esta Política de Privacidade explica como a Secretaria de Ciência,
        Tecnologia e Inovação de Pato Branco - PR trata os dados pessoais de
        quem usa este sistema, em conformidade com a Lei Geral de Proteção de
        Dados Pessoais (Lei nº 13.709/2018 - LGPD).
      </p>

      <h2>1. Quem é o controlador dos dados</h2>
      <p>
        O controlador é a Secretaria de Ciência, Tecnologia e Inovação de Pato
        Branco - PR. Para falar sobre seus dados, use os contatos da seção 10.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Dados de login:</strong> nome, e-mail e foto de perfil da
          conta Google usada para entrar no sistema.
        </li>
        <li>
          <strong>Dados de acesso:</strong> perfil de acesso (como
          administrador, visualizador ou sala) e a localização à qual o usuário
          está vinculado.
        </li>
        <li>
          <strong>Dados de uso:</strong> registros das ações feitas no sistema,
          como cadastro, alteração e movimentação de itens do patrimônio.
        </li>
        <li>
          <strong>Dados técnicos:</strong> cookies de sessão e informações
          básicas de conexão, necessários para manter o login e proteger o
          sistema.
        </li>
      </ul>
      <p>Não coletamos dados pessoais sensíveis.</p>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>Identificar o usuário e liberar o acesso conforme seu perfil.</li>
        <li>Controlar e registrar o patrimônio público sob responsabilidade da Secretaria.</li>
        <li>Manter o histórico das ações realizadas, para auditoria e transparência.</li>
        <li>Garantir a segurança do sistema e prevenir acessos indevidos.</li>
        <li>Cumprir obrigações legais e regulatórias.</li>
      </ul>

      <h2>4. Base legal</h2>
      <p>
        O tratamento é feito para a execução de políticas públicas e o
        exercício das atribuições legais da Administração Pública, para o
        cumprimento de obrigação legal ou regulatória e, quando for o caso,
        com base no consentimento do titular (art. 7º da LGPD).
      </p>

      <h2>5. Com quem compartilhamos</h2>
      <p>Não vendemos dados pessoais. O compartilhamento ocorre apenas com:</p>
      <ul>
        <li>
          <strong>Google,</strong> como provedor do serviço de autenticação
          (login), conforme a política de privacidade do próprio Google.
        </li>
        <li>
          <strong>Provedores de infraestrutura</strong> (hospedagem e banco de
          dados) que operam o sistema em nosso nome.
        </li>
        <li>
          <strong>Órgãos públicos e autoridades,</strong> quando houver
          obrigação legal ou determinação judicial.
        </li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        Usamos cookies essenciais para manter sua sessão ativa e proteger o
        login. Eles são necessários para o funcionamento do sistema. Não
        usamos cookies de publicidade. Você pode apagar os cookies no
        navegador a qualquer momento, mas será necessário entrar novamente.
      </p>

      <h2>7. Armazenamento e segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas para proteger os dados
        contra acesso não autorizado, perda, alteração ou divulgação indevida,
        como conexão criptografada (HTTPS) e controle de acesso por perfil.
        Nenhum sistema é totalmente livre de riscos, e em caso de incidente
        relevante os envolvidos serão comunicados conforme a lei.
      </p>

      <h2>8. Por quanto tempo guardamos os dados</h2>
      <p>
        Mantemos os dados pelo tempo necessário para cumprir as finalidades
        descritas nesta política e as obrigações legais de guarda de registros
        da Administração Pública. Depois desse prazo, os dados são excluídos
        ou anonimizados.
      </p>

      <h2>9. Seus direitos</h2>
      <p>Nos termos do art. 18 da LGPD, você pode solicitar:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
        <li>informação sobre com quem seus dados são compartilhados;</li>
        <li>revogação do consentimento, quando o tratamento depender dele.</li>
      </ul>
      <p>
        Alguns pedidos podem ser limitados quando os dados precisarem ser
        mantidos por obrigação legal.
      </p>

      <h2>10. Contato</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas sobre esta política:
      </p>
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

      <h2>11. Alterações nesta política</h2>
      <p>
        Podemos atualizar esta política para refletir mudanças no sistema ou na
        legislação. A data da última atualização fica sempre no topo desta
        página.
      </p>
    </LegalPage>
  );
}