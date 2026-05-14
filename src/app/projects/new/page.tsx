'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [driveLinks, setDriveLinks] = useState<string[]>(['']);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredLinks = driveLinks.filter(link => link.trim() !== '');
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, driveLinks: filteredLinks, tasks: [] }),
    });
    if (res.ok) {
      router.push('/');
    }
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Google Drive Links</label>
            {driveLinks.map((link, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="https://drive.google.com/..."
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="ml-2 bg-red-500 text-white px-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addLink} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Link
            </button>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}