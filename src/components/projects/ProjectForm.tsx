// src/components/projects/ProjectForm.tsx
import { useState } from 'react';
import axios from 'axios';

interface ProjectFormProps {
  onCreate: (project: any) => void;
  project?: any;
  onUpdate?: (project: any) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCreate, project, onUpdate }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState(project?.status || 'active');
  const [error, setError] = useState('');
  const Base = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (project) {
        res = await axios.put(`${Base}/api/projects/${project._id}`, { title, description, status }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onUpdate?.(res.data);
      } else {
        res = await axios.post(`${Base}/api/projects`, { title, description, status }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onCreate(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data.msg || 'Operation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
      <h3 className="text-xl font-bold mb-5 text-blue-700">
        {project ? 'Update Project' : 'Create Project'}
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {project ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
