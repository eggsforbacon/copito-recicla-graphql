import Link from "next/link";
import Image from "next/image";

import Layout from "../components/layout";

function MobileHome() {
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
        {/* Enlace, Buscador y Logo Inferior (mantener arriba) */}
        <div className="flex flex-col items-center ">
          {/* Buscador */}
          <div className="flex flex-col items-center  gap-4">
            {/* Buscador alineado con el texto */}
            <div className="flex items-center gap-4">
              <Link href="/buscador">
                <button className="bg-[#2E3A59] text-white font-bold px-6 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                  ¡Consulta cuanto llevas!
                </button>
              </Link>
            </div>
            <div className="text-white italic text-sm mb-6 ">
              Conoce los términos y condiciones{" "}
              <Link
                href="/documents/BASES_DEL_CONCURSO_COPITO%20RECICLA_12.pdf"
                className="underline hover:text-white/80 transition-colors"
              >
                aquí
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default function Home() {
  return (
    <Layout>
      <>
        <main
          className=" w-full min-h-screen text-[#3C3C3B] flex flex-col items-center justify-between py-16 px-6 md:px-40 relative lg:block hidden"
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

            <div className="text-white italic ">
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
                  <button className="bg-[#2E3A59] text-xl text-white font-bold px-10 py-4 rounded-full hover:bg-[#3E4A69] transition-colors">
                    ¡Consulta cuanto llevas!
                  </button>
                </Link>
              </div>
            
          </div>

          {/* Imagen del personaje */}
          <div className="absolute right-0  lg:top-40 md:top-40 xl:top-40">
            <Image
              src="/images/PPT-18-2.png"
              alt="Personaje Copito"
              width={500}
              height={500}
              className=" w-64 h-72 md:w-[350px]  md:h-[450px] lg:w-[350px] lg:h-[350px]   xl:w-[400px] xl:h-[450px]"
            />
          </div>

          {/* Sección inferior: Botón de búsqueda, input y logo */}

          {/* Logo en la esquina inferior derecha */}
          <div className="absolute right-8 bottom-4">
            <Image
              src="/images/logo-cc.png"
              alt="logo cc"
              width={200}
              height={200}
              className="object-contain"
            />
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