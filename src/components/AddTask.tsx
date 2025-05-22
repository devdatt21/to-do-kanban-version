import { useState } from "react";
import "../style/kanban.css";

type AddTaskProps = {
  columnId: string;
};

const AddTask = ({}: AddTaskProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add task logic here
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full mb-2 p-2 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-2 p-2 rounded"
      />
      <button type="submit" className="add-task-button">
        Add Task
      </button>
    </form>
  );
};

export default AddTask;