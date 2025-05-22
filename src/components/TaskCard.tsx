import { Draggable } from '@hello-pangea/dnd';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Task } from '../types/types';

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: () => void;
}

export const TaskCard = ({ task, index, onDelete }: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow mb-2 group relative"
        >
          
          <h3 className="font-bold mb-2 text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm">{task.description}</p>
          )}
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 opacity-0 bg-gray-300 group-hover:opacity-100 
                     text-red-500 hover:text-red-700 transition-opacity"
          >
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
};