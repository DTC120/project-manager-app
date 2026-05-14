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
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const loadProject = async () => {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to load project');
          return;
        }
        setProject(data);
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
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setProject(updated);
    }
  };

  if (!project) return <div className="min-h-screen bg-slate-50 p-4">Loading project...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">{project?.name || 'Project details'}</h1>
              <p className="mt-3 max-w-2xl text-slate-600">{project?.description || 'Este proyecto no tiene descripción todavía.'}</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Back to Projects
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!id) return;
                  const confirmed = window.confirm('Delete this project permanently?');
                  if (!confirmed) return;
                  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                  if (res.ok) {
                    router.push('/');
                    return;
                  }
                  const data = await res.json();
                  setError(data.error || 'Failed to delete project');
                }}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Cloud links</h2>
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
              <p className="mt-4 text-sm text-slate-500">No drive links added yet.</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
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
                <p className="text-sm text-slate-500">No tasks yet. Add your first task below.</p>
              )}
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="New task"
              />
              <button
                type="button"
                onClick={addTask}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
