// src/components/dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from '../projects/ProjectForm';
import ProjectList from '../projects/ProjectList';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const Base=import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${Base}/api/projects?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch projects');
    }
  };

  const handleCreate = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setShowForm(false);
  };

  const handleUpdate = (updatedProject: Project) => {
    setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p._id !== id));
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      // Assuming you add a backend endpoint /api/seed to run the seed script
      // In backend, create a route that executes the seed logic
      await axios.post(`${Base}/api/auth/seed`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Database seeded successfully');
      fetchProjects();
    } catch (err) {
      alert('Failed to seed database');
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create Project'}
        </button>
        <button
          onClick={handleSeed}
          disabled={seedLoading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
        >
          {seedLoading ? 'Seeding...' : 'Run Seed Data'}
        </button>
      </div>
      {showForm && <ProjectForm onCreate={handleCreate} />}
      <ProjectList
        projects={projects}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded mr-2"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;