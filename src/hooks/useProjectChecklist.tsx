
import { useState, useEffect, useCallback } from 'react';
import { ChecklistItem, Comment } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define a type for the serialized form of ChecklistItem for storage
type SerializedChecklistItem = {
  id: string;
  text: string;
  comments: {
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }[];
  completed: boolean;
};

// Helper to convert ChecklistItems to a serializable form
const serializeItems = (items: ChecklistItem[]): SerializedChecklistItem[] => {
  return items.map(item => ({
    id: item.id,
    text: item.text,
    comments: item.comments.map(comment => ({
      id: comment.id,
      text: comment.text,
      author: comment.author,
      createdAt: comment.createdAt instanceof Date 
        ? comment.createdAt.toISOString() 
        : comment.createdAt
    })),
    completed: item.completed
  }));
};

// Helper to deserialize items from storage
const deserializeItems = (serialized: any[]): ChecklistItem[] => {
  if (!Array.isArray(serialized)) return [];
  
  return serialized.map(item => ({
    id: item.id || uuidv4(),
    text: item.text || '',
    comments: Array.isArray(item.comments) 
      ? item.comments.map((comment: any) => ({
          id: comment.id || uuidv4(),
          text: comment.text || '',
          author: comment.author || 'Anonymous',
          createdAt: comment.createdAt || new Date().toISOString()
        }))
      : [],
    completed: Boolean(item.completed)
  }));
};

export function useProjectChecklist(projectId: string) {
  const [sections, setSections] = useState<Array<{id: string; title: string; items: ChecklistItem[]}>>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});
  const [selectedTask, setSelectedTask] = useState<{ sectionId: string; taskId: string } | null>(null);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState('');
  const [editedSectionTitle, setEditedSectionTitle] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Fetch checklist data
  const fetchChecklist = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_checklists')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Convert database data to our section format
        const formattedSections = [];
        
        if (data.todo_items) {
          formattedSections.push({
            id: 'todo',
            title: 'To Do',
            items: deserializeItems(data.todo_items)
          });
        }
        
        if (data.in_progress_items) {
          formattedSections.push({
            id: 'in_progress',
            title: 'In Progress',
            items: deserializeItems(data.in_progress_items)
          });
        }
        
        if (data.done_items) {
          formattedSections.push({
            id: 'done',
            title: 'Done',
            items: deserializeItems(data.done_items)
          });
        }
        
        setSections(formattedSections);
      } else {
        // Create default sections if no checklist exists
        const defaultSections = [
          { id: 'todo', title: 'To Do', items: [] },
          { id: 'in_progress', title: 'In Progress', items: [] },
          { id: 'done', title: 'Done', items: [] }
        ];
        setSections(defaultSections);
        
        // Create the checklist in the database
        await supabase.from('project_checklists').insert({
          project_id: projectId,
          todo_items: [],
          in_progress_items: [],
          done_items: []
        });
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast.error('Failed to load checklist');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initialize checklist
  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  // Save checklist changes to database
  const saveChecklist = useCallback(async () => {
    if (!projectId) return;

    try {
      // Convert sections to database format
      const todoSection = sections.find(s => s.id === 'todo');
      const inProgressSection = sections.find(s => s.id === 'in_progress');
      const doneSection = sections.find(s => s.id === 'done');

      const { error } = await supabase
        .from('project_checklists')
        .update({
          todo_items: todoSection ? serializeItems(todoSection.items) : [],
          in_progress_items: inProgressSection ? serializeItems(inProgressSection.items) : [],
          done_items: doneSection ? serializeItems(doneSection.items) : [],
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast.error('Failed to save checklist');
    }
  }, [projectId, sections]);

  // Save changes when sections change
  useEffect(() => {
    if (!loading && sections.length > 0) {
      saveChecklist();
    }
  }, [sections, loading, saveChecklist]);

  // Add a new task
  const handleAddTask = useCallback((sectionId: string) => {
    const taskText = newTaskTexts[sectionId] || '';
    if (!taskText.trim()) return;

    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: uuidv4(),
                text: taskText,
                completed: false,
                comments: []
              }
            ]
          };
        }
        return section;
      })
    );

    // Clear the input
    setNewTaskTexts(prev => ({
      ...prev,
      [sectionId]: ''
    }));
  }, [newTaskTexts]);

  // Delete a task
  const handleDeleteTask = useCallback((sectionId: string, taskId: string) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter(item => item.id !== taskId)
          };
        }
        return section;
      })
    );
  }, []);

  // Toggle task completion
  const handleToggleTaskCompletion = useCallback((sectionId: string, taskId: string, completed: boolean) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => 
              item.id === taskId ? { ...item, completed } : item
            )
          };
        }
        return section;
      })
    );
  }, []);

  // Update task text
  const handleUpdateTaskText = useCallback((sectionId: string, taskId: string, text: string) => {
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => 
              item.id === taskId ? { ...item, text } : item
            )
          };
        }
        return section;
      })
    );
  }, []);

  // Add comment to task
  const handleAddComment = useCallback((sectionId: string, taskId: string, comment: string) => {
    if (!comment.trim()) return;

    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === taskId) {
                const newComment: Comment = {
                  id: uuidv4(),
                  text: comment,
                  author: 'Current User',
                  createdAt: new Date().toISOString()
                };
                
                return {
                  ...item,
                  comments: [...item.comments, newComment]
                };
              }
              return item;
            })
          };
        }
        return section;
      })
    );
  }, []);

  // Open edit section dialog
  const openEditDialog = useCallback((sectionId: string, currentTitle: string) => {
    setEditingSectionId(sectionId);
    setEditedSectionTitle(currentTitle);
    setIsEditSectionOpen(true);
  }, []);

  // Edit section title
  const handleEditSection = useCallback(() => {
    if (!editedSectionTitle.trim()) return;

    setSections(prevSections => 
      prevSections.map(section => 
        section.id === editingSectionId 
          ? { ...section, title: editedSectionTitle } 
          : section
      )
    );

    setIsEditSectionOpen(false);
  }, [editedSectionTitle, editingSectionId]);

  // Add new section
  const handleAddSection = useCallback(() => {
    if (!newSectionTitle.trim()) return;

    setSections(prevSections => [
      ...prevSections,
      {
        id: uuidv4(),
        title: newSectionTitle,
        items: []
      }
    ]);

    setNewSectionTitle('');
  }, [newSectionTitle]);

  // Delete section
  const handleDeleteSection = useCallback((sectionId: string) => {
    // Don't allow deletion of default sections
    if (['todo', 'in_progress', 'done'].includes(sectionId)) {
      toast.error("Can't delete default sections");
      return;
    }
    
    setSections(prevSections => 
      prevSections.filter(section => section.id !== sectionId)
    );
  }, []);

  return {
    sections,
    setSections,
    loading,
    newTaskTexts,
    setNewTaskTexts,
    selectedTask,
    setSelectedTask,
    isEditSectionOpen,
    setIsEditSectionOpen,
    editedSectionTitle,
    setEditedSectionTitle,
    newSectionTitle,
    setNewSectionTitle,
    handleAddTask,
    handleDeleteTask,
    handleToggleTaskCompletion,
    handleUpdateTaskText,
    handleAddComment,
    openEditDialog,
    handleEditSection,
    handleAddSection,
    handleDeleteSection
  };
}
