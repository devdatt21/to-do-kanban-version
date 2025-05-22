import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import AddKanbanColumn from "./AddKanbanColumn";
import type { KanbanBoard as KanbanBoardType, Column } from "../types/types";
import { v4 as uuid } from "uuid";


interface DragResult {
    source: {
        droppableId: string;
        index: number;
    };
    destination: {
        droppableId: string;
        index: number;
    } | null;
    draggableId: string;
    type: string;
}

const KanbanBoard = () => {

  const [board, setBoard] = useState<KanbanBoardType>(() => {
    const saved = localStorage.getItem("kanbanBoard");
    return saved
      ? JSON.parse(saved)
      : {
          columns: [],
        };
  });

  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanBoard", JSON.stringify(board));
  }, [board]);

  const onDragEnd = (result: DragResult): void => {
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

    const newBoard: KanbanBoardType = {
      ...board,
      columns: board.columns.map((col) => {
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
          const [removed] = sourceColumn.tasks.splice(source.index, 1);
          newTasks.splice(destination.index, 0, removed);
          return { ...col, tasks: newTasks };
        }
        
        return col;
      }),
    };

    setBoard(newBoard);
  };

  const addColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const newColumn: Column = {
      id: uuid(),
      title: newColumnTitle,
      tasks: [],
    };

    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));

    setNewColumnTitle("");
  };

  return (
    <div className="p-4">
      <form onSubmit={addColumn} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="Enter column title"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Column
        </button>
      </form>

      <div className="scrollable">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {board.columns.map((column) => (
              <AddKanbanColumn
                key={column.id}
                column={column}
                setBoard={setBoard}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
