import React from 'react';

import Register from '@/containers/Register';
import Header from '@/components/Header';


const Formulario = () => {
  return <main className={`bg-[url(/images/bg.png)] bg-no-repeat bg-cover text-[#3C3C3B]`}>
   <Header/>
    <Register/>
  </main>;
}

export default Formulario;