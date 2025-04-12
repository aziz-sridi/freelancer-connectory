
import React from 'react';
import { Button } from '@/components/ui/button';
import SubtaskItem from './SubtaskItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: SubTask[];
  onAddSubtask: () => void;
  onChangeSubtask: (id: string, text: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onRemoveSubtask: (id: string) => void;
  onReorderSubtasks?: (reorderedSubtasks: SubTask[]) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onAddSubtask,
  onChangeSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  onReorderSubtasks
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorderSubtasks) return;
    
    const items = Array.from(subtasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderSubtasks(items);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Subtasks</label>
      <div className="space-y-2">
        {onReorderSubtasks ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {subtasks.map((subtask, index) => (
                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <SubtaskItem
                            id={subtask.id}
                            text={subtask.text}
                            completed={subtask.completed}
                            onChange={onChangeSubtask}
                            onToggle={onToggleSubtask}
                            onRemove={onRemoveSubtask}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          // Fallback to non-draggable list if reorder functionality not provided
          subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              id={subtask.id}
              text={subtask.text}
              completed={subtask.completed}
              onChange={onChangeSubtask}
              onToggle={onToggleSubtask}
              onRemove={onRemoveSubtask}
            />
          ))
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onAddSubtask}
        >
          Add Subtask
        </Button>
      </div>
    </div>
  );
};

export default SubtaskList;
