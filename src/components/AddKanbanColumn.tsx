import { Droppable } from '@hello-pangea/dnd';
import type { DroppableProvided } from '@hello-pangea/dnd';
import type { Column, KanbanBoard, Task } from '../types/types';
import { TaskCard } from './TaskCard';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

interface KanbanColumnProps {
  column: Column;
  setBoard: React.Dispatch<React.SetStateAction<KanbanBoard>>;
}

const AddKanbanColumn = ({ column, setBoard }: KanbanColumnProps) => {
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: uuid(),
      title: newTask.title,
      description: newTask.description,
      status: column.title
    };

    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: [...col.tasks, task]
          };
        }
        return col;
      })
    }));

    setNewTask({ title: '', description: '' });
  };

  const deleteTask = (taskId: string) => {
    setBoard(prev => ({
      ...prev,
      columns: prev.columns.map(col => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          };
        }
        return col;
      })
    }));
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
      <h2 className="text-lg font-bold mb-4 text-gray-900 border-b">{column.title}</h2>

      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[200px]"
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form onSubmit={addTask} className="mt-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Task title"
          className="w-full mb-2 p-2 rounded border"
        />
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description"
          className="w-full mb-2 p-2 rounded border"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddKanbanColumn;