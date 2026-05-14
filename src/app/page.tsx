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

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Project Manager</h1>
        <Link href="/projects/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
          Add New Project
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm">Tasks: {project.tasks.length}</p>
              <Link href={`/projects/${project._id}`} className="text-blue-500 mt-2 inline-block">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
