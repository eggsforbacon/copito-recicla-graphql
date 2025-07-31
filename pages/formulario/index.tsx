import React from 'react';
import Register from '@/containers/Register';
import Header from '@/components/Header';

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}


const Formulario = () => {
  return <main className={`bg-[url(/images/bg.png)] bg-no-repeat bg-cover text-[#3C3C3B]`}>
    <Header />
    <Register />
  </main>;
}

export default Formulario;