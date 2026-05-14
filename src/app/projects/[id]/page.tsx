'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Task {
  title: string;
  completed: boolean;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  driveLinks: string[];
  tasks: Task[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [newTask, setNewTask] = useState('');
  const [newLink, setNewLink] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Fallo al cargar el proyecto');
          return;
        }
        setProject(data);
        setEditName(data.name || '');
        setEditDescription(data.description || '');
      };
      loadProject();
    }
  }, [id]);

  const addTask = async () => {
    if (!newTask.trim() || !project) return;
    const updatedTasks = [...project.tasks, { title: newTask, completed: false }];
    await updateProject({ tasks: updatedTasks });
    setNewTask('');
  };

  const toggleTask = async (index: number) => {
    if (!project) return;
    const updatedTasks = project.tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    await updateProject({ tasks: updatedTasks });
  };

  const updateProject = async (updates: Partial<Project>) => {
    if (!id) return;
    setError('');
    setInfoMessage('');

    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Fallo al actualizar el proyecto');
      return null;
    }

    const updated = await res.json();
    setProject(updated);
    setEditName(updated.name || '');
    setEditDescription(updated.description || '');
    return updated;
  };

  const saveProjectDetails = async () => {
    if (!project) return;
    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();
    if (!trimmedName) {
      setError('El nombre del proyecto no puede estar vacío');
      return;
    }

    const updated = await updateProject({ name: trimmedName, description: trimmedDescription });
    if (updated) {
      setIsEditing(false);
      setInfoMessage('Título y descripción actualizados');
    }
  };

  const cancelEdit = () => {
    if (!project) return;
    setEditName(project.name);
    setEditDescription(project.description || '');
    setIsEditing(false);
    setError('');
    setInfoMessage('');
  };

  const addProjectLink = async () => {
    if (!newLink.trim() || !project) return;
    const updatedLinks = [...project.driveLinks, newLink.trim()];
    const updated = await updateProject({ driveLinks: updatedLinks });
    if (updated) {
      setNewLink('');
      setInfoMessage('Link agregado al proyecto');
    }
  };

  if (!project) return <div className="min-h-screen bg-slate-50 p-4">Cargando proyecto...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Título del proyecto</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Descripción</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveProjectDetails}
                      className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-semibold text-slate-900">{project?.name || 'Project details'}</h1>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Editar proyecto
                    </button>
                  </div>
                  <p className="mt-3 max-w-2xl text-slate-600">{project?.description || 'Este proyecto no tiene descripción todavía.'}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Volver a Proyectos
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!id) return;
                  const confirmed = window.confirm('Estas seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.');
                  if (!confirmed) return;
                  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                  if (res.ok) {
                    router.push('/');
                    return;
                  }
                  const data = await res.json();
                  setError(data.error || 'Fallo al eliminar el proyecto');
                }}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Eliminar Proyecto
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">
            {infoMessage}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Links en la nube</h2>
            {project?.driveLinks.length ? (
              <ul className="mt-4 space-y-3">
                {project.driveLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-blue-600 transition hover:bg-slate-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No hay links en la nube agregados todavía.</p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Agregar link de la nube"
              />
              <button
                type="button"
                onClick={addProjectLink}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Agregar Link
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Tareas</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{project?.tasks.length || 0}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {project?.tasks.length ? (
                project.tasks.map((task, index) => (
                  <li key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className={task.completed ? 'text-slate-500 line-through' : 'text-slate-700'}>{task.title}</span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-slate-500">No hay tareas aún. Agrega tu primera tarea abajo.</p>
              )}
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Nueva tarea"
              />
              <button
                type="button"
                onClick={addTask}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Agregar Tarea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
