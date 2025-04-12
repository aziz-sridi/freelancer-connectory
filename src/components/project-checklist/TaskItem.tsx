
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import { ChecklistItem } from '@/types/task';

interface TaskItemProps {
  item: ChecklistItem;
  taskIndex: number;
  sectionId: string;
  handleDeleteTask: (sectionId: string, taskId: string) => void;
  handleToggleTaskCompletion: (sectionId: string, taskId: string, completed: boolean) => void;
  handleUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  item,
  taskIndex,
  sectionId,
  handleDeleteTask,
  handleToggleTaskCompletion,
  handleUpdateTaskText,
  setSelectedTask
}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={taskIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 mb-2 rounded shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => handleToggleTaskCompletion(sectionId, item.id, e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <input
                value={item.text}
                onChange={(e) => handleUpdateTaskText(sectionId, item.id, e.target.value)}
                className={`w-full bg-transparent border-none p-0 focus:ring-0 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
              />
              {item.comments && item.comments.length > 0 && (
                <div 
                  className="text-sm text-gray-500 mt-1 cursor-pointer"
                  onClick={() => setSelectedTask({ sectionId, taskId: item.id })}
                >
                  {item.comments.length} 💬
                </div>
              )}
            </div>
            <button
              onClick={() => handleDeleteTask(sectionId, item.id)}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
