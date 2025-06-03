import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FETCH_TOTAL_RECICLYNG } from "@/graphql/queries/fetchEntities";
import { useQuery } from "@apollo/client";
import Layout from "../components/layout";

function MobileHome() {
  const [recycledKg, setRecycledKg] = useState(0); // Estado para el valor total
  const [displayedKg, setDisplayedKg] = useState(0); // Estado para la animación
  const { data, loading, error } = useQuery(FETCH_TOTAL_RECICLYNG);

  useEffect(() => {
    if (data && data.totalReciclyng) {
      const total = data.totalReciclyng;
      setRecycledKg(total);

      // Animación de 0 al total
      let start = 0;
      const increment = total / 100; // Incremento por paso
      const duration = 2000; // Duración de la animación en ms
      const stepTime = duration / 100; // Tiempo por paso

      const animate = () => {
        start += increment;
        if (start >= total) {
          setDisplayedKg(total);
          return;
        }
        setDisplayedKg(Math.floor(start));
        setTimeout(animate, stepTime);
      };

      animate();
    }
  }, [data]);

  if (loading) return <p className="text-white text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error al cargar el total de reciclaje</p>;

  return (
    <div className="relative w-full min-h-screen">
      {/* Fondo fijo */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/bg-m4.png'), url('/images/bg.png')",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, bottom right",
        }}
      />

      {/* Contenido */}
      <main className="relative w-full min-h-screen flex flex-col items-center py-4 px-4 z-10">
        {/* Logo centrado */}
        <div className="mt-24 mb-2">
          <Image
            src="/images/logo-gov.png"
            alt="Logo Top Left"
            width={350}
            height={200}
            className="object-contain"
          />
        </div>

        <div className="mt-auto mb-8 flex flex-col items-center gap-4">
          {/* Título (`logo-m.png`) */}
          <div>
            <Image
              src="/images/logo-m.png"
              alt="Personaje Copito"
              width={250}
              height={250}
              className="object-contain"
            />
          </div>

          {/* Texto */}
          <p className="text-white text-sm text-center leading-relaxed max-w-sm">
            “COPITO, RECICLA” es una iniciativa ejemplar de gobernanza ambiental
            que busca sensibilizar y generar un impacto real en la
            sostenibilidad del Valle del Cauca. Con la participación activa de
            actores clave, tales como la comunidad educativa y las Juntas de
            Acción Comunal, se fomenta la corresponsabilidad en la gestión de
            residuos, un aspecto esencial en la lucha contra el cambio
            climático.
          </p>
        </div>

        {/* Enlace, Buscador y Contador */}
        <div className="flex flex-col items-center">
          {/* Buscador */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <Link href="/buscador">
                <button className="bg-[#2E3A59] text-white font-bold px-6 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                  ¡Consulta cuanto llevas!
                </button>
              </Link>
            </div>
            <div className="text-white italic text-sm mb-6">
              Conoce los términos y condiciones{" "}
              <Link
                href="/documents/BASES_DEL_CONCURSO_COPITO%20RECICLA_12.pdf"
                className="underline hover:text-white/80 transition-colors"
              >
                aquí
              </Link>
            </div>
          </div>

          {/* Contador al final para móviles */}
          <div className="mt-4 text-black text-lg font-bold flex flex-col items-center">
            <span>Total reciclado:</span>
            <div className="flex items-baseline">
              <div className="flex gap-1">
                {displayedKg
                  .toString()
                  .split('')
                  .map((digit, index) => (
                    <span
                      key={index}
                      className="bg-[#3C6884] text-white text-3xl font-bold px-3 py-2 rounded-xl"
                    >
                      {digit}
                    </span>
                  ))}
              </div>
              <span className="bg-[#3C6884] text-white text-3xl font-bold px-3 py-2 rounded-xl ml-2">kg</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [recycledKg, setRecycledKg] = useState(0); // Estado para el valor total
  const [displayedKg, setDisplayedKg] = useState(0); // Estado para la animación
  const { data, loading, error } = useQuery(FETCH_TOTAL_RECICLYNG);

  useEffect(() => {
    if (data && data.totalReciclyng) {
      const total = data.totalReciclyng;
      setRecycledKg(total);

      // Animación de 0 al total
      let start = 0;
      const increment = total / 100; // Incremento por paso
      const duration = 2000; // Duración de la animación en ms
      const stepTime = duration / 100; // Tiempo por paso

      const animate = () => {
        start += increment;
        if (start >= total) {
          setDisplayedKg(total);
          return;
        }
        setDisplayedKg(Math.floor(start));
        setTimeout(animate, stepTime);
      };

      animate();
    }
  }, [data]);

  if (loading) return <p className="text-white text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error al cargar el total de reciclaje</p>;

  return (
    <Layout>
      <>
        <main
          className="w-full min-h-screen text-[#3C3C3B] flex flex-col items-center justify-between py-16 px-6 md:px-40 relative lg:block hidden"
          style={{
            backgroundImage:
              "url('/images/bg-inicio.png'), url('/images/bg.png')",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundSize: "cover, cover",
            backgroundPosition: "center, bottom right",
          }}
        >
          {/* Logo en la esquina superior izquierda */}
          <div className="absolute left-12 top-6">
            <Image
              src="/images/logo-gober.png"
              alt="Logo Top Left"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          {/* Sección superior: Título, Texto y Enlace */}
          <div className="w-full md:max-w-3xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-center gap-6 md:mt-32 md:mr-96 lg:mr-96 lg:mt-24">
            <div className="text-4xl md:text-5xl font-bold text-white text-center">
              <Image
                src="/images/logo.png"
                alt="Personaje Copito"
                width={450}
                height={500}
                className="object-contain"
              />
            </div>
            <p className="text-white text-2xl md:text-2xl text-center leading-relaxed max-w-4xl">
              “COPITO, RECICLA” es una iniciativa ejemplar de gobernanza
              ambiental que busca sensibilizar y generar un impacto real en la
              sostenibilidad del Valle del Cauca. Con la participación activa de
              actores clave, tales como la comunidad educativa y las Juntas de
              Acción Comunal, se fomenta la corresponsabilidad en la gestión de
              residuos, un aspecto esencial en la lucha contra el cambio
              climático.
            </p>

            <div className="text-white italic">
              Conoce los términos y condiciones{" "}
              <Link
                href="/documents/BASES_DEL_CONCURSO_COPITO%20RECICLA_12.pdf"
                className="underline hover:text-white/80 transition-colors"
              >
                aquí
              </Link>
            </div>

            {/* Buscador alineado con el texto */}
            <div className="flex items-center gap-4">
              <Link href="/buscador">
                <button className="bg-[#2E3A59] text-xl text-white font-bold px-10 py-6 rounded-full hover:bg-[#3E4A69] transition-colors">
                  ¡Consulta cuanto llevas!
                </button>
              </Link>
            </div>
          </div>

          {/* Imagen del personaje */}
          <div className="absolute right-0 lg:top-40 md:top-40 xl:top-40">
            <Image
              src="/images/PPT-18-2.png"
              alt="Personaje Copito"
              width={500}
              height={500}
              className="w-64 h-72 md:w-[350px] md:h-[450px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[450px]"
            />
          </div>

          {/* Logo en la esquina inferior izquierda */}
          <div className="absolute left-8 bottom-10">
            <Image
              src="/images/logo-cc.png"
              alt="logo cc"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Contador en la esquina inferior derecha para escritorio */}
          <div className="absolute right-28 bottom-16 text-black text-3xl font-bold flex flex-col items-center ">
            <span>Total reciclado:</span>
            <div className="flex items-baseline">
              <div className="flex gap-1">
                {displayedKg
                  .toString()
                  .split('')
                  .map((digit, index) => (
                    <span
                      key={index}
                      className="bg-[#3C6884] text-white text-3xl font-bold px-3 py-2 rounded-xl"
                    >
                      {digit}
                    </span>
                  ))}
              </div>
              <span className="bg-[#3C6884] text-white text-3xl font-bold px-3 py-2 rounded-xl ml-2">kg</span>
            </div>
          </div>
        </main>

        {/* Diseño para teléfonos (1000px o menos) */}
        <div className="lg:hidden block">
          <MobileHome />
        </div>
      </>
    </Layout>
  );
}