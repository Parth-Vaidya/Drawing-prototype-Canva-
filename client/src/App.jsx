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

        pages: [
          {
            id: 1,
            text: "",
            drawing: []
          }
        ],

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

  const [currentPageId, setCurrentPageId] = useState(null);

  const currentPage =
    currentNote?.pages?.find(
      page => page.id === currentPageId
    ) || currentNote?.pages?.[0];


  function createNewPage() {

    if (!currentNote) return;

    const newPage = {
      id: Date.now(),
      text: "",
      drawing: []
    };

    setNotes(prev =>
      prev.map(note =>
        note.id === currentNoteId
          ? {
            ...note,

            pages: [
              ...note.pages,
              newPage
            ],

            lastEdited: Date.now()
          }
          : note
      )
    );

    setCurrentPageId(newPage.id);

    // New page starts with a fresh undo/redo history
    setRedoStack([]);
  }

  useEffect(() => {

    if (!currentNote?.pages?.length) return;

    const pageExists = currentNote.pages.some(
      page => page.id === currentPageId
    );

    if (!pageExists) {
      setCurrentPageId(currentNote.pages[0].id);
      setRedoStack([]);
    }

  }, [currentNoteId, currentNote?.pages]);

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
      currentPage
    ) {
      editorRef.current.innerHTML =
        currentPage.text || "";
    }

  }, [currentPage]);

  function createNewNote(selectedFolderId = "all") {

    const now = Date.now();

    const folderId =
      selectedFolderId === "all" ||
        selectedFolderId === "unfiled"
        ? null
        : selectedFolderId;

    const newNote = {
      id: now,
      title: "Untitled",

      pages: [
        {
          id: now + 1,
          text: "",
          drawing: []
        }
      ],

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

    setRedoStack([]);
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

    const noteToCopy = notes.find(
      note => note.id === id
    );

    if (!noteToCopy) return;

    const now = Date.now();

    const duplicated = {
      ...noteToCopy,

      id: now,

      title: `${noteToCopy.title} Copy`,

      pages: noteToCopy.pages.map(page => ({
        ...page,

        id: Date.now() + Math.random(),

        drawing: page.drawing.map(stroke => ({
          ...stroke,

          points: stroke.points.map(point => ({
            ...point
          }))
        }))
      })),

      createdAt: now,
      lastEdited: now,
    };

    setNotes(prev => [
      ...prev,
      duplicated
    ]);

    setCurrentNoteId(duplicated.id);

    // Start the duplicated note on its first page
    setCurrentPageId(duplicated.pages[0].id);

    setRedoStack([]);
  }

  function clearCanvas() {

    updateCurrentPage({
      drawing: []
    });

    setRedoStack([]);
  }

  function undo() {

    if (!currentPage || currentPage.drawing.length === 0) {
      return;
    }

    const lastStroke =
      currentPage.drawing[
      currentPage.drawing.length - 1
      ];

    setRedoStack(prev => [
      ...prev,
      lastStroke
    ]);

    updateCurrentPage({
      drawing: currentPage.drawing.slice(0, -1)
    });
  }

  function redo() {

    if (!currentPage || redoStack.length === 0) {
      return;
    }

    const lastStroke =
      redoStack[redoStack.length - 1];

    updateCurrentPage({
      drawing: [
        ...currentPage.drawing,
        lastStroke
      ]
    });

    setRedoStack(prev =>
      prev.slice(0, -1)
    );
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

  function updateCurrentPage(updatedFields) {

    setNotes(prev =>
      prev.map(note =>
        note.id === currentNoteId
          ? {
            ...note,

            pages: note.pages.map(page =>
              page.id === currentPageId
                ? {
                  ...page,
                  ...updatedFields
                }
                : page
            ),

            lastEdited: Date.now()
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


  function goToPage(pageId) {

    if (!currentNote) return;

    const pageExists = currentNote.pages.some(
      page => page.id === pageId
    );

    if (!pageExists) return;

    setCurrentPageId(pageId);

    // A page has its own drawing history
    setRedoStack([]);
  }

  function goToPreviousPage() {

    if (!currentNote || !currentPage) return;

    const currentIndex =
      currentNote.pages.findIndex(
        page => page.id === currentPage.id
      );

    if (currentIndex <= 0) return;

    const previousPage =
      currentNote.pages[currentIndex - 1];

    goToPage(previousPage.id);
  }

  function goToNextPage() {

    if (!currentNote || !currentPage) return;

    const currentIndex =
      currentNote.pages.findIndex(
        page => page.id === currentPage.id
      );

    if (
      currentIndex === -1 ||
      currentIndex >= currentNote.pages.length - 1
    ) {
      return;
    }

    const nextPage =
      currentNote.pages[currentIndex + 1];

    goToPage(nextPage.id);
  }


  function deleteCurrentPage() {

    if (!currentNote || !currentPage) return;

    // Don't allow the note to have zero pages
    if (currentNote.pages.length <= 1) {
      return;
    }

    const currentIndex =
      currentNote.pages.findIndex(
        page => page.id === currentPage.id
      );

    const remainingPages =
      currentNote.pages.filter(
        page => page.id !== currentPage.id
      );

    setNotes(prev =>
      prev.map(note =>
        note.id === currentNoteId
          ? {
            ...note,
            pages: remainingPages,
            lastEdited: Date.now()
          }
          : note
      )
    );

    // Select a sensible page after deletion
    const newIndex = Math.min(
      currentIndex,
      remainingPages.length - 1
    );

    setCurrentPageId(
      remainingPages[newIndex].id
    );

    // Deleted page should not retain redo history
    setRedoStack([]);
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
          createNewNote={createNewNote}
          createNewPage={createNewPage}

          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}

          currentPageNumber={
            currentNote?.pages?.findIndex(
              page => page.id === currentPage?.id
            ) + 1
          }

          totalPages={
            currentNote?.pages?.length || 0
          }

          setBrushColor={setBrushColor}
          setBrushSize={setBrushSize}
          mode={mode}
          setMode={setMode}
          deleteCurrentPage={deleteCurrentPage}
        />
        <NoteSheet
          drawing={currentPage?.drawing || []}
          note={currentPage}
          setNote={updateCurrentPage}
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
