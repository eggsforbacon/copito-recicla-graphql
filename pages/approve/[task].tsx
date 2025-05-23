import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function ApprovePage() {
  const router = useRouter();
  const { task, requestId } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const didFetch = useRef(false);

  useEffect(() => {
    if (!requestId || !task || didFetch.current) return;
    didFetch.current = true;

    const endpointMap: Record<string, string> = {
      'entity-update': '/api/approve-entity-update',
      'request': '/api/approve-request',
    };
    const endpoint = endpointMap[String(task)];
    if (!endpoint) {
      setStatus('error');
      setMessage('Tipo de aprobación no válido.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${endpoint}?requestId=${requestId}`);
        const payload = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(payload.message || 'Operación completada exitosamente.');
        } else {
          setStatus('error');
          setMessage(
            typeof payload.error === 'string'
              ? payload.error
              : payload.error?.message || 'Error desconocido'
          );
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    })();
  }, [task, requestId]);

  const titleMap: Record<string, { ok: string; err: string }> = {
    'entity-update': { ok: '¡Entidad Actualizada!', err: 'Error al aprobar entidad' },
    'request': { ok: '¡Solicitud Aprobada!', err: 'Error al aprobar solicitud' },
  };
  const labels = titleMap[String(task)] || { ok: '¡Hecho!', err: 'Error' };

  return (
    <main className="p-16 min-w-screen min-h-screen flex items-center justify-center bg-[url('/images/bg.png')] bg-cover">
      <div className="bg-white/90 rounded-2xl p-8 text-center items-center shadow-lg max-w-md">
        {status === 'loading' && <p>Procesando aprobación…</p>}

        {status === 'success' && (
          <>
            <Image src="/images/copito-blog.png" className='mx-auto' width={200} height={200} alt="Éxito" />
            <h2 className="text-3xl font-bold text-green-600 my-4">{labels.ok}</h2>
            <p className='py-2 text-gray-500'>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <Image src="/images/404.png" className='mx-auto' width={200} height={200} alt="Error" />
            <h2 className="text-3xl font-bold text-red-600 my-4">{labels.err}</h2>
            <p className='py-2 text-gray-500'>{message}</p>
          </>
        )}

        <Link href="/" className="mt-6 text-cyan-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}