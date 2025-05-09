"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Search } from "lucide-react";
import Layout from "@/components/layout";

const noticias = [
  {
    fecha: "Octubre 16 de 2024",
    titulo: "Con éxito fue presentada la campaña ‘Copito, recicla y premia’",
    texto: "A través de un acto especial en la Institución Educativa Eustaquio Palacios con la comunidad educativa y en el Parque La Horqueta con la Junta de Acción Comunal de la Comuna 20, se socializó la estrategia que fomentará las buenas prácticas de reciclaje en 9 municipios del Valle del Cauca.",
    imagen: "/images/noticias/lanzamientos/2.jpg",
    pdf: "/documents/news/Copito-recicla-y-premia.pdf",
  },
  {
    fecha: "Octubre 20 de 2024",
    titulo: "Nueva jornada ambiental con estudiantes de Palmira",
    texto: "Estudiantes de varias instituciones educativas participaron en una jornada ambiental donde sembraron árboles nativos y aprendieron sobre el manejo adecuado de residuos sólidos en el marco del programa de educación ambiental del Valle.",
    imagen: "/images/noticias/lanzamientos/1.jpg",
    pdf: "/documents/news/Copito-recicla-y-premia.pdf",
  },
];
export default function Noticia() {
   const [index, setIndex] = useState(0);
    const noticia = noticias[index];
  return (
    <Layout>
    <>
    <main className="w-screen min-h-screen bg-[url(/images/bg.png)] bg-no-repeat bg-cover bg-bottom">
    <section className="min-h-screen flex items-center justify-center lg:pt-24 px-4 text-center relative ">
  <div className="max-w-4xl w-full  p-2 bg-traparent  ">
    
  <div className="block lg:hidden w-full  flex justify-center  ">
        <Image
          src="/images/logo-g2.png"
          alt="Logo"
          width={200}
          height={120}
          className="object-contain"
        />
      </div>
    
    <div className="relative flex justify-center">

      
      <Image
        src={noticia.imagen}
        alt="Imagen de la noticia"
        width={700}
        height={400}
        className="rounded-md object-cover"
      />

      {/* Flechas de navegación posicionadas alrededor de la imagen */}
      {index > 0 && (
        <button
          onClick={() => setIndex(index - 1)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-4xl text-black hover:scale-110 transition"
        >
          <ArrowLeftOutlined />
        </button>
      )}
      {index < noticias.length - 1 && (
        <button
          onClick={() => setIndex(index + 1)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-4xl text-black hover:scale-110 transition"
        >
          <ArrowRightOutlined />
        </button>
      )}
    </div>

    <p className="text-black font-extralight z-50 mt-1 mb-2">{noticia.fecha}</p>
    <h2 className="text-2xl text-black md:text-3xl font-bold mb-4">{noticia.titulo}</h2>
    <p className="text-black mb-4">{noticia.texto}</p>
    <Link
      href={noticia.pdf}
      target="_blank"
      className="text-black font-semibold underline"
    >
      Leer más
    </Link>

    <div className="max-w-7xl flex justify-center mt-8 gap-4 py-4 lg:hidden">
        <div className="flex flex-col items-center gap-2">
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
  </div>

  
</section>
   
   
   
   
   
   
   
   
   
    </main>
    <div className="fixed bottom-0 left-0 z-50 hidden lg:block md:w-[200px] xl:w-[300px] lg:w-[300px] ">
            <Image
              src="/images/logo-g1.png"
              alt="Logo Inferior"
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </div>
          
        </>
        </Layout>
  );
}