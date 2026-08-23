import SidebarNote from "./SidebarNote.jsx";
import ContextMenu from "./ContextMenu.jsx";
import FolderContextMenu from "./FolderContextMenu.jsx";
import "../style/Sidebar.css";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    notes,
    folders,
    currentNoteId,
    setCurrentNoteId,
    createNewNote,
    createFolder,
    moveNoteToFolder,
    renameFolder,
    deleteFolder,
    updateTitle,
    deleteNote,
    duplicateNote,
}) {
    const menuRef = useRef(null);
    const folderMenuRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState("all");

    const [renamingFolderId, setRenamingFolderId] = useState(null);
    const [renameFolderText, setRenameFolderText] = useState("");

    const [folderMenu, setFolderMenu] = useState({
        open: false,
        folder: null,
        x: 0,
        y: 0,
    });


    const filteredNotes = notes.filter(note => {

        const matchesFolder =
            selectedFolderId === "all" ||
            (selectedFolderId === "unfiled" && note.folderId === null) ||
            note.folderId === selectedFolderId;

        const matchesSearch =
            note.title
                .toLowerCase()
                .includes(searchText.toLowerCase());

        return matchesFolder && matchesSearch;
    });

    const [menu, setMenu] = useState({
        open: false,
        note: null,
        x: 0,
        y: 0,
    });

    useEffect(() => {

        function handleClickOutside(e) {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setMenu(prev => ({
                    ...prev,
                    open: false,
                }));
            }

            if (
                folderMenuRef.current &&
                !folderMenuRef.current.contains(e.target)
            ) {
                setFolderMenu(prev => ({
                    ...prev,
                    open: false,
                }));
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    function handleCreateFolder() {
        const name = folderName.trim();

        if (!name) return;

        createFolder(name);

        setFolderName("");
        setShowFolderInput(false);
    }

    function startRenameFolder(folder) {
        setRenamingFolderId(folder.id);
        setRenameFolderText(folder.name);

        setFolderMenu(prev => ({
            ...prev,
            open: false,
        }));
    }

    function saveFolderRename() {
        const trimmedName = renameFolderText.trim();

        if (!trimmedName) return;

        renameFolder(
            renamingFolderId,
            trimmedName
        );

        setRenamingFolderId(null);
        setRenameFolderText("");
    }

    function cancelFolderRename() {
        setRenamingFolderId(null);
        setRenameFolderText("");
    }

    return (
        <aside className="sidebar">
            <div className="sidebarTopHeader">
                <h2>My Notes</h2>
                <button
                    className="sidebarCloseButton"
                    onClick={() => setIsSidebarOpen(false)}
                    title="Close sidebar"
                >
                    &lt;
                </button>
            </div>

            <div className="folderSection">

                <div className="folderHeader">
                    <span>Folders</span>

                    <button
                        className="addFolderButton"
                        onClick={() =>
                            setShowFolderInput(prev => !prev)
                        }
                    >
                        +
                    </button>
                </div>


                {showFolderInput && (
                    <div className="folderInputContainer">

                        <input
                            type="text"
                            placeholder="Folder name..."
                            value={folderName}
                            onChange={(e) =>
                                setFolderName(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleCreateFolder();
                                }
                            }}
                            autoFocus
                        />

                        <button onClick={handleCreateFolder}>
                            Add
                        </button>

                    </div>
                )}

                {/* ALL NOTES */}

                <div
                    className={`folderItem ${selectedFolderId === "all" ? "active" : ""
                        }`}
                    onClick={() => setSelectedFolderId("all")}
                >
                    <span>📄 All Notes</span>
                </div>


                {/* UNFILED */}

                <div
                    className={`folderItem ${selectedFolderId === "unfiled" ? "active" : ""
                        }`}
                    onClick={() => setSelectedFolderId("unfiled")}
                >
                    <span>📄 Unfiled</span>
                </div>


                {/* FOLDERS */}

                {folders.map(folder => (

                    <div
                        key={folder.id}
                        className={`folderItem ${selectedFolderId === folder.id ? "active" : ""
                            }`}
                        onClick={() => {
                            if (renamingFolderId !== folder.id) {
                                setSelectedFolderId(folder.id);
                            }
                        }}
                    >

                        {renamingFolderId === folder.id ? (

                            <div className="folderRenameContainer">

                                <span>📁</span>

                                <input
                                    autoFocus
                                    value={renameFolderText}
                                    onChange={(e) =>
                                        setRenameFolderText(e.target.value)
                                    }
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                    onKeyDown={(e) => {

                                        if (e.key === "Enter") {
                                            saveFolderRename();
                                        }

                                        if (e.key === "Escape") {
                                            cancelFolderRename();
                                        }

                                    }}
                                />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        saveFolderRename();
                                    }}
                                >
                                    ✓
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        cancelFolderRename();
                                    }}
                                >
                                    ×
                                </button>

                            </div>

                        ) : (

                            <>
                                <span>
                                    📁 {folder.name}
                                </span>

                                <button
                                    className="folderMenuButton"
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        setFolderMenu({
                                            open: true,
                                            folder: folder,
                                            x: e.clientX,
                                            y: e.clientY,
                                        });

                                    }}
                                >
                                    ⋮
                                </button>
                            </>

                        )}

                    </div>

                ))}

            </div>

            <input
                className="searchBar"
                type="text"
                placeholder="🔍 Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="notesList">
                {filteredNotes.map((note) => {

                    const folder = folders.find(
                        folder => folder.id === note.folderId
                    );

                    return (
                        <SidebarNote
                            key={note.id}
                            note={note}
                            folder={folder}
                            currentNoteId={currentNoteId}
                            setCurrentNoteId={setCurrentNoteId}
                            updateTitle={updateTitle}
                            deleteNote={deleteNote}
                            duplicateNote={duplicateNote}
                            menu={menu}
                            setMenu={setMenu}
                            searchText={searchText}
                        />
                    );

                })}
            </div>

            <button
                className="newNoteButton"
                onClick={() => createNewNote(selectedFolderId)}
            >
                + New Note
            </button>
            {createPortal(

                <FolderContextMenu
                    menu={folderMenu}
                    menuRef={folderMenuRef}
                    onRenameFolder={startRenameFolder}
                    deleteFolder={deleteFolder}
                    closeMenu={() =>
                        setFolderMenu(prev => ({
                            ...prev,
                            open: false,
                        }))
                    }
                />,

                document.body

            )}
            {createPortal(

                <ContextMenu
                    menu={menu}
                    menuRef={menuRef}
                    deleteNote={deleteNote}
                    duplicateNote={duplicateNote}
                    folders={folders}
                    moveNoteToFolder={moveNoteToFolder}
                    closeMenu={() =>
                        setMenu(prev => ({
                            ...prev,
                            open: false,
                        }))
                    }
                />,

                document.body

            )}

        </aside >
    );

}

export default Sidebar;