import "../style/ContextMenu.css";
import { useState } from "react";

function ContextMenu({
    menu,
    menuRef,
    duplicateNote,
    deleteNote,
    closeMenu,
    folders,
    moveNoteToFolder
}) {

    const [showMoveMenu, setShowMoveMenu] = useState(false);

    if (!menu.open) return null;

    return (
        <div
            ref={menuRef}
            className="contextMenu"
            style={{
                position: "fixed",
                left: menu.x,
                top: menu.y,
            }}
        >

            <button>
                Rename
            </button>

            <button
                onClick={() =>
                    setShowMoveMenu(prev => !prev)
                }
            >
                Move to {showMoveMenu ? "▲" : "▶"}
            </button>

            {showMoveMenu && (
                <div className="moveFolderMenu">

                    {folders.length === 0 ? (
                        <div className="noFolders">
                            No folders
                        </div>
                    ) : (
                        folders.map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => {
                                    moveNoteToFolder(
                                        menu.note.id,
                                        folder.id
                                    );

                                    closeMenu();
                                }}
                            >
                                📁 {folder.name}
                            </button>
                        ))
                    )}

                    <button
                        onClick={() => {
                            moveNoteToFolder(
                                menu.note.id,
                                null
                            );

                            closeMenu();
                        }}
                    >
                        📄 No Folder
                    </button>

                </div>
            )}

            <button
                onClick={() => {
                    duplicateNote(menu.note.id);
                    closeMenu();
                }}
            >
                Duplicate
            </button>

            <button
                onClick={() => {
                    deleteNote(menu.note.id);
                    closeMenu();
                }}
            >
                Delete
            </button>

        </div>
    );
}

export default ContextMenu;