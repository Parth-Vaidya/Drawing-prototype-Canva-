import { useState } from 'react'
import HomePage from "./components/HomePage";
import DrawingCanvas from './components/DrawingCanvas';
import './style/App.css'

function App() {
  const [redoStack, setRedoStack] = useState([]);
  const [note, setNote] = useState({
    id: 1,
    title: "Untitled",
    drawing: [],
    textBlocks: []
  });

  function clearCanvas() {
    setNote(prev => ({
      ...prev,
      drawing: []
    }));
  }

  function undo() {

    setNote(prev => {
      //if nothing has drawn yet
      if (prev.drawing.length === 0) return prev;
      //last stroke
      const lastStroke = prev.drawing[prev.drawing.length - 1];
      //Remove it from drawing
      setRedoStack(stack => [...stack, lastStroke]);
      //Update the note
      return {
        ...prev,
        drawing: prev.drawing.slice(0, -1)
      };
    });

  }

  function redo() {
    setRedoStack(stack => {
      if (stack.length === 0) return stack;

      const lastStroke = stack[stack.length - 1];

      setNote(prev => ({
        ...prev,
        drawing: [...prev.drawing, lastStroke]
      }));

      return stack.slice(0, -1);
    });

  }

  function saveNote() { }

  return (
    <>
      <HomePage clearCanvas={clearCanvas} undo={undo} redo={redo} />
      < DrawingCanvas
        drawing={note.drawing}
        setNote={setNote} 
        setRedoStack={setRedoStack}
        />
    </>
  );
}

export default App;
