import { useEffect, useState, useRef } from 'react'
import HomePage from "./components/HomePage";
import DrawingCanvas from './components/DrawingCanvas';
import NoteSheet from './components/NoteSheet';
import Sidebar from "./components/Sidebar";
import './style/App.css'

function App() {
  const editorRef = useRef(null);
  const [mode, setMode] = useState("drawing");
  const [redoStack, setRedoStack] = useState([]);
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);
  const [currentNoteId, setCurrentNoteId] = useState(() => {

    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);

      return parsed[0].id;
    }

    return 1;

  });

  const [notes, setNotes] = useState(() => {

    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    return [
      {
        id: 1,
        title: "Untitled",
        drawing: [],
        text: ""
      }
    ];
  });

  const currentNote = notes.find(
    note => note.id === currentNoteId
  );

  function updateCurrentNote(updatedFields) { // to show current note

    setNotes(prev =>
      prev.map(note =>
        note.id === currentNoteId ? {
          ...note,
          ...updatedFields
        }
          : note
      )
    );

  }


  // to render current note
  useEffect(() => {

    const saveNote = () => {

      const noteToSave = {
        ...notes,
        text: editorRef.current
          ? editorRef.current.innerHTML
          : ""
      };

      localStorage.setItem(
        "notes",
        JSON.stringify(notes)
      );

    };

    if (editorRef.current) {
      editorRef.current.addEventListener("input", saveNote);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("input", saveNote);
      }
    };

  }, [notes, editorRef]);

  //fix loading text
  useEffect(() => {

    if (
      editorRef.current &&
      currentNote
    ) {
      editorRef.current.innerHTML = currentNote.text || "";
    }

  }, [currentNote]);


  function createNewNote() { // to create new note and and assign id 
    const newNote = {
      id: Date.now(),
      title: "Untitled",
      drawing: [],
      text: ""
    };
    setNotes(prev => [
      ...prev,
      newNote
    ]);
    setCurrentNoteId(newNote.id);
  }


  function clearCanvas() {

    updateCurrentNote({
      drawing: []
    });

  }

  function undo() {

    if (currentNote.drawing.length === 0) return;

    const lastStroke =
      currentNote.drawing[currentNote.drawing.length - 1];

    setRedoStack(prev => [...prev, lastStroke]);

    updateCurrentNote({
      drawing: currentNote.drawing.slice(0, -1)
    });

  }

  function redo() {

    if (redoStack.length === 0) return;

    const lastStroke =
      redoStack[redoStack.length - 1];

    updateCurrentNote({
      drawing: [
        ...currentNote.drawing,
        lastStroke
      ]
    });

    setRedoStack(prev => prev.slice(0, -1));

  }

  function updateTitle(id, title) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? {
            ...note,
            title
          }
          : note
      )
    );

  }

  return (
    <div className="appLayout">
      <Sidebar
        notes={notes}
        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}
        createNewNote={createNewNote}
        updateTitle={updateTitle}
      />
      <div className="workspace">
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
          drawing={currentNote.drawing}
          note={currentNote}
          setNote={updateCurrentNote}
          setRedoStack={setRedoStack}
          brushColor={brushColor}
          brushSize={brushSize}
          mode={mode}
          editorRef={editorRef}
        />
      </div>

    </div>
  );
}

export default App;
