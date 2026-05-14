'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [driveLinks, setDriveLinks] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredLinks = driveLinks.filter((link) => link.trim() !== '');
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, driveLinks: filteredLinks, tasks: [] }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Fallo al crear el proyecto');
      return;
    }

    router.push('/');
  };

  const addLink = () => setDriveLinks([...driveLinks, '']);
  const updateLink = (index: number, value: string) => {
    const newLinks = [...driveLinks];
    newLinks[index] = value;
    setDriveLinks(newLinks);
  };
  const removeLink = (index: number) => {
    setDriveLinks(driveLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">Crea un Nuevo Proyecto</h1>
          <p className="text-slate-600">Agrega detalles del proyecto, links en la nube y comienza a organizar tareas.</p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Nombre del proyecto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              rows={4}
            />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-800">Google Drive Links</label>
              <button
                type="button"
                onClick={addLink}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Agregar Link
              </button>
            </div>
            <div className="space-y-3">
              {driveLinks.map((link, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="https://drive.google.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Crear Proyecto
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
