
import { fabric } from 'fabric';
import { WhiteboardSection } from '@/types/whiteboard';

export function addSection(canvas: fabric.Canvas, title: string, color: string, textColor: string, left: number, top: number) {
  const rect = new fabric.Rect({
    width: 250,
    height: 300,
    fill: color,
    rx: 10,
    ry: 10,
    strokeWidth: 1,
    stroke: '#e5e7eb',
  });
  
  const text = new fabric.Textbox(title, {
    top: 10,
    width: 230,
    left: 10,
    fontSize: 18,
    fontWeight: 'bold',
    fill: textColor,
    fontFamily: 'Arial',
    textAlign: 'center',
    selectable: true,
    editable: true,
  });
  
  const addButton = new fabric.Textbox('+ Add Task', {
    top: 40,
    width: 230,
    left: 10,
    fontSize: 14,
    fill: textColor,
    fontFamily: 'Arial',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 5,
  });
  
  const group = new fabric.Group([rect, text, addButton], {
    left: left,
    top: top,
    subTargetCheck: true,
    selectable: true,
    hasControls: true,
  });
  
  // Add custom properties to the group
  group.toObject = (function(toObject) {
    return function() {
      return fabric.util.object.extend(toObject.call(this), {
        sectionId: this.sectionId,
        sectionTitle: this.sectionTitle
      });
    };
  })(group.toObject);
  
  group.sectionId = Math.random().toString(36).substring(2, 9);
  group.sectionTitle = title;
  
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  return group;
}

export function createDefaultTaskSections(canvas: fabric.Canvas) {
  const defaultSections = [
    { title: 'To Do', color: '#f3f4f6', textColor: '#111827' },
    { title: 'In Progress', color: '#e5edff', textColor: '#1e40af' },
    { title: 'Done', color: '#f0fdf4', textColor: '#166534' }
  ];
  
  const canvasWidth = canvas.getWidth();
  const spacing = 20;
  const sectionWidth = 250;
  const startLeft = (canvasWidth - (sectionWidth * defaultSections.length + spacing * (defaultSections.length - 1))) / 2;
  
  defaultSections.forEach((section, index) => {
    const left = startLeft + (sectionWidth + spacing) * index;
    addSection(canvas, section.title, section.color, section.textColor, left, 70);
  });
  
  canvas.renderAll();
}

export function createBlankWhiteboard(canvas: fabric.Canvas) {
  canvas.clear();
  canvas.setBackgroundColor('#f8f9fa', canvas.renderAll.bind(canvas));
  canvas.renderAll();
}
