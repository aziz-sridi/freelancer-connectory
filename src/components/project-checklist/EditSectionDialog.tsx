
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

interface EditSectionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editedSectionTitle: string;
  setEditedSectionTitle: (title: string) => void;
  handleEditSection: () => void;
}

const EditSectionDialog: React.FC<EditSectionDialogProps> = ({
  isOpen,
  setIsOpen,
  editedSectionTitle,
  setEditedSectionTitle,
  handleEditSection
}) => {
  const onSubmit = () => {
    if (editedSectionTitle.trim()) {
      handleEditSection();
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Change the title of this section
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={editedSectionTitle}
            onChange={(e) => setEditedSectionTitle(e.target.value)}
            placeholder="Section title"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmit();
              }
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={onSubmit}
            disabled={!editedSectionTitle.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSectionDialog;
