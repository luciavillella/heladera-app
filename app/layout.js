import "./globals.css";

export const metadata = {
  title: "Y Ahora Qué Cocino?",
  description: "Sacá una foto a tu heladera y recibí 3 recetas personalizadas con IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Y Ahora Qué Cocino?",
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
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Y Ahora Qué Cocino?" />
      </head>
      <body>{children}</body>
    </html>
  );
}