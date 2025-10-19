// src/components/projects/ProjectDetails.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TaskForm from '../tasks/TaskForm';
import TaskList from '../tasks/TaskList';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  priority: string;
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const Base=import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${Base}/api/projects/${projectId}/tasks?page=${page}&limit=10&status=${statusFilter}&priority=${priorityFilter}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  const handleCreate = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const handleUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Project Tasks
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full sm:w-48 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full sm:w-48 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
          >
            {showForm ? 'Cancel' : 'Create Task'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm projectId={projectId!} onCreate={handleCreate} />
          </div>
        )}

        <TaskList
          tasks={tasks}
          projectId={projectId!}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
