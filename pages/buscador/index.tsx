"use client"

import React, { useRef, useState } from 'react';
import Image from 'next/image';

import TableData from '@/containers/Table';
import Layout from '@/components/layout';


interface ChildRef {
  search: (text: string) => void;
}

export default function Buscador() {

  
  const childRef = useRef<ChildRef>(null);
  const [searchText, setSearchText] = useState('');

// Actualizamos el onChange para buscar dinámicamente
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    if (childRef.current) {
      childRef.current.search(text); // Llama al método search en tiempo real
    }
  };




  return (
    <Layout>
      <>
        <main className="w-screen min-h-screen bg-[url(/images/bg.png)] bg-no-repeat bg-cover text-black bg-bottom px-4 relative pt-[150px] lg:pt-[250px]">
          {/* Logos posicionados de forma absoluta (no afectan flujo del contenido) */}
          <div className="absolute top-28 left-36 z-10 hidden lg:block">
            <Image
              src="/images/logo-gov.png"
              alt="Logo Izquierdo"
              width={520}
              height={200}
            />
          </div>
          <div className="absolute top-24 right-52 z-10 hidden lg:block">
            <Image
              src="/images/banner/copito1.png"
              alt="Logo Derecho"
              width={400}
              height={200}
            />
          </div>

          <div className="absolute top-72 right-52 z-10 hidden lg:block">
            <Image
              src="/images/logo.png"
              alt="Logo Derecho"
              width={400}
              height={200}
            />
          </div>


          <section className="flex flex-col gap-4 w-full max-w-3xl pl-28 pr-28">


            <div className="py-2 flex justify-center item-center z-10 block lg:hidden">
              <Image
                src="/images/titulo.png"
                alt="Logo Derecho"
                width={400}
                height={200}
              />
            </div>

           <h2 className="text-xl xl:text-3xl pt-10 font-bold text-center w-full">
              ¡Consulta cuánto llevas!
            </h2>

            <input
              onChange={handleSearchChange} // Actualizamos a la nueva función
              value={searchText} // Añadimos value para control del input
              className="border-b-2 px-4 py-4 text-xl text-center bg-[#B6E6E2] w-full rounded-full"
              placeholder="Municipio - Nombre - Entidad"
            />

            {/* Eliminamos el botón */}
          </section>

          <section className="w-full  px-10 mt-10 lg:mt-20">
            <TableData ref={childRef} />
          </section>
        </main>

      </>
    </Layout>

  );
}
