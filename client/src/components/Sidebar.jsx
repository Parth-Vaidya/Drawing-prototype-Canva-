import "../style/Sidebar.css";

function Sidebar({
    notes,
    currentNoteId,
    setCurrentNoteId,
    createNewNote,
    updateTitle
}) {

    return (
        <div className="sidebar">
            <h2>My Notes</h2>
            {
                notes.map(note => (
                    <button
                        key={note.id}
                        className={
                            currentNoteId === note.id
                                ? "noteButton active"
                                : "noteButton"
                        }
                        onClick={() => setCurrentNoteId(note.id)}
                    >
                        <input
                            value={note.title}
                            onChange={(e) =>
                                updateTitle(note.id, e.target.value)
                            }
                            className="noteTitle"
                        />
                    </button>
                ))
            }

            <button
                className="newNoteButton"
                onClick={createNewNote}
            >
                + New Note
            </button>

        </div>
    );

}

export default Sidebar;