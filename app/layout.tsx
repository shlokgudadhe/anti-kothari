import "./globals.css";
export const metadata = { title: "Tally — shared expenses", description: "Settle up with your people." };
export default function Layout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
