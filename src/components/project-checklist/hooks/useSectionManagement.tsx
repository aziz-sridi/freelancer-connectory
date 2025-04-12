
import { useState } from 'react';
import { ChecklistItem, Comment } from '@/types/task';
import { toast } from 'sonner';

export interface UseSectionManagementProps {
  sections: Array<{id: string; title: string; items: ChecklistItem[]}>;
  onSectionsChange: (sections: Array<{id: string; title: string; items: ChecklistItem[]}>) => void;
  onAddComment: (sectionId: string, taskId: string, comment: Comment) => void;
}

export const useSectionManagement = ({
  sections, 
  onSectionsChange,
  onAddComment
}: UseSectionManagementProps) => {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});
  const [selectedTask, setSelectedTask] = useState<{ sectionId: string; taskId: string } | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editedSectionTitle, setEditedSectionTitle] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const openEditDialog = (sectionId: string, currentTitle: string) => {
    setEditingSectionId(sectionId);
    setEditedSectionTitle(currentTitle);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSection = () => {
    if (!editingSectionId || !editedSectionTitle.trim()) return;
    
    const updatedSections = sections.map(section => 
      section.id === editingSectionId ? { ...section, title: editedSectionTitle } : section
    );
    onSectionsChange(updatedSections);
    setIsEditDialogOpen(false);
    setEditingSectionId(null);
    toast.success('Section updated successfully');
  };
  
  const handleDeleteSection = (sectionId: string) => {
    // Don't allow deletion of default sections
    if (['todo', 'in_progress', 'done'].includes(sectionId)) {
      toast.error("Can't delete default sections");
      return;
    }
    
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
    toast.success('Section deleted successfully');
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection = {
      id: `section-${Date.now()}`,
      title: newSectionTitle,
      items: [],
    };
    const updatedSections = [...sections, newSection];
    onSectionsChange(updatedSections);
    setNewSectionTitle('');
    toast.success('New section added');
  };

  const handleAddTask = (sectionId: string) => {
    const text = newTaskTexts[sectionId]?.trim();
    if (!text) return;
    
    const newTask: ChecklistItem = {
      id: `task-${Date.now()}`,
      text,
      comments: [],
      completed: false
    };
    
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...section.items, newTask] }
        : section
    );
    onSectionsChange(updatedSections);
    setNewTaskTexts({ ...newTaskTexts, [sectionId]: '' });
    toast.success('Task added');
  };

  const handleDeleteTask = (sectionId: string, taskId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== taskId) }
        : section
    );
    onSectionsChange(updatedSections);
    toast.success('Task deleted');
  };

  const handleToggleTaskCompletion = (sectionId: string, taskId: string, completed: boolean) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === taskId ? { ...item, completed } : item
            ) 
          }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const handleUpdateTaskText = (sectionId: string, taskId: string, text: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === taskId ? { ...item, text } : item
            ) 
          }
        : section
    );
    onSectionsChange(updatedSections);
  };

  return {
    newSectionTitle,
    setNewSectionTitle,
    newTaskTexts,
    setNewTaskTexts,
    selectedTask,
    setSelectedTask,
    editingSectionId,
    editedSectionTitle,
    setEditedSectionTitle,
    isEditDialogOpen,
    setIsEditDialogOpen,
    openEditDialog,
    handleEditSection,
    handleDeleteSection,
    handleAddSection,
    handleAddTask,
    handleDeleteTask,
    handleToggleTaskCompletion,
    handleUpdateTaskText
  };
};
