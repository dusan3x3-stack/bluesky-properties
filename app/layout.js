export const metadata = {
  title: 'Blue Sky Properties',
  description: 'Nekretnine i Estitor API integracija',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bs">
      <body>{children}</body>
    </html>
  );
}
