
import { useState, useRef, useEffect } from "react";

function SidebarNote({
    note,
    currentNoteId,
    setCurrentNoteId,
    updateTitle,
    menu,
    setMenu
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

                {/* {openMenuId === note.id && (
                    <NoteMenu
                        note={note}
                        deleteNote={deleteNote}
                        duplicateNote={duplicateNote}
                        closeMenu={() => setOpenMenuId(null)}
                    />
                )} */}
            {/* </div> */}
        </div>
    );
}

export default SidebarNote;