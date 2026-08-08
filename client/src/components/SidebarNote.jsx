
import { useState, useRef, useEffect } from "react";

function SidebarNote({
    note,
    folder,
    currentNoteId,
    setCurrentNoteId,
    updateTitle,
    menu,
    setMenu,
    searchText,
}) {


    return (
        <div
            className={
                currentNoteId === note.id
                    ? "noteButton active"
                    : "noteButton"
            }
            onClick={() => setCurrentNoteId(note.id)}
        >
            <input
                className="noteTitle"
                value={note.title}
                onChange={(e) =>
                    updateTitle(note.id, e.target.value)
                }
            />
            {searchText.trim() && folder && (
                <div className="noteFolder">
                    📁 {folder.name}
                </div>
            )}
            {/* <div ref={openMenuId === note.id ? menuRef : null}> */}

            <button
                className="menuButton"
                onClick={(e) => {
                    e.stopPropagation();

                    const rect = e.currentTarget.getBoundingClientRect();

                    setMenu({
                        open: true,
                        note,
                        x: rect.right + 5,
                        y: rect.bottom,
                    });
                }}
            >
                ⋮
            </button>

            {/* </div> */}
        </div>
    );
}

export default SidebarNote;