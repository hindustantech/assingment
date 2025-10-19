// src/components/tasks/TaskForm.tsx
import { useState } from 'react';
import axios from 'axios';

interface TaskFormProps {
  projectId: string;
  onCreate: (task: any) => void;
  task?: any;
  onUpdate?: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, onCreate, task, onUpdate }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [error, setError] = useState('');
    const Base = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (task) {
        res = await axios.put(`${Base}/api/projects/${projectId}/${task._id}`, { title, description, status, dueDate, priority }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onUpdate?.(res.data);
      } else {
        res = await axios.post(`/api/projects/${projectId}/tasks`, { title, description, status, dueDate, priority }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onCreate(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data.msg || 'Operation failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-lg mx-auto sm:px-8"
    >
      <h3 className="text-xl font-bold mb-4 text-center">{task ? 'Update Task' : 'Create Task'}</h3>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        {task ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default TaskForm;
