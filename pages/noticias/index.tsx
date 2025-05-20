"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReactMarkdown from "react-markdown"; // Importar react-markdown
import Layout from "@/components/layout";

const noticias = [
  {
    titulo: "‘Copito recicla’: una estrategia ambiental del Valle del Cauca",
    texto:
      "La Gobernación del Valle del Cauca, a través de su Secretaría de Ambiente y Desarrollo Sostenible y en articulación con varias alcaldías municipales, impulsa la campaña **‘Copito, recicla’**, una iniciativa enfocada en fortalecer las buenas prácticas ambientales en el territorio.  " +
      "Esta campaña tiene como objetivo reducir la contaminación de fuentes naturales, minimizar el impacto del cambio climático y promover hábitos de consumo sostenibles.Para lograrlo, se implementa una maratón de reciclaje en dos categorías: **Comunidad Educativa** y **Juntas de Acción Comunal**, en municipios priorizados del departamento.  " + 
      "La campaña se apoya en la Regla de las 3R: **Reducir**, **Reutilizar** y **Reciclar**, y contempla la recolección de materiales como cartón, plástico, papel y metal; La logística de acopio estará a cargo de asociaciones de recicladores locales, quienes realizarán la recolección y clasificación del material entregado. " +
      "Los municipios participantes se agrupan en tres bloques, y dentro de cada uno se promueve una competencia sana que reconoce los esfuerzos colectivos de reciclaje; Como símbolo de esta estrategia, acompaña el proceso **Copito**, un personaje que representa el compromiso del departamento con la sostenibilidad y el cuidado del entorno..  " +
      "La campaña incluye actividades educativas y de sensibilización para motivar a la ciudadanía a adoptar prácticas responsables con el medio ambiente, sumando esfuerzos para proteger **el Paraíso de la Biodiversidad** que representa el Valle del Cauca.. " +
      "Para más información y detalles sobre cómo participar, se invita a visitar los canales oficiales de la Gobernación del Valle del Cauca.",
    imagen: "/images/gallery/im13.jpg",
   
  },
  {
    titulo: "Campaña ‘Copito recicla’: una apuesta colectiva por el reciclaje en el Valle del Cauca",
    texto:
"La Gobernación del Valle del Cauca, a través de su Secretaría de Ambiente y Desarrollo Sostenible, lidera la campaña **‘Copito recicla’**, "+
"una estrategia ambiental diseñada para fortalecer las prácticas de reciclaje en comunidades educativas y Juntas de Acción Comunal de nueve municipios del departamento.. "+
"Esta iniciativa se enmarca dentro de los compromisos ambientales del Valle del Cauca y tiene como objetivos principales:. " +

"°Disminuir la contaminación en las fuentes naturales,. "+


"°Reducir el impacto del cambio climático, y. "+


"°Fomentar comportamientos de consumo responsable.. "+


"La estrategia contempla el desarrollo de actividades pedagógicas, culturales y comunitarias,"+
"en las que se promueven mensajes sobre el cuidado del medio ambiente; Como parte del proceso, "+
"se establecerá una dinámica de reciclaje donde los participantes recolectan materiales como cartón, "+
"papel, plástico y metal; La clasificación y recolección están a cargo de asociaciones locales de recicladores.. "+
"Los municipios participantes se agrupan en tres bloques, y tanto las instituciones educativas como las Juntas de Acción Comunal que más residuos logren recolectar, "+
"recibirán incentivos en forma de elementos útiles enfocados en sostenibilidad y preservación del entorno.. "+
"Uno de los aspectos más simbólicos de esta campaña es la participación de **Copito**, un personaje que representa al departamento como embajador ambiental; "+
"Su presencia busca motivar la participación activa de niños, jóvenes y adultos, reforzando la idea de que el cuidado ambiental es un esfuerzo compartido.. "+
"Para conocer más sobre cómo participar y acceder a los lineamientos de la campaña, se puede visitar la página oficial de la Gobernación del Valle del Cauca o sus canales institucionales.. "+
"**‘Copito recicla’: juntos protegemos el Paraíso de la Biodiversidad.**",
    imagen: "/images/gallery/im12.jpeg",
   
  },
];

export default function Noticia() {
  const [index, setIndex] = useState(0);
  const noticia = noticias[index];

  return (
    <Layout>
      <main className="w-screen  min-h-screen bg-[url(/images/bg.png)] bg-no-repeat bg-cover bg-bottom">
        <section className="min-h-screen flex items-center justify-center pt-20 lg:pt-24 px-4 text-center relative">
          <div className="max-w-4xl w-full p-2 bg-transparent">
            <div className="lg:hidden w-full flex justify-center">
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

            <h2 className="text-2xl text-black md:text-3xl mt-6 mb-6 font-bold max-w-2xl mx-auto">
              {noticia.titulo}
            </h2>
            <div className="text-black mb-4 max-w-3xl mx-auto text-justify">
              {noticia.texto.split(". ").map((paragraph, i) => (
                <div key={i} className="mb-4">
                  <ReactMarkdown>
                    {paragraph + (i < noticia.texto.split(".  ").length - 1 ? "." : "")}
                  </ReactMarkdown>
                </div>
              ))}
            </div>

            <div className="max-w-7xl flex justify-center mt-4 gap-4 py-4 lg:hidden">
              <div className="flex flex-col items-center gap-2">
                <Link href="/buscador">
                  <button className="bg-[#2E3A59] text-white font-bold px-8 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                    ¡Consulta cuanto llevas!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-0 hidden lg:block">
        <Image
          src="/images/logo-g1.png"
          alt="Logo Inferior"
          width={300}
          height={300}
          className="object-contain md:w-[100px] xl:w-[300px] lg:w-[200px]"
          priority
        />
      </div>
    </Layout>
  );
}