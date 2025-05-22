import { useState, useEffect } from "react";
import type { KanbanBoard as KanbanBoardType, Column } from "../types/types";
import { v4 as uuid } from "uuid";

export const useBoardState = () => {
  const [board, setBoard] = useState<KanbanBoardType>(() => {
    const saved = localStorage.getItem("kanbanBoard");
    return saved
      ? JSON.parse(saved)
      : {
          columns: [],
        };
  });

  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(board));
  }, [board]);

  const addColumn = (title: string) => {
    if (!title.trim()) return;

    const newColumn: Column = {
      id: uuid(),
      title: title,
      tasks: [],
    };

    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };

  const removeColumn = (columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }));
  };

  const editColumnTitle = (columnId: string, newTitle: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    }));
  };

  const moveTask = (result: {
    source: { droppableId: string; index: number };
    destination: { droppableId: string; index: number } | null;
  }) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = board.columns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = board.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === source.droppableId) {
          const newTasks = [...col.tasks];
          const [removed] = newTasks.splice(source.index, 1);
          if (source.droppableId === destination.droppableId) {
            newTasks.splice(destination.index, 0, removed);
          }
          return { ...col, tasks: newTasks };
        }

        if (
          col.id === destination.droppableId &&
          source.droppableId !== destination.droppableId
        ) {
          const newTasks = [...col.tasks];
          const [removed] = sourceColumn.tasks.slice(source.index, source.index + 1);
          if (removed) {
            const updatedTask = { ...removed, status: col.title };
            newTasks.splice(destination.index, 0, updatedTask);
          }
          return { ...col, tasks: newTasks };
        }

        return col;
      }),
    }));
  };

  const addTask = (columnId: string, title: string, description: string) => {
    if (!title.trim()) return;

    const task = {
      id: uuid(),
      title,
      description,
      status: board.columns.find((col) => col.id === columnId)?.title || "",
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, task],
          };
        }
        return col;
      }),
    }));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        return col;
      }),
    }));
  };

  return {
    board,
    setBoard,
    addColumn,
    removeColumn,
    editColumnTitle,
    moveTask,
    addTask,
    deleteTask,
  }
}
export default useBoardState;