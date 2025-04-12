
import React, { useRef, useEffect } from 'react';
import { useWhiteboardTools } from '@/hooks/useWhiteboardTools';
import WhiteboardToolbar from './WhiteboardToolbar';
import { toast } from 'sonner';

interface InteractiveWhiteboardProps {
  projectId?: string;
}

const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({ projectId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    canvas,
    isLoading,
    setupCanvas,
    currentMode,
    setCurrentMode,
    isDrawing,
    setIsDrawing,
    activateTool,
    deactivateAllTools,
    addShape,
    selectShape,
    deleteSelection,
    zoomIn,
    zoomOut,
    resetZoom,
    saveCanvas,
    canvasChanged,
    whiteboardMode,
    toggleWhiteboardMode
  } = useWhiteboardTools(projectId || '');

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const initCanvas = async () => {
      try {
        const cleanup = await setupCanvas(canvasRef.current);
        return cleanup;
      } catch (error) {
        console.error('Failed to initialize canvas:', error);
        toast.error('Failed to load whiteboard. Please refresh the page.');
      }
    };
    
    const cleanupFn = initCanvas();
    
    return () => {
      cleanupFn?.then(cleanup => {
        if (cleanup) cleanup();
      });
    };
  }, [setupCanvas]);

  // Handler functions for the toolbar
  const handleToolSelect = (tool: string) => {
    if (tool === 'select') {
      deactivateAllTools();
      selectShape();
    } else if (tool === 'pencil' || tool === 'eraser') {
      activateTool(tool);
    }
  };

  const handleAddShape = (type: 'rect' | 'circle') => {
    addShape(type);
  };

  const handleAddStickyNote = () => {
    if (canvas) {
      setCurrentMode('sticky');
    }
  };

  const handleAddText = () => {
    if (canvas) {
      setCurrentMode('text');
    }
  };

  const handleAddSection = () => {
    if (canvas) {
      setCurrentMode('section');
    }
  };

  const handleAddLine = (isArrow: boolean = false) => {
    if (canvas) {
      setCurrentMode(isArrow ? 'arrow' : 'line');
    }
  };

  const handleUndo = () => {
    if (canvas) {
      setCurrentMode('undo');
    }
  };

  const handleRedo = () => {
    if (canvas) {
      setCurrentMode('redo');
    }
  };

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  return (
    <div className="flex flex-col w-full h-[600px] bg-gray-50">
      <WhiteboardToolbar 
        activeTool={currentMode}
        whiteboardMode={whiteboardMode}
        onToolSelect={handleToolSelect}
        onAddShape={handleAddShape}
        onAddStickyNote={handleAddStickyNote}
        onAddText={handleAddText}
        onAddSection={handleAddSection}
        onAddLine={handleAddLine}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSave={saveCanvas}
        onDelete={deleteSelection}
        onToggleWhiteboardMode={toggleWhiteboardMode}
        isSaving={isLoading}
      />
      
      <div className="relative flex-1 m-4 overflow-hidden bg-white rounded-xl shadow-xl">
        <div className="absolute inset-0 bg-grid-gray-200">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full touch-pan"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;
