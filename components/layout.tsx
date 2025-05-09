// components/Layout.tsx
import Header from "./Header"; // Asegúrate de tener Header creado


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
     
    </>
  );
}