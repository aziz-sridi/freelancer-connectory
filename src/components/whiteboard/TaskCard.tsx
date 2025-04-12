
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import TaskForm from './task-card/TaskForm';
import SubtaskList from './task-card/SubtaskList';
import TaskMetadata from './task-card/TaskMetadata';
import TagInput from './task-card/TagInput';

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskCardProps {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
  subtasks?: SubTask[];
  onClose?: () => void;
  onSave?: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title = '',
  description = '',
  dueDate = '',
  assignee = '',
  tags = [],
  subtasks = [],
  onClose,
  onSave
}) => {
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description);
  const [taskDueDate, setTaskDueDate] = useState(dueDate);
  const [taskAssignee, setTaskAssignee] = useState(assignee);
  const [taskTags, setTaskTags] = useState<string[]>(tags);
  const [taskSubtasks, setTaskSubtasks] = useState<SubTask[]>(subtasks.length ? subtasks : [
    { id: '1', text: '', completed: false }
  ]);
  
  const handleAddSubtask = () => {
    setTaskSubtasks([
      ...taskSubtasks,
      { id: Date.now().toString(), text: '', completed: false }
    ]);
  };
  
  const handleRemoveSubtask = (id: string) => {
    setTaskSubtasks(taskSubtasks.filter(task => task.id !== id));
  };
  
  const handleSubtaskChange = (id: string, text: string) => {
    setTaskSubtasks(taskSubtasks.map(task => 
      task.id === id ? { ...task, text } : task
    ));
  };
  
  const handleSubtaskToggle = (id: string, completed: boolean) => {
    setTaskSubtasks(taskSubtasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };
  
  const handleReorderSubtasks = (reorderedSubtasks: SubTask[]) => {
    setTaskSubtasks(reorderedSubtasks);
  };
  
  const handleAddTag = (tag: string) => {
    if (!taskTags.includes(tag)) {
      setTaskTags([...taskTags, tag]);
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTaskTags(taskTags.filter(t => t !== tag));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        id: id || Date.now().toString(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        assignee: taskAssignee,
        tags: taskTags,
        subtasks: taskSubtasks.filter(task => task.text.trim())
      });
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          {id ? 'Edit Task' : 'New Task'}
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskForm
          title={taskTitle}
          description={taskDescription}
          onTitleChange={setTaskTitle}
          onDescriptionChange={setTaskDescription}
        />
        
        <SubtaskList
          subtasks={taskSubtasks}
          onAddSubtask={handleAddSubtask}
          onChangeSubtask={handleSubtaskChange}
          onToggleSubtask={handleSubtaskToggle}
          onRemoveSubtask={handleRemoveSubtask}
          onReorderSubtasks={handleReorderSubtasks}
        />
        
        <TaskMetadata
          dueDate={taskDueDate}
          assignee={taskAssignee}
          onDueDateChange={setTaskDueDate}
          onAssigneeChange={setTaskAssignee}
        />
        
        <TagInput
          tags={taskTags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          Save Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
