import '@styles/globals.css';

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/common/scrolltotop";
import { Providers } from "@/components/providers";
import Script from 'next/script';

export const metadata = {
  icons: [{ rel: 'icon', type: 'image/png', url: '/assets/icons/brasao.png' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-[100dvh] relative">
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-8HJYXM0G6L" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8HJYXM0G6L');
            `,
          }}
        />

        <Providers>
          <Nav />
          <main className="bg-zircon-50 font-poppins pt-8 pb-16 flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}