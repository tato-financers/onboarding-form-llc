import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Formulario de Incorporación de Compañias en EE.UU.",
  description: "Formulario de solicitud para incorporación de empresas",
  generator: "v0.app",
}

// Flag para activar/desactivar GTM
const ENABLE_GTM = false

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-T4LQMR3J"

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="Favicon.svg" />
        {ENABLE_GTM && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {ENABLE_GTM && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}