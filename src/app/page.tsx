'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description: string;
  driveLinks: string[];
  tasks: { title: string; completed: boolean }[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Fallo al cargar los proyectos');
          setProjects([]);
          return;
        }
        if (!Array.isArray(data)) {
          setError('Respuesta API inesperada');
          setProjects([]);
          return;
        }
        setProjects(data);
      } catch (err) {
        setError('Fallo al cargar los proyectos');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const deleteProject = async (id: string) => {
    const confirmed = window.confirm('Estas seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Fallo al eliminar el proyecto');
      return;
    }

    setProjects((current) => current.filter((project) => project._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Project Manager</h1>
            <p className="mt-2 text-slate-600">Organiza tus proyectos, tareas y enlaces de la nube desde una sola app.</p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Añadir nuevo proyecto
          </Link>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">Cargando Proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-sm">
            Aún sin proyectos. Crea tu primer proyecto para empezar a organizar tus tareas y enlaces de la nube.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.description || 'No description provided.'}</p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{project.tasks.length} Tareas</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{project.driveLinks.length} Links en la nube</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/projects/${project._id}`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Mostrar detalles
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProject(project._id)}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
