import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import NoteSheet from "./components/NoteSheet";
import Sidebar from "./components/Sidebar";
import "./style/App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [mode, setMode] = useState("drawing");

  const [editor, setEditor] = useState(null);

  const [redoStack, setRedoStack] = useState([]);

  const [brushColor, setBrushColor] = useState("black");

  const [brushSize, setBrushSize] = useState(3);

  // =========================================================
  // CURRENT NOTE
  // =========================================================

  const [currentNoteId, setCurrentNoteId] = useState(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);

        if (parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (error) {
        console.error("Failed to read saved notes:", error);
      }
    }

    return 1;
  });

  // =========================================================
  // NOTES
  // =========================================================

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);

        return parsedNotes.map((note) => {
          /*
           * Make sure every note has the new multi-page structure.
           *
           * This also protects older notes that were created before
           * pages were introduced.
           */
          if (!note.pages || !Array.isArray(note.pages) || note.pages.length === 0) {
            return {
              ...note,

              pages: [
                {
                  id: Date.now() + Math.random(),
                  text: note.text || "",
                  drawing: Array.isArray(note.drawing)
                    ? note.drawing
                    : [],
                },
              ],

              createdAt: note.createdAt ?? Date.now(),
              lastEdited: note.lastEdited ?? Date.now(),
              pinned: note.pinned ?? false,
              folderId: note.folderId ?? null,
            };
          }

          return {
            ...note,

            pages: note.pages.map((page) => ({
              ...page,
              text: page.text ?? "",
              drawing: Array.isArray(page.drawing)
                ? page.drawing
                : [],
            })),

            createdAt: note.createdAt ?? Date.now(),
            lastEdited: note.lastEdited ?? Date.now(),
            pinned: note.pinned ?? false,
            folderId: note.folderId ?? null,
          };
        });
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }

    // Default note
    return [
      {
        id: 1,
        title: "Untitled",

        pages: [
          {
            id: 1,
            text: "",
            drawing: [],
          },
        ],

        folderId: null,
        pinned: false,
        createdAt: Date.now(),
        lastEdited: Date.now(),
      },
    ];
  });

  // =========================================================
  // FOLDERS
  // =========================================================

  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem("folders");

    if (!savedFolders) {
      return [];
    }

    try {
      return JSON.parse(savedFolders);
    } catch (error) {
      console.error("Failed to load folders:", error);
      return [];
    }
  });

  // =========================================================
  // CURRENT NOTE / PAGE
  // =========================================================

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  const [currentPageId, setCurrentPageId] = useState(null);

  const currentPage =
    currentNote?.pages?.find(
      (page) => page.id === currentPageId
    ) || currentNote?.pages?.[0];

  // =========================================================
  // CREATE NEW PAGE
  // =========================================================

  function createNewPage() {
    if (!currentNote) return;

    const newPage = {
      id: Date.now(),
      text: "",
      drawing: [],
    };

    setNotes((prev) =>
      prev.map((note) =>
        note.id === currentNoteId
          ? {
            ...note,

            pages: [
              ...(note.pages || []),
              newPage,
            ],

            lastEdited: Date.now(),
          }
          : note
      )
    );

    setCurrentPageId(newPage.id);

    // New page gets fresh undo/redo history
    setRedoStack([]);
  }

  // =========================================================
  // MAKE SURE CURRENT PAGE EXISTS
  // =========================================================

  useEffect(() => {
    if (!currentNote?.pages?.length) return;

    const pageExists = currentNote.pages.some(
      (page) => page.id === currentPageId
    );

    if (!pageExists) {
      setCurrentPageId(currentNote.pages[0].id);
      setRedoStack([]);
    }
  }, [currentNoteId, currentNote?.pages, currentPageId]);

  // =========================================================
  // SAVE FOLDERS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "folders",
      JSON.stringify(folders)
    );
  }, [folders]);

  // =========================================================
  // SAVE NOTES
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "notes",
      JSON.stringify(notes)
    );
  }, [notes]);

  // =========================================================
  // CREATE NEW NOTE
  // =========================================================

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
          drawing: [],
        },
      ],

      folderId,
      pinned: false,
      createdAt: now,
      lastEdited: now,
    };

    setNotes((prev) => [
      ...prev,
      newNote,
    ]);

    setCurrentNoteId(newNote.id);

    setCurrentPageId(newNote.pages[0].id);

    setRedoStack([]);
  }

  // =========================================================
  // CREATE FOLDER
  // =========================================================

  function createFolder(name) {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const newFolder = {
      id: Date.now(),
      name: trimmedName,
      createdAt: Date.now(),
    };

    setFolders((prev) => [
      ...prev,
      newFolder,
    ]);
  }

  // =========================================================
  // DELETE NOTE
  // =========================================================

  function deleteNote(id) {
    const updated = notes.filter(
      (note) => note.id !== id
    );

    /*
     * Always keep at least one note.
     */
    if (updated.length === 0) {
      const now = Date.now();

      const newNote = {
        id: now,
        title: "Untitled",

        pages: [
          {
            id: now + 1,
            text: "",
            drawing: [],
          },
        ],

        folderId: null,
        pinned: false,
        createdAt: now,
        lastEdited: now,
      };

      setNotes([newNote]);

      setCurrentNoteId(newNote.id);

      setCurrentPageId(newNote.pages[0].id);

      setRedoStack([]);

      return;
    }

    /*
     * If deleting the currently selected note,
     * select another note.
     */
    if (currentNoteId === id) {
      setCurrentNoteId(updated[0].id);

      if (updated[0].pages?.length > 0) {
        setCurrentPageId(updated[0].pages[0].id);
      }

      setRedoStack([]);
    }

    setNotes(updated);
  }

  // =========================================================
  // DUPLICATE NOTE
  // =========================================================

  function duplicateNote(id) {
    const noteToCopy = notes.find(
      (note) => note.id === id
    );

    if (!noteToCopy) return;

    const now = Date.now();

    const duplicated = {
      ...noteToCopy,

      id: now,

      title: `${noteToCopy.title} Copy`,

      pages: noteToCopy.pages.map((page) => ({
        ...page,

        id: Date.now() + Math.random(),

        drawing: page.drawing.map((stroke) => ({
          ...stroke,

          points: stroke.points.map((point) => ({
            ...point,
          })),
        })),
      })),

      createdAt: now,

      lastEdited: now,
    };

    setNotes((prev) => [
      ...prev,
      duplicated,
    ]);

    setCurrentNoteId(duplicated.id);

    setCurrentPageId(
      duplicated.pages[0].id
    );

    setRedoStack([]);
  }

  // =========================================================
  // CLEAR CANVAS
  // =========================================================

  function clearCanvas() {
    updateCurrentPage({
      drawing: [],
    });

    setRedoStack([]);
  }

  // =========================================================
  // UNDO
  // =========================================================

  function undo() {
    if (
      !currentPage ||
      currentPage.drawing.length === 0
    ) {
      return;
    }

    const lastStroke =
      currentPage.drawing[
      currentPage.drawing.length - 1
      ];

    setRedoStack((prev) => [
      ...prev,
      lastStroke,
    ]);

    updateCurrentPage({
      drawing:
        currentPage.drawing.slice(0, -1),
    });
  }

  // =========================================================
  // REDO
  // =========================================================

  function redo() {
    if (
      !currentPage ||
      redoStack.length === 0
    ) {
      return;
    }

    const lastStroke =
      redoStack[
      redoStack.length - 1
      ];

    updateCurrentPage({
      drawing: [
        ...currentPage.drawing,
        lastStroke,
      ],
    });

    setRedoStack((prev) =>
      prev.slice(0, -1)
    );
  }

  // =========================================================
  // UPDATE CURRENT NOTE
  // =========================================================

  function updateCurrentNote(updatedFields) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === currentNoteId
          ? {
            ...note,
            ...updatedFields,
            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // UPDATE CURRENT PAGE
  // =========================================================

  function updateCurrentPage(updatedFields) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === currentNoteId
          ? {
            ...note,

            pages: note.pages.map((page) =>
              page.id === currentPageId
                ? {
                  ...page,
                  ...updatedFields,
                }
                : page
            ),

            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // UPDATE NOTE TITLE
  // =========================================================

  function updateTitle(id, title) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
            ...note,
            title,
            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // UPDATE TEXT
  // =========================================================

  function updateText(id, text) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
            ...note,
            text,
            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // MOVE NOTE TO FOLDER
  // =========================================================

  function moveNoteToFolder(noteId, folderId) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
            ...note,
            folderId,
            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // RENAME FOLDER
  // =========================================================

  function renameFolder(id, newName) {
    const trimmedName = newName.trim();

    if (!trimmedName) return;

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id
          ? {
            ...folder,
            name: trimmedName,
          }
          : folder
      )
    );
  }

  // =========================================================
  // DELETE FOLDER
  // =========================================================

  function deleteFolder(id) {
    setFolders((prev) =>
      prev.filter(
        (folder) => folder.id !== id
      )
    );

    /*
     * Notes inside a deleted folder become unfiled.
     */
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === id
          ? {
            ...note,
            folderId: null,
            lastEdited: Date.now(),
          }
          : note
      )
    );
  }

  // =========================================================
  // GO TO PAGE
  // =========================================================

  function goToPage(pageId) {
    if (!currentNote) return;

    const pageExists =
      currentNote.pages.some(
        (page) => page.id === pageId
      );

    if (!pageExists) return;

    setCurrentPageId(pageId);

    // Each page gets fresh redo history
    setRedoStack([]);
  }

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  function goToPreviousPage() {
    if (!currentNote || !currentPage) {
      return;
    }

    const currentIndex =
      currentNote.pages.findIndex(
        (page) => page.id === currentPage.id
      );

    if (currentIndex <= 0) {
      return;
    }

    const previousPage =
      currentNote.pages[
      currentIndex - 1
      ];

    goToPage(previousPage.id);
  }

  // =========================================================
  // NEXT PAGE
  // =========================================================

  function goToNextPage() {
    if (!currentNote || !currentPage) {
      return;
    }

    const currentIndex =
      currentNote.pages.findIndex(
        (page) => page.id === currentPage.id
      );

    if (
      currentIndex === -1 ||
      currentIndex >=
      currentNote.pages.length - 1
    ) {
      return;
    }

    const nextPage =
      currentNote.pages[
      currentIndex + 1
      ];

    goToPage(nextPage.id);
  }

  // =========================================================
  // DELETE CURRENT PAGE
  // =========================================================

  function deleteCurrentPage() {
    if (!currentNote || !currentPage) {
      return;
    }

    /*
     * A note must always have at least one page.
     */
    if (currentNote.pages.length <= 1) {
      return;
    }

    const currentIndex =
      currentNote.pages.findIndex(
        (page) => page.id === currentPage.id
      );

    const remainingPages =
      currentNote.pages.filter(
        (page) => page.id !== currentPage.id
      );

    setNotes((prev) =>
      prev.map((note) =>
        note.id === currentNoteId
          ? {
            ...note,
            pages: remainingPages,
            lastEdited: Date.now(),
          }
          : note
      )
    );

    /*
     * Select a sensible page after deletion.
     */
    const newIndex = Math.min(
      currentIndex,
      remainingPages.length - 1
    );

    setCurrentPageId(
      remainingPages[newIndex].id
    );

    setRedoStack([]);
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={`appLayout ${isSidebarOpen
          ? "sidebarOpen"
          : "sidebarClosed"
        }`}
    >
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}

        notes={notes}
        folders={folders}

        currentNoteId={currentNoteId}
        setCurrentNoteId={setCurrentNoteId}

        createNewNote={createNewNote}
        createFolder={createFolder}

        moveNoteToFolder={
          moveNoteToFolder
        }

        renameFolder={renameFolder}
        deleteFolder={deleteFolder}

        updateTitle={updateTitle}
        deleteNote={deleteNote}
        duplicateNote={duplicateNote}
      />

      {/* =====================================================
          MAIN WORKSPACE
          ===================================================== */}

      <main className="workspace">

        {/* ===================================================
            TOP / TOOLBAR AREA
            =================================================== */}

        <div className="workspaceTop">
          <HomePage
            editor={editor}
            clearCanvas={clearCanvas}
            undo={undo}
            redo={redo}

            createNewNote={
              createNewNote
            }

            createNewPage={
              createNewPage
            }

            goToPreviousPage={
              goToPreviousPage
            }

            goToNextPage={
              goToNextPage
            }

            currentPageNumber={
              currentNote?.pages?.findIndex(
                (page) =>
                  page.id ===
                  currentPage?.id
              ) + 1
            }

            totalPages={
              currentNote?.pages?.length ||
              0
            }

            setBrushColor={
              setBrushColor
            }

            setBrushSize={
              setBrushSize
            }

            mode={mode}
            setMode={setMode}

            deleteCurrentPage={
              deleteCurrentPage
            }
          />
        </div>

        {/* ===================================================
            SHEET AREA
            =================================================== */}

        <div className="workspaceSheet">
          <NoteSheet
            drawing={
              currentPage?.drawing || []
            }
            onEditorReady={setEditor}

            note={currentPage}

            setNote={
              updateCurrentPage
            }

            setRedoStack={
              setRedoStack
            }

            brushColor={
              brushColor
            }

            brushSize={
              brushSize
            }

            mode={mode}
          />
        </div>

      </main>

      {/* =====================================================
          OPEN SIDEBAR TAB
          ===================================================== */}

      {!isSidebarOpen && (
        <button
          className="sidebarOpenTab"
          onClick={() =>
            setIsSidebarOpen(true)
          }
          aria-label="Open sidebar"
        >
          &gt;
        </button>
      )}
    </div>
  );
}

export default App;