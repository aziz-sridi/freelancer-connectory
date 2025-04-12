
import { fabric } from 'fabric';
import { toast } from 'sonner';
import {
  addShape,
  addStickyNote,
  addTaskCard,
  addText,
  addSection,
  addLine,
  createDefaultTaskSections
} from '@/components/whiteboard/WhiteboardShapes';

export function useWhiteboardShapes(canvas: fabric.Canvas | null = null) {
  // Shape-adding wrappers
  const handleAddShape = (type: 'rect' | 'circle') => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    addShape(canvas, type);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddStickyNote = () => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    addStickyNote(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddTaskCard = () => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    addTaskCard(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  const handleAddText = () => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    addText(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  // Create new section
  const handleAddSection = () => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    const colors = [
      { color: '#f3f4f6', textColor: '#111827' }, // Gray
      { color: '#e5edff', textColor: '#1e40af' }, // Blue
      { color: '#f0fdf4', textColor: '#166534' }, // Green
      { color: '#fff7ed', textColor: '#9a3412' }, // Orange
      { color: '#fef2f2', textColor: '#991b1b' }, // Red
      { color: '#f5f3ff', textColor: '#5b21b6' }  // Purple
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const section = addSection(
      canvas, 
      'New Section', 
      randomColor.color, 
      randomColor.textColor, 
      canvas.width! / 2 - 125, 
      canvas.height! / 2 - 150
    );
    
    canvas.fire('object:added', { target: section });
    canvas.renderAll();
  };

  // Add default task sections
  const handleAddDefaultSections = () => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    createDefaultTaskSections(canvas);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  // Add a method to handle adding lines and arrows
  const handleAddLine = (isArrow: boolean = false) => {
    if (!canvas) {
      toast.error("Canvas not ready. Please wait for the whiteboard to initialize.");
      return;
    }
    
    addLine(canvas, isArrow);
    canvas.fire('object:added');
    canvas.renderAll();
  };

  return {
    handleAddShape,
    handleAddStickyNote,
    handleAddTaskCard,
    handleAddText,
    handleAddSection,
    handleAddDefaultSections,
    handleAddLine
  };
}
