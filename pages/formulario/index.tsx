import React from 'react';

import Register from '@/containers/Register';
import Header from '@/components/Header';


const Formulario = () => {
  return <main className={`absolute w-full h-full  bg-[url(/images/bg.png)]  bg-contain text-[#3C3C3B]`}>
   <Header/>
    <Register/>
  </main>;
}

export default Formulario;