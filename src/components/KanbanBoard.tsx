import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import AddKanbanColumn from "./AddKanbanColumn";
import { useBoardState } from "../hooks/useBoardset";

const KanbanBoard = () => {
  const { board, setBoard, addColumn: addColumnToBoard, removeColumn, editColumnTitle, moveTask } = useBoardState();
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    addColumnToBoard(newColumnTitle);
    setNewColumnTitle("");
  };

  return (
    <div className="p-4">
      <form onSubmit={handleAddColumn} className="mb-4 flex gap-2">
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
        <DragDropContext onDragEnd={moveTask}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {board.columns.map((column) => (
              <AddKanbanColumn
                key={column.id}
                column={column}
                setBoard={setBoard}
                removeColumn={removeColumn}
                editColumnTitle={editColumnTitle}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
