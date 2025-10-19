// src/components/tasks/TaskList.tsx
import { useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  priority: string;
}

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, projectId, onUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const Base = import.meta.env.VITE_BASE_URL;
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${Base}/api/projects/${projectId}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        onDelete(id);
      } catch {
        console.error('Failed to delete task');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <div
          key={task._id}
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold mb-1">{task.title}</h3>
          <p className="text-gray-600 mb-2 text-sm break-words">{task.description}</p>
          <p className="text-gray-500 text-sm">Status: <span className="capitalize">{task.status}</span></p>
          <p className="text-gray-500 text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p className="text-gray-500 text-sm mb-3">Priority: <span className="capitalize">{task.priority}</span></p>

          <div className="flex justify-between items-center mt-3 text-sm">
            <button
              onClick={() => setEditingTask(task)}
              className="text-blue-600 font-medium hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600 font-medium hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <TaskForm
              projectId={projectId}
              task={editingTask}
              onUpdate={(updated) => {
                onUpdate(updated);
                setEditingTask(null);
              }}
              onCreate={() => {}}
            />
            <button
              onClick={() => setEditingTask(null)}
              className="absolute top-2 right-3 text-gray-500 text-lg hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
