"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import Link from "next/link";

import Layout from "@/components/layout";

export default function Galeria() {
  const [current, setCurrent] = useState(0);

  const images = [
    "/images/gallery/im1.JPEG",
    "/images/gallery/im2.JPEG",
    "/images/gallery/im3.JPEG",
    "/images/gallery/im4.JPG",
    "/images/gallery/im5.JPEG",
    "/images/gallery/im6.JPEG",
    "/images/gallery/im7.JPEG",
    "/images/gallery/im8.JPEG",
    "/images/gallery/im9.JPEG",
    "/images/gallery/im10.JPEG",
    "/images/gallery/im11.JPEG",
    "/images/gallery/im12.JPEG",
    "/images/gallery/im13.JPG",
    "/images/gallery/im14.JPG",
    "/images/gallery/im15.JPG",
   
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
                width={650}
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
                
                <Link href="/buscador">
                  <button className="bg-[#2E3A59] text-white font-bold px-8 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                  ¡Consulta cuanto llevas!
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Logo flotante */}
          <div className="fixed bottom-0 left-0 z-50 hidden lg:block ">
            <Image
              src="/images/logo-g1.png"
              alt="Logo Inferior"
              width={300}
              height={400}
              className="object-contain "
              priority
            />
          </div>
        </main>
      </>
    </Layout>
  );
}