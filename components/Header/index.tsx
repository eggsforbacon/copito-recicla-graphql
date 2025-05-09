"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Iconos para el menú hamburguesa

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isBuscador = pathname === '/buscador';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Término de búsqueda:", value); // Para depuración
  };

  // Definir los enlaces base
  const baseLinks = [
    { label: "Inicio", href: "/" },
    { label: "Galería", href: "/galeria" },
    { label: "Noticia", href: "/noticia" },
  ];

  // Todos los enlaces estarán en el menú desplegable en móviles
  const dropdownLinks = baseLinks;

  // Toggle para abrir/cerrar el menú desplegable
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-transparent py-4 flex items-center justify-between px-4 lg:px-12 fixed top-0 left-0 z-50">
      {/* Izquierda: Icono de Menú (móviles) y Buscador (escritorio) */}
      <div className="flex items-center gap-2 md:gap-4 px-2 md:px-10">
        {/* Icono de Menú Hamburguesa (móviles) */}
        <button onClick={toggleMenu} className="text-black lg:hidden">
          {isMenuOpen ? <X size={40} /> : <Menu size={50} />}
        </button>

        {/* Buscador (solo en escritorio) */}
        {pathname !== "/" && pathname !== "/buscador" && (
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/buscador"
              className={`relative text-white bg-[#243A48] px-4 py-3 rounded-full font-semibold text-base hover:text-white/80 transition-colors ${
                pathname === "/buscador" ? "active-link" : ""
              }`}
            >
              Buscar
            </Link>
            <input
              type="text"
              onChange={handleSearchChange}
              placeholder="¡Consulta cuanto llevas!"
              className="px-4 py-3 text-center rounded-3xl bg-[#B6E6E2] text-gray-900 text-base placeholder-black-50 focus:outline-none focus:ring-2 w-[250px]"
            />
          </div>
        )}
      </div>

      {/* Derecha: Navegación */}
      <nav className="flex items-center gap-4 md:gap-8">
        {/* Enlaces para escritorio */}
        <div className="hidden lg:flex gap-4 px-2 lg:gap-8 lg:px-10">
          {baseLinks.map((link, index) =>
            isBuscador ? (
              <a
                key={index}
                href={link.href}
                className={`relative text-black font-normal text-sm lg:text-2xl md:text-2xl hover:border-b-4 border-white transition-colors ${
                  pathname === link.href ? "active-link" : ""
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={`relative text-black font-normal text-sm lg:text-2xl md:text-2xl hover:border-b-4 border-white transition-colors ${
                  pathname === link.href ? "active-link" : ""
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Menú Desplegable para móviles */}
        {isMenuOpen && (
          <div className="absolute top-2 left-20 bg-transparent shadow-none rounded-lg py-2 px-4 lg:hidden z-50 flex flex-col gap-2">
            {dropdownLinks.map((link, index) => {
              const bgColors = ['bg-[#4EB7AF]', 'bg-[#4EB7AF]', 'bg-[#4EB7AF]'];
              return isBuscador ? (
                <a
                  key={index}
                  href={link.href}
                  className={`text-white font-medium text-lg text-center py-2 px-4 rounded-full ${bgColors[index % bgColors.length]} hover:opacity-80 transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={index}
                  href={link.href}
                  className={`text-white font-medium text-lg text-center py-2 px-4 rounded-full ${bgColors[index % bgColors.length]} hover:opacity-80 transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Botón Registrarme (visible en todas las pantallas) */}
        {isBuscador ? (
          <link
            href="/formulario"
            className="text-white bg-[#4EB7AF] font-semibold text-xl lg:text-xl px-8 py-2 rounded-3xl hover:bg-teal-600 transition-colors"
          >
            Registrarme
          </link>
        ) : (
          <Link
            href="/formulario"
            className="text-white bg-[#4EB7AF] font-semibold text-xl lg:text-xl px-8 py-2 rounded-3xl hover:bg-teal-600 transition-colors"
          >
            Registrarme
          </Link>
        )}
      </nav>

      {/* Estilos */}
      
    </header>
  );
};

export default Header;