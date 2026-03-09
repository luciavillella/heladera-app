import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import "./globals.css";
export const metadata = {
  title: "Qué Cocino Today",
  description: "Sacá una foto a tu heladera y recibí 3 recetas personalizadas con IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Qué Cocino Today",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#B85C2A",
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: '#B85C2A',
          colorBackground: '#FDFAF4',
          colorInputBackground: '#F5F0E8',
          colorInputText: '#1E1A14',
          colorText: '#1E1A14',
          colorTextSecondary: '#7A7060',
          colorDanger: '#DC2626',
          borderRadius: '12px',
          fontFamily: "'Outfit', sans-serif",
        },
        elements: {
          card: {
            boxShadow: '0 8px 40px rgba(30,26,20,0.13)',
            border: '1px solid #E2D9C8',
            borderRadius: '24px',
            backgroundColor: '#FDFAF4',
          },
          headerTitle: {
            fontFamily: "'Lora', serif",
            fontSize: '26px',
            fontWeight: '600',
            color: '#1E1A14',
          },
          headerSubtitle: {
            color: '#7A7060',
            fontSize: '14px',
          },
          formButtonPrimary: {
            background: 'linear-gradient(135deg, #B85C2A, #D4884E)',
            boxShadow: '0 4px 16px rgba(184,92,42,0.3)',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: "'Outfit', sans-serif",
            '&:hover': {
              background: 'linear-gradient(135deg, #D4884E, #B85C2A)',
            },
          },
          formFieldInput: {
            border: '1.5px solid #E2D9C8',
            backgroundColor: '#F5F0E8',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
            color: '#1E1A14',
            '&:focus': {
              borderColor: '#B85C2A',
            },
          },
          footerActionLink: {
            color: '#B85C2A',
            fontWeight: '600',
          },
          identityPreviewEditButton: {
            color: '#B85C2A',
          },
          rootBox: {
            width: '100%',
          },
        },
      }}
    >
      <html lang="es">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-192-naranja.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Qué Cocino Today" />
        </head>
        <body>
          {children}
          <script dangerouslySetInnerHTML={{__html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}} />
        </body>
      </html>
    </ClerkProvider>
  )
}
