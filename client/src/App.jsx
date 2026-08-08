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

      if (parsed.length > 0) {
        return parsed[0].id;
      }
    }

    return 1;


  });

  const [notes, setNotes] = useState(() => {

    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);

      return parsedNotes.map(note => ({
        ...note,
        createdAt: note.createdAt ?? Date.now(),
        lastEdited: note.lastEdited ?? Date.now(),
        pinned: note.pinned ?? false,
        folderId: note.folderId ?? null,
      }));
    }
    return [
      {
        id: 1,
        title: "Untitled",
        drawing: [],
        text: "",
        folderId: null,
        pinned: false,
        createdAt: Date.now(),
        lastEdited: Date.now()
      }
    ];
  });

  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem("folders");

    return savedFolders
      ? JSON.parse(savedFolders)
      : [];
  });

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    // for data
    // console.log("Saving:", notes);

    localStorage.setItem(
      "notes",
      JSON.stringify(notes)
    );
  }, [notes]);

  useEffect(() => {

    if (
      editorRef.current &&
      currentNote
    ) {
      editorRef.current.innerHTML = currentNote.text || "";
    }

  }, [currentNote]);


 
function createNewNote(selectedFolderId = "all") { // to create new note and and assign id 
    const now = Date.now();

    const folderId =
        selectedFolderId === "all" ||
        selectedFolderId === "unfiled"
            ? null
            : selectedFolderId;

    const newNote = {
        id: now,
        title: "Untitled",
        text: "",
        drawing: [],
        folderId: folderId,
        pinned: false,
        createdAt: now,
        lastEdited: now
    };

    setNotes(prev => [
        ...prev,
        newNote
    ]);

    setCurrentNoteId(newNote.id);
}
  function createFolder(name) {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const newFolder = {
      id: Date.now(),
      name: trimmedName,
      createdAt: Date.now()
    };

    setFolders(prev => [
      ...prev,
      newFolder
    ]);
  }

  function deleteNote(id) {
    const updated = notes.filter(note => note.id !== id);

    if (updated.length === 0) {
      const newNote = {
        id: Date.now(),
        title: "Untitled",
        drawing: [],
        text: "",
        folderId: null,
        pinned: false,
        createdAt: Date.now(),
        lastEdited: Date.now()
      };

      setNotes([newNote]);
      setCurrentNoteId(newNote.id);
      return;
    }

    if (currentNoteId === id) {
      setCurrentNoteId(updated[0].id);
    }

    setNotes(updated);
  }

  function duplicateNote(id) {
    const noteToCopy = notes.find(note => note.id === id);

    if (!noteToCopy) return;

    const now = Date.now();

    const duplicated = {
      ...noteToCopy,
      id: now,
      title: `${noteToCopy.title} Copy`,
      createdAt: now,
      lastEdited: now,
    };

    setNotes(prev => [...prev, duplicated]);
    setCurrentNoteId(duplicated.id);
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

  function updateCurrentNote(updatedFields) { // to show current note

    setNotes(prev =>
      prev.map(note =>
        note.id === currentNoteId ? {
          ...note,
          ...updatedFields,
          lastEdited: Date.now(),
        }
          : note
      )
    );

  }

  function updateTitle(id, title) {
    setNotes(prev => {
      const updated = prev.map(note =>
        note.id === id
          ? { ...note, title, lastEdited: Date.now(), }
          : note
      );

      // console.log("Updated Notes:", updated);

      return updated;
    });
  }

  function updateText(id, text) {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? {
            ...note,
            text,
          }
          : note
      )
    );
  }

  function moveNoteToFolder(noteId, folderId) {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? {
            ...note,
            folderId: folderId,
            lastEdited: Date.now()
          }
          : note
      )
    );
  }

  function renameFolder(id, newName) {
    const trimmedName = newName.trim();

    if (!trimmedName) return;

    setFolders(prev =>
      prev.map(folder =>
        folder.id === id
          ? {
            ...folder,
            name: trimmedName
          }
          : folder
      )
    );
  }

  function deleteFolder(id) {

    setFolders(prev =>
      prev.filter(folder => folder.id !== id)
    );

    setNotes(prev =>
      prev.map(note =>
        note.folderId === id
          ? {
            ...note,
            folderId: null,
            lastEdited: Date.now()
          }
          : note
      )
    );
  }

  return (
    <div className="appLayout">
      <Sidebar
        notes={notes}
        folders={folders}

        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}

        createNewNote={createNewNote}
        createFolder={createFolder}
        moveNoteToFolder={moveNoteToFolder}

        renameFolder={renameFolder}
        deleteFolder={deleteFolder}

        updateTitle={updateTitle}
        deleteNote={deleteNote}
        duplicateNote={duplicateNote}
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
