
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2, MoreVertical, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TaskItem from './TaskItem';
import { ChecklistItem } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SectionHeader } from './section/SectionHeader';
import { TaskList } from './section/TaskList';
import { AddTaskInput } from './section/AddTaskInput';

interface SectionProps {
  section: {
    id: string;
    title: string;
    items: ChecklistItem[];
  };
  index: number;
  handleAddTask: (sectionId: string) => void;
  handleDeleteTask: (sectionId: string, taskId: string) => void;
  handleToggleTaskCompletion: (sectionId: string, taskId: string, completed: boolean) => void;
  handleUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  openEditDialog: (sectionId: string, currentTitle: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  newTaskTexts: Record<string, string>;
  setNewTaskTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSelectedTask: (task: { sectionId: string; taskId: string } | null) => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  index,
  handleAddTask,
  handleDeleteTask,
  handleToggleTaskCompletion,
  handleUpdateTaskText,
  openEditDialog,
  handleDeleteSection,
  newTaskTexts,
  setNewTaskTexts,
  setSelectedTask,
}) => {
  return (
    <Draggable key={section.id} draggableId={section.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg shadow-sm w-72 flex-shrink-0"
          role="group"
          aria-label={`Section: ${section.title}`}
        >
          <SectionHeader 
            title={section.title}
            dragHandleProps={provided.dragHandleProps}
            onEdit={() => openEditDialog(section.id, section.title)}
            onDelete={() => handleDeleteSection(section.id)}
          />
          
          <TaskList 
            section={section} 
            handleDeleteTask={handleDeleteTask}
            handleToggleTaskCompletion={handleToggleTaskCompletion}
            handleUpdateTaskText={handleUpdateTaskText}
            setSelectedTask={setSelectedTask}
          />
          
          <AddTaskInput
            sectionId={section.id}
            value={newTaskTexts[section.id] || ''}
            onChange={(value) => setNewTaskTexts({ 
              ...newTaskTexts, 
              [section.id]: value 
            })}
            onAddTask={() => handleAddTask(section.id)}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Section;
