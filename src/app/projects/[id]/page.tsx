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
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then(res => res.json())
        .then(setProject);
    }
  }, [id]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const updatedTasks = [...(project?.tasks || []), { title: newTask, completed: false }];
    await updateProject({ tasks: updatedTasks });
    setNewTask('');
  };

  const toggleTask = async (index: number) => {
    const updatedTasks = project?.tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    await updateProject({ tasks: updatedTasks });
  };

  const updateProject = async (updates: Partial<Project>) => {
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

  if (!project) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Google Drive Links</h2>
          {project.driveLinks.map((link, index) => (
            <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="block text-blue-500 underline">
              {link}
            </a>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <ul>
            {project.tasks.map((task, index) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="mr-2"
                />
                <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
              </li>
            ))}
          </ul>
          <div className="flex mt-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="New task"
            />
            <button onClick={addTask} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add Task
            </button>
          </div>
        </div>
        <button onClick={() => router.push('/')} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back to Projects
        </button>
      </div>
    </div>
  );
}