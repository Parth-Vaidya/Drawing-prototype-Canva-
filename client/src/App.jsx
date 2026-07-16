import { useEffect, useState, useRef } from 'react'
import HomePage from "./components/HomePage";
import DrawingCanvas from './components/DrawingCanvas';
import NoteSheet from './components/NoteSheet';
import './style/App.css'

function App() {
  const editorRef = useRef(null);
  const [mode, setMode] = useState("drawing");
  const [redoStack, setRedoStack] = useState([]);
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);
  const [note, setNote] = useState(() => {
    const savedNote = localStorage.getItem("currentNote");
    if (savedNote) {
      return JSON.parse(savedNote);
    }
    return {
      id: 1,
      title: "Untitled",
      drawing: [],
      text: ""
    };
  })


  // const [note, setNote] = useState({
  //   id: 1,
  //   title: "Untitled",
  //   drawing: [],
  //   content:[]
  // });

  useEffect(() => {

    const saveNote = () => {

      const noteToSave = {
        ...note,
        text: editorRef.current
          ? editorRef.current.innerHTML
          : ""
      };

      localStorage.setItem(
        "currentNote",
        JSON.stringify(noteToSave)
      );

    };

    saveNote();

    if (editorRef.current) {
      editorRef.current.addEventListener("input", saveNote);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("input", saveNote);
      }
    };

  }, [note, editorRef]);
  useEffect(() => {

    if (
        editorRef.current &&
        note.text
    ) {
        editorRef.current.innerHTML = note.text;
    }

}, []);

  function saveNote() { }

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

  return (
    <>
      <HomePage
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        setBrushColor={setBrushColor}
        setBrushSize={setBrushSize}
        mode={mode}
        setMode={setMode}
      />

      <NoteSheet
        drawing={note.drawing}
        note={note}
        setNote={setNote}
        setRedoStack={setRedoStack}
        brushColor={brushColor}
        brushSize={brushSize}
        mode={mode}
        editorRef={editorRef}
      />
    </>
  );
}

export default App;
