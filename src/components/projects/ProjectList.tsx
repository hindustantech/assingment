// src/components/projects/ProjectList.tsx
import { useState } from 'react';
import axios from 'axios';
import ProjectForm from './ProjectForm';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
}

interface ProjectListProps {
  projects: Project[];
  onUpdate: (updatedProject: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onUpdate, onDelete }) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const Base = import.meta.env.VITE_BASE_URL;
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${Base}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onDelete(id);
      } catch {
        console.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {projects?.map((project) => (
        <div
          key={project._id}
          className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-1">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{project.description}</p>
          <p className="text-sm text-gray-500 mb-3">
            <span className="font-medium">Status:</span> {project.status}
          </p>

          <div className="flex justify-between text-sm font-medium">
            <button
              onClick={() => setEditingProject(project)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(project._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-lg">
            <ProjectForm
              project={editingProject}
              onUpdate={(updated) => {
                onUpdate(updated);
                setEditingProject(null);
              }}
              onCreate={() => { }}
            />
            <button
              onClick={() => setEditingProject(null)}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
