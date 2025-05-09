"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import Link from "next/link";
import { Search } from "lucide-react";
import Layout from "@/components/layout";

export default function Galeria() {
  const [current, setCurrent] = useState(0);

  const images = [
    "/images/gallery/im2.JPG",
    "/images/gallery/im3.JPG",
    "/images/gallery/im4.JPG",
    "/images/gallery/im5.JPG",
    "/images/gallery/im6.JPG",
    "/images/gallery/im7.JPG",
    "/images/gallery/im8.JPG",
    "/images/gallery/im9.JPG",
    "/images/gallery/img10.JPG",
    "/images/gallery/img11.JPG",
    "/images/gallery/image12.JPG",
    "/images/gallery/image13.JPG",
    "/images/gallery/imagen14.JPG",
    "/images/gallery/im15.JPG",
    "/images/gallery/im16.JPG",
    "/images/gallery/im17.JPG",
    "/images/gallery/im18.JPG",
    "/images/gallery/im19.JPG",
    "/images/gallery/im20.JPG",
    "/images/gallery/im22.JPG",
  ];

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Layout>
      <>
        <main className="w-screen min-h-screen bg-[url(/images/bg.png)] bg-no-repeat bg-cover bg-bottom">
          <section className="relative w-screen h-screen flex flex-col items-center justify-center" id="gallery">
            {/* Título */}
            <div className="flex justify-center mb-4 mt-8 lg:mt-0">
              <Image
                src="/images/logo.png"
                alt="Copito Recicla Logo"
                width={350}
                height={150}
              />
            </div>

            {/* Contenedor del carrusel con flechas fuera */}
            <div className="relative flex items-center justify-center w-full max-w-[80%] lg:max-w-[50%] mx-10">
              {/* Flecha Izquierda */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl z-20 text-black hover:scale-150 transition"
                style={{ marginLeft: "-40px" }} // Ajuste para salir fuera de la imagen
              >
                <ChevronLeft />
              </button>

              {/* Imagen principal */}
              <Image
                src={images[current]}
                alt="Gallery Image"
                width={750}
                height={600}
                quality={100}
                className="object-cover rounded-xl shadow-lg z-10"
              />

              {/* Flecha Derecha */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl z-20 text-black hover:scale-150 transition"
                style={{ marginRight: "-40px" }} // Ajuste para salir fuera de la imagen
              >
                <ChevronRight />
              </button>
            </div>

            {/* Buscador */}
            <div className="max-w-7xl flex justify-center mt-6 gap-4 py-6 lg:hidden">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="¡Consulta cuanto llevas!"
                    className="bg-[#B6E6E2] text-white placeholder-gray-400 text-center border border-white/50 rounded-full px-10 py-4 pr-10 w-72 focus:outline-none focus:ring-2 focus:ring-white/80"
                  />
                  <Search
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                    size={20}
                  />
                </div>
                <Link href="/buscador">
                  <button className="bg-[#2E3A59] text-white font-bold px-8 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                    Buscar
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Logo flotante */}
          <div className="fixed bottom-0 left-0 z-50 hidden lg:block">
            <Image
              src="/images/logo-g1.png"
              alt="Logo Inferior"
              width={300}
              height={400}
              className="object-contain"
              priority
            />
          </div>
        </main>
      </>
    </Layout>
  );
}