import { Droppable } from "@hello-pangea/dnd";
import type { DroppableProvided } from "@hello-pangea/dnd";
import type { Column, KanbanBoard, Task } from "../types/types";
import { TaskCard } from "./TaskCard";
import { useState } from "react";
import { v4 as uuid } from "uuid";

interface KanbanColumnProps {
  column: Column;
  setBoard: React.Dispatch<React.SetStateAction<KanbanBoard>>;
  removeColumn: (columnId: string) => void;
  editColumnTitle: (columnId: string, newTitle: string) => void;
}

const AddKanbanColumn = ({
  column,
  setBoard,
  removeColumn,
  editColumnTitle,
}: KanbanColumnProps) => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: uuid(),
      title: newTask.title,
      description: newTask.description,
      status: column.title,
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: [...col.tasks, task],
          };
        }
        return col;
      }),
    }));

    setNewTask({ title: "", description: "" });
  };

  const deleteTask = (taskId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === column.id) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        return col;
      }),
    }));
  };
  return (
    <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
      <div className="flex justify-between items-center mb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">
          {isEditingTitle ? (
            <input
              type="text"
              value={columnTitle}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onChange={(e) => setColumnTitle(e.target.value)}
              onKeyDown={(e) => {
            if (e.key === "Enter") {
            if (columnTitle.trim() === "") {
              setColumnTitle(column.title);
              editColumnTitle(column.id, column.title);
            } else {
              editColumnTitle(column.id, columnTitle);
            }
            setIsEditingTitle(false);
            }
              }}
              className="font-bold text-lg bg-transparent border-b border-dashed border-gray-400 focus:outline-none focus:border-blue-500 w-40"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="cursor-pointer"
              title="Edit column title"
            >
              {column.title}
            </span>
          )}
        </h2>

        <button
          onClick={() => removeColumn(column.id)}
          className="text-red-600 hover:text-red-800 px-3 py-2 mb-1 bg-gray-300"
          title="Delete column"
        >
          ×
        </button>
      </div>

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
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Task title"
          className="w-full mb-2 p-2 rounded border"
        />
        <textarea
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
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
